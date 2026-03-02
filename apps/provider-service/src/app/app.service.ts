import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { createHmac } from 'crypto';
import { PrismaService, generateSpNumber } from '@my-workspace/prisma';

const BUDPAY_BASE = 'https://api.budpay.com/api/v2';

/** Recursively sort object keys alphabetically (BudPay requirement) */
function sortKeysAlphabetically(obj: unknown): unknown {
  if (obj == null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sortKeysAlphabetically);
  return Object.keys(obj)
    .sort()
    .reduce(
      (acc, k) => ({ ...acc, [k]: sortKeysAlphabetically((obj as Record<string, unknown>)[k]) }),
      {} as Record<string, unknown>
    );
}

/** BudPay requires HMAC-SHA512 of payload (keys sorted alphabetically) as Encryption header */
function budpaySignature(payload: object, secretKey: string): string {
  const sorted = sortKeysAlphabetically(payload) as object;
  const payloadStr = JSON.stringify(sorted);
  return createHmac('sha512', secretKey).update(payloadStr).digest('hex');
}

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async createProvider(payload: {
    name: string;
    email?: string;
    accountNumber?: string;
    bankName?: string;
    bankCode?: string;
    agreedAmount?: number;
    percentageToAdd?: number;
    providerCutPercentage?: number;
    agreedAt?: string; // ISO date
    agreedTerms?: string;
  }) {
    // providerCutPercentage must not exceed percentageToAdd
    const totalPct = payload.percentageToAdd ?? 0;
    const providerCut = Math.min(payload.providerCutPercentage ?? 0, totalPct);

    let providerNumber: string;
    let exists: { id: string } | null;
    do {
      providerNumber = generateSpNumber();
      exists = await this.prisma.provider.findUnique({
        where: { providerNumber },
        select: { id: true },
      });
    } while (exists);
    const provider = await this.prisma.provider.create({
      data: {
        providerNumber,
        name: payload.name,
        email: payload.email ?? null,
        accountNumber: payload.accountNumber ?? null,
        bankName: payload.bankName ?? null,
        bankCode: payload.bankCode ?? null,
        agreedAmount: payload.agreedAmount ?? null,
        percentageToAdd: totalPct,
        providerCutPercentage: providerCut,
        agreedAt: payload.agreedAt ? new Date(payload.agreedAt) : null,
        agreedTerms: payload.agreedTerms ?? null,
      },
    });
    const amt = payload.agreedAmount ?? 0;
    const initialBalance = amt > 0 ? amt : 0;
    await this.prisma.providerWallet.create({
      data: {
        providerId: provider.id,
        balance: initialBalance,
        totalFunded: 0,
        currency: 'NGN',
      },
    });
    if (amt > 0) {
      const cw = await this.ensureCompanyWallet();
      await this.prisma.companyWallet.update({
        where: { id: cw.id },
        data: { balance: { increment: amt } },
      });
    }
    const wallet = await this.prisma.providerWallet.findUnique({
      where: { providerId: provider.id },
    });
    return { message: 'Provider created', provider, wallet };
  }

  /** Fetch NGN banks from BudPay for provider account selection */
  async getBudpayBanks(currency = 'NGN') {
    const secretKey = process.env.BUDPAY_SECRET_KEY;
    if (!secretKey?.trim()) {
      return { banks: [] as { bank_name: string; bank_code: string }[] };
    }
    const res = await fetch(`${BUDPAY_BASE}/bank_list/${currency}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      data?: Array<{ bank_name: string; bank_code: string }>;
    };
    if (!res.ok || !data.success) {
      return { banks: [] };
    }
    return { banks: Array.isArray(data.data) ? data.data : [] };
  }

  private async ensureCompanyWallet() {
    let cw = await this.prisma.companyWallet.findFirst();
    if (!cw) {
      cw = await this.prisma.companyWallet.create({
        data: { balance: 0, currency: 'NGN' },
      });
    }
    return cw;
  }

  async listProviders() {
    const providers = await this.prisma.provider.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const wallets = await this.prisma.providerWallet.findMany({
      where: { providerId: { in: providers.map((p) => p.id) } },
    });
    const walletMap = new Map(wallets.map((w) => [w.providerId, w]));
    const payoutSums = await this.prisma.providerPayout.groupBy({
      by: ['providerId'],
      where: { status: 'success' },
      _sum: { amount: true },
    });
    const paidMap = new Map(
      payoutSums.map((s) => [s.providerId, s._sum.amount ?? 0])
    );
    const enriched = providers.map((p) => {
      const totalPaid = paidMap.get(p.id) ?? 0;
      const agreed = p.agreedAmount ?? 0;
      // Amount owed = agreedAmount (provider's initial funding) - totalPaid
      const balance = Math.max(0, agreed - totalPaid);
      return {
        ...p,
        balance,
        totalPaid,
      };
    });
    return { providers: enriched };
  }

  async getProvider(providerId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { id: providerId },
    });
    if (!provider) throw new NotFoundException('Provider not found');
    return provider;
  }

  async updateProvider(
    providerId: string,
    payload: {
      name?: string;
      email?: string;
      accountNumber?: string | null;
      bankName?: string | null;
      bankCode?: string | null;
      agreedAmount?: number | null;
      percentageToAdd?: number;
      providerCutPercentage?: number;
      agreedAt?: string | null;
      agreedTerms?: string | null;
    }
  ) {
    const provider = await this.prisma.provider.findUnique({
      where: { id: providerId },
    });
    if (!provider) throw new NotFoundException('Provider not found');

    // Recalculate providerCut ceiling against the new (or existing) total %
    const newTotal = payload.percentageToAdd ?? provider.percentageToAdd;
    const newCut =
      payload.providerCutPercentage !== undefined
        ? Math.min(payload.providerCutPercentage, newTotal)
        : provider.providerCutPercentage > newTotal
          ? newTotal // clamp if total reduced
          : undefined; // leave unchanged

    const agreedDelta =
      payload.agreedAmount !== undefined
        ? (payload.agreedAmount ?? 0) - (provider.agreedAmount ?? 0)
        : 0;
    const providerWallet = await this.prisma.providerWallet.findUnique({
      where: { providerId },
    });
    const updated = await this.prisma.provider.update({
      where: { id: providerId },
      data: {
        ...(payload.name != null && { name: payload.name }),
        ...(payload.email !== undefined && { email: payload.email ?? null }),
        ...(payload.accountNumber !== undefined && { accountNumber: payload.accountNumber ?? null }),
        ...(payload.bankName !== undefined && { bankName: payload.bankName ?? null }),
        ...(payload.bankCode !== undefined && { bankCode: payload.bankCode ?? null }),
        ...(payload.agreedAmount !== undefined && { agreedAmount: payload.agreedAmount ?? null }),
        ...(payload.percentageToAdd != null && { percentageToAdd: payload.percentageToAdd }),
        ...(newCut !== undefined && { providerCutPercentage: newCut }),
        ...(payload.agreedAt !== undefined && {
          agreedAt: payload.agreedAt ? new Date(payload.agreedAt) : null,
        }),
        ...(payload.agreedTerms !== undefined && { agreedTerms: payload.agreedTerms ?? null }),
      },
    });
    if (agreedDelta !== 0) {
      const cw = await this.ensureCompanyWallet();
      await this.prisma.companyWallet.update({
        where: { id: cw.id },
        data: { balance: { increment: agreedDelta } },
      });
      if (providerWallet) {
        await this.prisma.providerWallet.update({
          where: { id: providerWallet.id },
          data: { balance: { increment: agreedDelta } },
        });
      }
    }
    return { message: 'Provider updated', provider: updated };
  }

  async getProviderWallet(providerId: string) {
    const wallet = await this.prisma.providerWallet.findUnique({
      where: { providerId },
    });
    if (!wallet) throw new NotFoundException('Provider wallet not found');
    return wallet;
  }

  /** History of credits to this provider (amount returned to them) */
  async getProviderCredits(providerId: string, limit = 50) {
    const credits = await this.prisma.providerCredit.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return { credits };
  }

  /** Funding history: which loans this provider funded and how much */
  async getProviderFunding(providerId: string, limit = 50) {
    const funding = await this.prisma.loanFunding.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return { funding };
  }

  /** List providers with wallet balance and total paid (for disbursement page) */
  async listProvidersForDisbursement() {
    const providers = await this.prisma.provider.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const wallets = await this.prisma.providerWallet.findMany({
      where: { providerId: { in: providers.map((p) => p.id) } },
    });
    const walletMap = new Map(wallets.map((w) => [w.providerId, w]));

    const payoutSums = await this.prisma.providerPayout.groupBy({
      by: ['providerId'],
      where: { status: 'success' },
      _sum: { amount: true },
    });
    const paidMap = new Map(
      payoutSums.map((s) => [s.providerId, s._sum.amount ?? 0])
    );

    return {
      providers: providers.map((p) => {
        const totalPaid = paidMap.get(p.id) ?? 0;
        const agreed = p.agreedAmount ?? 0;
        // Amount owed = agreedAmount - totalPaid
        const balance = Math.max(0, agreed - totalPaid);
        return {
          ...p,
          balance,
          totalPaid,
          hasBankDetails:
            !!p.accountNumber && !!p.bankName && !!p.bankCode,
        };
      }),
    };
  }

  /** Verify a BudPay transfer by reference (GET /api/v2/payout/:reference) */
  async verifyBudpayTransfer(reference: string) {
    const secretKey = process.env.BUDPAY_SECRET_KEY;
    if (!secretKey?.trim()) {
      throw new BadRequestException('BudPay is not configured (BUDPAY_SECRET_KEY missing)');
    }
    const res = await fetch(`${BUDPAY_BASE}/payout/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });
    const data = (await res.json().catch(() => ({}))) as {
      status?: boolean;
      success?: boolean;
      message?: string;
      data?: Record<string, unknown>;
    };
    if (!res.ok) {
      throw new BadRequestException(
        typeof data.message === 'string' ? data.message : 'Failed to verify transfer'
      );
    }
    return data;
  }

  /** Get provider payouts (history) */
  async getProviderPayouts(providerId: string, limit = 50) {
    const payouts = await this.prisma.providerPayout.findMany({
      where: { providerId },
      orderBy: { paidAt: 'desc' },
      take: limit,
    });
    return { payouts };
  }

  /** Execute bulk disbursement via BudPay and record payouts. When simulate=true, skip BudPay API and simulate success (for dev testing). */
  async executeDisbursement(payload: {
    transfers: { providerId: string; amount: number }[];
    currency?: string;
    simulate?: boolean;
  }) {
    const { transfers, simulate = false } = payload;

    if (!Array.isArray(transfers) || transfers.length === 0) {
      throw new BadRequestException('At least one transfer is required');
    }

    const currency = payload.currency ?? 'NGN';

    const providerIds = [...new Set(transfers.map((t) => t.providerId))];
    const providers = await this.prisma.provider.findMany({
      where: { id: { in: providerIds } },
    });
    const providerMap = new Map(providers.map((p) => [p.id, p]));

    const wallets = await this.prisma.providerWallet.findMany({
      where: { providerId: { in: providerIds } },
    });
    const walletMap = new Map(wallets.map((w) => [w.providerId, w]));

    const payoutSums = await this.prisma.providerPayout.groupBy({
      by: ['providerId'],
      where: { providerId: { in: providerIds }, status: 'success' },
      _sum: { amount: true },
    });
    const paidMap = new Map(
      payoutSums.map((s) => [s.providerId, s._sum.amount ?? 0])
    );

    const budpayTransfers: {
      amount: string;
      bank_code: string;
      bank_name: string;
      account_number: string;
      narration: string;
    }[] = [];
    const transferMeta: { providerId: string; amount: number }[] = [];

    for (const t of transfers) {
      const provider = providerMap.get(t.providerId);
      if (!provider) {
        throw new BadRequestException(`Provider not found: ${t.providerId}`);
      }
      if (!provider.accountNumber || !provider.bankName || !provider.bankCode) {
        throw new BadRequestException(
          `Provider ${provider.name} (${provider.providerNumber}) has incomplete bank details (accountNumber, bankName, bankCode required)`
        );
      }
      const totalPaid = paidMap.get(t.providerId) ?? 0;
      const agreed = provider.agreedAmount ?? 0;
      const balance = Math.max(0, agreed - totalPaid);
      if (t.amount <= 0) {
        throw new BadRequestException(`Invalid amount for provider ${provider.name}`);
      }
      if (t.amount > balance) {
        throw new BadRequestException(
          `Amount ${t.amount} exceeds amount owed ${balance} for provider ${provider.name}`
        );
      }

      budpayTransfers.push({
        amount: String(Math.round(t.amount * 100) / 100),
        bank_code: provider.bankCode,
        bank_name: provider.bankName,
        account_number: provider.accountNumber,
        narration: `Provider payout - ${provider.providerNumber}`,
      });
      transferMeta.push({ providerId: t.providerId, amount: t.amount });
    }

    let results: Array<{ reference?: string; status?: string }>;

    if (simulate) {
      results = transferMeta.map((_, i) => ({
        reference: `sim_${Date.now()}_${i}`,
        status: 'success',
      }));
    } else {
      const secretKey = process.env.BUDPAY_SECRET_KEY;
      if (!secretKey?.trim()) {
        throw new BadRequestException('BudPay is not configured (BUDPAY_SECRET_KEY missing)');
      }
      const budpayPayload = { currency, transfers: budpayTransfers };
      const sortedPayload = sortKeysAlphabetically(budpayPayload) as object;
      const body = JSON.stringify(sortedPayload);
      const signature = budpaySignature(sortedPayload, secretKey);

      const res = await fetch(`${BUDPAY_BASE}/bulk_bank_transfer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          Encryption: signature,
          'Content-Type': 'application/json',
        },
        body,
      });

      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
        data?: Array<{
          reference?: string;
          status?: string;
          amount?: string;
          account_number?: string;
        }>;
      };

      if (!res.ok || !data.success) {
        const msg =
          typeof data.message === 'string'
            ? data.message
            : 'BudPay bulk transfer failed';
        throw new BadRequestException(msg);
      }

      results = Array.isArray(data.data) ? data.data : [];
    }
    if (results.length !== transferMeta.length) {
      throw new BadRequestException(
        'BudPay response count does not match request'
      );
    }

    const totalPayout = transferMeta.reduce((s, m) => s + m.amount, 0);
    const cw = await this.ensureCompanyWallet();
    if (cw.balance < totalPayout) {
      throw new BadRequestException(
        `Insufficient company balance. Available: ₦${cw.balance.toFixed(2)}, required: ₦${totalPayout.toFixed(2)}`,
      );
    }

    for (let i = 0; i < transferMeta.length; i++) {
      const meta = transferMeta[i];
      const result = results[i];
      const reference = result?.reference ?? `payout_${Date.now()}_${i}`;
      const status = result?.status ?? 'pending';
      const provider = providerMap.get(meta.providerId)!;
      const totalPaid = paidMap.get(meta.providerId) ?? 0;
      const agreed = provider.agreedAmount ?? 0;
      const owedBeforePayout = Math.max(0, agreed - totalPaid);

      const wallet = walletMap.get(meta.providerId);
      if (!wallet || wallet.balance !== owedBeforePayout) {
        await this.prisma.providerWallet.upsert({
          where: { providerId: meta.providerId },
          create: {
            providerId: meta.providerId,
            balance: owedBeforePayout,
            totalFunded: 0,
            currency: 'NGN',
          },
          update: { balance: owedBeforePayout },
        });
      }

      await this.prisma.$transaction([
        this.prisma.providerPayout.create({
          data: {
            providerId: meta.providerId,
            amount: meta.amount,
            reference,
            status,
          },
        }),
        this.prisma.providerWallet.update({
          where: { providerId: meta.providerId },
          data: {
            balance: { decrement: meta.amount },
          },
        }),
        this.prisma.companyWallet.update({
          where: { id: cw.id },
          data: { balance: { decrement: meta.amount } },
        }),
      ]);
    }

    return {
      message: `${transfers.length} transfer(s) queued successfully`,
      success: true,
      data: results.map((r, i) => ({
        reference: r?.reference,
        status: r?.status ?? 'pending',
        providerId: transferMeta[i].providerId,
        amount: transferMeta[i].amount,
      })),
    };
  }

  /** Delete provider with option: complete payout (pay balance from company) or delete and leave (keep balance) */
  async deleteProvider(providerId: string, payoutFirst: boolean) {
    const provider = await this.prisma.provider.findUnique({
      where: { id: providerId },
    });
    if (!provider) throw new NotFoundException('Provider not found');

    const payoutSum = await this.prisma.providerPayout.aggregate({
      where: { providerId, status: 'success' },
      _sum: { amount: true },
    });
    const totalPaid = payoutSum._sum.amount ?? 0;
    const agreed = provider.agreedAmount ?? 0;
    const amountOwed = Math.max(0, agreed - totalPaid);

    if (payoutFirst && amountOwed > 0) {
      if (!provider.accountNumber || !provider.bankName || !provider.bankCode) {
        throw new BadRequestException(
          'Cannot payout: provider has incomplete bank details. Use delete without payout instead.'
        );
      }
      const secretKey = process.env.BUDPAY_SECRET_KEY;
      if (!secretKey?.trim()) {
        throw new BadRequestException('BudPay not configured. Use delete without payout instead.');
      }
      const cw = await this.ensureCompanyWallet();
      if (cw.balance < amountOwed) {
        throw new BadRequestException(
          `Insufficient company balance for payout. Available: ₦${cw.balance.toFixed(2)}, required: ₦${amountOwed.toFixed(2)}`
        );
      }

      const payload = {
        currency: 'NGN',
        bank_code: provider.bankCode,
        bank_name: provider.bankName,
        account_number: provider.accountNumber,
        amount: String(Math.round(amountOwed * 100) / 100),
        narration: `Final payout - ${provider.providerNumber}`,
      };
      const sortedPayload = sortKeysAlphabetically(payload) as object;
      const body = JSON.stringify(sortedPayload);
      const signature = budpaySignature(sortedPayload, secretKey);
      const res = await fetch(`${BUDPAY_BASE}/bank_transfer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          Encryption: signature,
          'Content-Type': 'application/json',
        },
        body,
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
        data?: { reference?: string; status?: string };
      };
      if (!res.ok || !data.success) {
        throw new BadRequestException(
          data.message ?? 'BudPay transfer failed'
        );
      }
      const reference = data.data?.reference ?? `payout_${Date.now()}`;
      const status = data.data?.status ?? 'pending';

      await this.prisma.$transaction([
        this.prisma.providerPayout.create({
          data: {
            providerId,
            amount: amountOwed,
            reference,
            status,
          },
        }),
        this.prisma.providerWallet.updateMany({
          where: { providerId },
          data: { balance: 0 },
        }),
        this.prisma.companyWallet.update({
          where: { id: cw.id },
          data: { balance: { decrement: amountOwed } },
        }),
      ]);
    }

    await this.prisma.loanFunding.deleteMany({ where: { providerId } });
    await this.prisma.providerCredit.deleteMany({ where: { providerId } });
    await this.prisma.providerPayout.deleteMany({ where: { providerId } });
    await this.prisma.providerWallet.deleteMany({ where: { providerId } });
    await this.prisma.provider.delete({ where: { id: providerId } });

    if (payoutFirst && amountOwed > 0) {
      return {
        message: `Provider paid ₦${amountOwed.toFixed(2)} and deleted`,
        payoutAmount: amountOwed,
      };
    }
    return {
      message: 'Provider deleted (balance left in company account)',
      payoutAmount: 0,
    };
  }
}
