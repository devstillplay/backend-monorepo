import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PrismaPromise, PrismaService } from '@my-workspace/prisma';

export const LoanStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  DISBURSED: 'DISBURSED',
  REPAID: 'REPAID',
} as const;

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  private roundMoney(n: number): number {
    return Math.round(n * 100) / 100;
  }

  /** Upfront interest as % of principal (AppSetting loan_interest_percent, default 30). */
  private async getLoanInterestPercent(): Promise<number> {
    const raw = await this.getAppSetting('loan_interest_percent', '30');
    const n = Number(raw ?? 30);
    if (Number.isNaN(n) || n < 0 || n >= 100) return 30;
    return n;
  }

  /**
   * Withhold interest from nominal principal; only net is sent to the wallet.
   * Repayment obligation stays `principal` (amount).
   */
  private computeUpfrontWithholding(
    principal: number,
    ratePercent: number,
  ): { interestWithheld: number; netDisbursed: number } {
    const interestWithheld = this.roundMoney((principal * ratePercent) / 100);
    const netDisbursed = this.roundMoney(principal - interestWithheld);
    if (netDisbursed <= 0) {
      throw new BadRequestException(
        'Loan amount is too small after interest withholding. Try a higher amount.',
      );
    }
    return { interestWithheld, netDisbursed };
  }

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async requestLoan(payload: {
    userId: string;
    amount: number;
    purpose?: string;
  }) {
    if (payload.amount <= 0)
      throw new BadRequestException('Amount must be positive');
    const eligibility = await this.getLoanEligibility(payload.userId);
    if (!eligibility.canRequest) {
      throw new BadRequestException(
        eligibility.reason ?? 'You cannot request a loan at this time.',
      );
    }
    if (payload.amount > eligibility.availableAmount) {
      throw new BadRequestException(
        `You can borrow up to ₦${eligibility.availableAmount.toFixed(2)}. Your total outstanding limit is ₦${eligibility.maxAmount.toFixed(2)}.`,
      );
    }
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: payload.userId },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    const companyWallet = await this.ensureCompanyWallet();
    const interestRatePercent = await this.getLoanInterestPercent();
    const { interestWithheld, netDisbursed } = this.computeUpfrontWithholding(
      payload.amount,
      interestRatePercent,
    );
    if (companyWallet.balance < netDisbursed) {
      throw new BadRequestException(
        `Insufficient company balance. Available: \u20A6${companyWallet.balance.toFixed(2)}, required (after interest): \u20A6${netDisbursed.toFixed(2)}`,
      );
    }
    const now = new Date();
    const loan = await this.prisma.$transaction(async (tx) => {
      const created = await tx.loan.create({
        data: {
          userId: payload.userId,
          amount: payload.amount,
          purpose: payload.purpose ?? null,
          status: LoanStatus.APPROVED,
          approvedAt: now,
          interestRatePercent,
          interestWithheld,
          netDisbursed,
        },
      });
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: netDisbursed } },
      });
      await tx.companyWallet.update({
        where: { id: companyWallet.id },
        data: { balance: { decrement: netDisbursed } },
      });
      return created;
    });
    return {
      message: `Loan granted — \u20A6${netDisbursed.toFixed(2)} credited to your wallet (\u20A6${interestWithheld.toFixed(2)} interest withheld upfront; repay \u20A6${payload.amount.toFixed(2)}).`,
      loan,
    };
  }

  async listLoans(userId: string) {
    const loans = await this.prisma.loan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return { loans };
  }

  async getLoan(loanId: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
    });
    if (!loan) throw new NotFoundException('Loan not found');
    return loan;
  }

  async approveLoan(loanId: string) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.status !== LoanStatus.PENDING) {
      throw new BadRequestException('Only PENDING loans can be approved');
    }
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: loan.userId },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    const companyWallet = await this.ensureCompanyWallet();
    const interestRatePercent =
      loan.interestRatePercent ?? (await this.getLoanInterestPercent());
    const { interestWithheld, netDisbursed } = this.computeUpfrontWithholding(
      loan.amount,
      interestRatePercent,
    );
    if (companyWallet.balance < netDisbursed) {
      throw new BadRequestException(
        `Insufficient company balance. Available: \u20A6${companyWallet.balance.toFixed(2)}, required (net to wallet): \u20A6${netDisbursed.toFixed(2)}`,
      );
    }
    const now = new Date();
    await this.prisma.$transaction(async (tx) => {
      const result = await tx.loan.updateMany({
        where: { id: loanId, status: LoanStatus.PENDING },
        data: {
          status: LoanStatus.APPROVED,
          approvedAt: now,
          interestRatePercent,
          interestWithheld,
          netDisbursed,
        },
      });
      if (result.count === 0) {
        throw new BadRequestException(
          'Loan not found or already approved (prevents double disbursement to wallet)',
        );
      }
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: netDisbursed } },
      });
      await tx.companyWallet.update({
        where: { id: companyWallet.id },
        data: { balance: { decrement: netDisbursed } },
      });
    });
    const updated = await this.prisma.loan.findUnique({
      where: { id: loanId },
    });
    return {
      message: `Loan approved — \u20A6${netDisbursed.toFixed(2)} credited (\u20A6${interestWithheld.toFixed(2)} interest withheld).`,
      loan: updated,
    };
  }

  async getCompanyBalance() {
    const cw = await this.ensureCompanyWallet();
    return { balance: cw.balance, currency: cw.currency };
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

  private async ensureCompanyWalletTx(tx: Prisma.TransactionClient) {
    let cw = await tx.companyWallet.findFirst();
    if (!cw) {
      cw = await tx.companyWallet.create({
        data: { balance: 0, currency: 'NGN' },
      });
    }
    return cw;
  }

  /** Repayable tranches: approved/disbursed only, oldest first (FIFO). */
  private async buildRepaymentSegments(
    userId: string,
    maxAmount: number,
  ): Promise<{ loanId: string; pay: number }[]> {
    const cap = this.roundMoney(Number(maxAmount));
    if (cap <= 0) return [];
    const loans = await this.prisma.loan.findMany({
      where: {
        userId,
        status: { in: [LoanStatus.APPROVED, LoanStatus.DISBURSED] },
      },
      orderBy: { createdAt: 'asc' },
    });
    const totalOutstanding = this.roundMoney(
      loans.reduce(
        (s, l) => s + Math.max(0, l.amount - l.amountRepaid),
        0,
      ),
    );
    let left = this.roundMoney(Math.min(cap, totalOutstanding));
    const segments: { loanId: string; pay: number }[] = [];
    for (const loan of loans) {
      if (left <= 0) break;
      const rem = this.roundMoney(Math.max(0, loan.amount - loan.amountRepaid));
      if (rem <= 0) continue;
      const pay = this.roundMoney(Math.min(rem, left));
      if (pay <= 0) continue;
      segments.push({ loanId: loan.id, pay });
      left = this.roundMoney(left - pay);
    }
    return segments;
  }

  private async runRepaymentSliceTx(
    tx: Prisma.TransactionClient,
    companyWalletId: string,
    loan: {
      id: string;
      userId: string;
      status: string;
      amount: number;
      amountRepaid: number;
      approvedAt: Date | null;
    },
    amount: number,
    now: Date,
  ): Promise<void> {
    const newRepaid = this.roundMoney(loan.amountRepaid + amount);
    const fullRepaid = newRepaid >= loan.amount;
    await tx.loan.update({
      where: { id: loan.id },
      data: {
        amountRepaid: newRepaid,
        ...(loan.status === LoanStatus.APPROVED
          ? {
              status: LoanStatus.DISBURSED,
              disbursedAt: loan.approvedAt ?? now,
            }
          : {}),
        ...(fullRepaid ? { status: LoanStatus.REPAID, repaidAt: now } : {}),
      },
    });
    await tx.loanRepayment.create({
      data: { loanId: loan.id, userId: loan.userId, amount, repaidAt: now },
    });
    await tx.companyWallet.update({
      where: { id: companyWalletId },
      data: { balance: { increment: amount } },
    });
  }

  private async postRepaymentProviderCredits(
    loanId: string,
    sliceAmount: number,
    loanPrincipal: number,
  ) {
    if (loanPrincipal <= 0 || sliceAmount <= 0) return;
    const fundings = await this.prisma.loanFunding.findMany({
      where: { loanId },
      include: { provider: true },
    });
    for (const f of fundings) {
      const share = f.amount / loanPrincipal;
      const providerCut =
        f.provider.providerCutPercentage ?? f.provider.percentageToAdd ?? 0;
      const creditAmount = share * sliceAmount * (1 + providerCut / 100);
      if (creditAmount <= 0) continue;
      await this.prisma.providerCredit.create({
        data: {
          providerId: f.providerId,
          amount: creditAmount,
          loanId,
        },
      });
    }
  }

  private async maybeApplyOnTimeBonusAfterRepayment(
    loanId: string,
    repaidAt: Date,
  ) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (
      !loan ||
      loan.status !== LoanStatus.REPAID ||
      !loan.dueDate ||
      !loan.repaidAt
    ) {
      return;
    }
    const dueDate = new Date(loan.dueDate);
    if (repaidAt > dueDate) return;
    const defaultLimitStr = await this.getAppSetting('loan_max_amount', '5000');
    const defaultLimit = Number(defaultLimitStr ?? 5000);
    const user = await this.prisma.user.findUnique({
      where: { id: loan.userId },
      select: { creditLimit: true },
    });
    const currentLimit =
      user?.creditLimit != null && !Number.isNaN(user.creditLimit)
        ? user.creditLimit
        : defaultLimit;
    const newLimit = Math.round(currentLimit * 1.05 * 100) / 100;
    await this.prisma.user.update({
      where: { id: loan.userId },
      data: { creditLimit: newLimit },
    });
  }

  /**
   * Apply one payment across all outstanding tranches (FIFO by loan createdAt).
   * Caps to total outstanding. Single DB transaction for all slices.
   */
  async repayPortfolio(userId: string, amount: number) {
    const rounded = this.roundMoney(Number(amount));
    if (rounded <= 0) {
      throw new BadRequestException('Repayment amount must be positive');
    }
    const segments = await this.buildRepaymentSegments(userId, rounded);
    if (segments.length === 0) {
      throw new BadRequestException('No outstanding balance to repay');
    }
    const now = new Date();
    await this.prisma.$transaction(async (tx) => {
      const companyWallet = await this.ensureCompanyWalletTx(tx);
      for (const seg of segments) {
        const loan = await tx.loan.findUnique({ where: { id: seg.loanId } });
        if (!loan) throw new NotFoundException('Loan not found');
        if (loan.userId !== userId) {
          throw new BadRequestException('Repayment user mismatch');
        }
        if (
          loan.status !== LoanStatus.DISBURSED &&
          loan.status !== LoanStatus.APPROVED
        ) {
          throw new BadRequestException(
            'Only approved or disbursed loans can be repaid',
          );
        }
        const rem = this.roundMoney(loan.amount - loan.amountRepaid);
        if (seg.pay > rem + 0.02) {
          throw new BadRequestException('Repayment slice exceeds loan remainder');
        }
        await this.runRepaymentSliceTx(
          tx,
          companyWallet.id,
          loan,
          seg.pay,
          now,
        );
      }
    });
    for (const seg of segments) {
      const loan = await this.prisma.loan.findUnique({
        where: { id: seg.loanId },
      });
      if (loan) {
        await this.postRepaymentProviderCredits(seg.loanId, seg.pay, loan.amount);
      }
    }
    for (const seg of segments) {
      await this.maybeApplyOnTimeBonusAfterRepayment(seg.loanId, now);
    }
    const loans = await Promise.all(
      segments.map((s) =>
        this.prisma.loan.findUnique({ where: { id: s.loanId } }),
      ),
    );
    const defined = loans.filter((l): l is NonNullable<typeof l> => !!l);
    return {
      message: 'Repayment recorded',
      loan: defined[0],
      loans: defined,
    };
  }

  async rejectLoan(loanId: string) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.status !== LoanStatus.PENDING) {
      throw new BadRequestException('Only PENDING loans can be rejected');
    }
    const updated = await this.prisma.loan.update({
      where: { id: loanId },
      data: { status: LoanStatus.REJECTED },
    });
    return { message: 'Loan rejected', loan: updated };
  }

  async disburseLoan(
    loanId: string,
    dueDate?: Date,
    providerFunding?: { providerId: string; amount: number }[],
  ) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.status === LoanStatus.DISBURSED) {
      return {
        message: 'Loan already disbursed (no double disbursement)',
        loan,
      };
    }
    if (loan.status !== LoanStatus.APPROVED) {
      throw new BadRequestException('Only APPROVED loans can be disbursed');
    }
    if (providerFunding && providerFunding.length > 0) {
      const sum = providerFunding.reduce((s, f) => s + f.amount, 0);
      if (Math.abs(sum - loan.amount) > 0.01) {
        throw new BadRequestException(
          `Provider funding total (${sum}) must equal loan amount (${loan.amount})`,
        );
      }
    }
    const now = new Date();
    // Wallet was already credited when loan was approved
    const updates: PrismaPromise<unknown>[] = [
      this.prisma.loan.update({
        where: { id: loanId },
        data: {
          status: LoanStatus.DISBURSED,
          disbursedAt: now,
          dueDate: dueDate ?? undefined,
        },
      }),
    ];
    if (providerFunding && providerFunding.length > 0) {
      for (const f of providerFunding) {
        updates.push(
          this.prisma.loanFunding.create({
            data: { providerId: f.providerId, loanId, amount: f.amount },
          }),
        );
        const providerWallet = await this.prisma.providerWallet.findUnique({
          where: { providerId: f.providerId },
        });
        if (providerWallet) {
          updates.push(
            this.prisma.providerWallet.update({
              where: { id: providerWallet.id },
              data: { totalFunded: { increment: f.amount } },
            }),
          );
        }
      }
    }
    await this.prisma.$transaction(updates);
    const updated = await this.prisma.loan.findUnique({
      where: { id: loanId },
    });
    return { message: 'Loan disbursed to wallet', loan: updated };
  }

  async repayLoan(loanId: string, amount: number) {
    if (amount <= 0)
      throw new BadRequestException('Repayment amount must be positive');
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Loan not found');
    if (
      loan.status !== LoanStatus.DISBURSED &&
      loan.status !== LoanStatus.APPROVED
    ) {
      throw new BadRequestException(
        'Only approved or disbursed loans can be repaid',
      );
    }
    const slice = this.roundMoney(Number(amount));
    const rem = this.roundMoney(loan.amount - loan.amountRepaid);
    if (slice > rem + 0.02) {
      throw new BadRequestException(
        `Repayment cannot exceed remaining balance (₦${rem.toFixed(2)})`,
      );
    }
    const newRepaid = this.roundMoney(loan.amountRepaid + slice);
    const fullRepaid = newRepaid >= loan.amount;
    const now = new Date();
    const companyWallet = await this.ensureCompanyWallet();
    await this.prisma.$transaction(async (tx) => {
      await this.runRepaymentSliceTx(tx, companyWallet.id, loan, slice, now);
    });
    await this.postRepaymentProviderCredits(loanId, slice, loan.amount);
    await this.maybeApplyOnTimeBonusAfterRepayment(loanId, now);
    const updated = await this.prisma.loan.findUnique({
      where: { id: loanId },
    });
    return {
      message: fullRepaid ? 'Loan fully repaid' : 'Repayment recorded',
      loan: updated,
    };
  }

  async listRepaymentsByLoanId(loanId: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
    });
    if (!loan) throw new NotFoundException('Loan not found');
    const repayments = await this.prisma.loanRepayment.findMany({
      where: { loanId },
      orderBy: { repaidAt: 'desc' },
    });
    return { loanId, repayments };
  }

  async listRepaymentsByUserId(userId: string) {
    const repayments = await this.prisma.loanRepayment.findMany({
      where: { userId },
      orderBy: { repaidAt: 'desc' },
    });
    return { userId, repayments };
  }

  async listAllLoans() {
    const loans = await this.prisma.loan.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { loans };
  }

  // ─── App Settings ──────────────────────────────────────────────────────────

  async getAppSetting(
    key: string,
    defaultValue?: string,
  ): Promise<string | undefined> {
    const setting = await this.prisma.appSetting.findUnique({ where: { key } });
    return setting?.value ?? defaultValue;
  }

  async setAppSetting(key: string, value: string) {
    await this.prisma.appSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    return { key, value };
  }

  async getAllSettings() {
    const settings = await this.prisma.appSetting.findMany();
    return settings.reduce<Record<string, string>>((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
  }

  // ─── Loan Eligibility ──────────────────────────────────────────────────────

  /**
   * Returns whether a user can request a loan, how much, and why if blocked.
   *
   * Credit limit: per-user creditLimit or AppSetting loan_max_amount (default 5000).
   * Total outstanding: sum of (amount - amountRepaid) for all PENDING, APPROVED, DISBURSED loans.
   * Available: creditLimit - totalOutstanding. User can borrow more without repaying first.
   * When user repays, capacity is freed and they can borrow again.
   */
  async getLoanEligibility(userId: string) {
    const defaultLimitStr = await this.getAppSetting('loan_max_amount', '5000');
    const defaultLimit = Number(defaultLimitStr ?? 5000);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { creditLimit: true },
    });
    // Admin-set creditLimit always takes precedence over default; only use default when never set
    const creditLimit =
      user?.creditLimit != null && !Number.isNaN(user.creditLimit)
        ? user.creditLimit
        : defaultLimit;

    const activeLoans = await this.prisma.loan.findMany({
      where: {
        userId,
        status: {
          in: [LoanStatus.PENDING, LoanStatus.APPROVED, LoanStatus.DISBURSED],
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalOutstanding = activeLoans.reduce((sum, l) => {
      const remaining = Math.max(0, l.amount - l.amountRepaid);
      return sum + remaining;
    }, 0);

    const availableAmount = Math.max(0, creditLimit - totalOutstanding);
    const canRequest = availableAmount > 0;
    const interestRatePercent = await this.getLoanInterestPercent();

    // For repayment: use the loan with the highest remaining (primary debt)
    const withRemaining = activeLoans.map((l) => ({
      loan: l,
      remaining: Math.max(0, l.amount - l.amountRepaid),
    }));
    const primary =
      withRemaining.length > 0
        ? withRemaining.reduce((a, b) => (b.remaining > a.remaining ? b : a))
        : null;
    const activeLoan = primary
      ? {
          id: primary.loan.id,
          status: primary.loan.status,
          amount: primary.loan.amount,
          amountRepaid: primary.loan.amountRepaid,
          remaining: primary.remaining,
        }
      : null;

    if (!canRequest) {
      return {
        canRequest: false,
        maxAmount: creditLimit,
        availableAmount: 0,
        totalOutstanding,
        interestRatePercent,
        reason:
          totalOutstanding > 0
            ? `You have an outstanding balance of ₦${totalOutstanding.toFixed(2)}. Repay to free up your borrowing capacity.`
            : 'You have reached your credit limit.',
        activeLoan,
      };
    }

    return {
      canRequest: true,
      maxAmount: creditLimit,
      availableAmount,
      totalOutstanding,
      interestRatePercent,
      reason:
        totalOutstanding > 0
          ? `You have an outstanding balance of ₦${totalOutstanding.toFixed(2)}. You can borrow up to ₦${availableAmount.toFixed(2)}.`
          : `You can borrow up to ₦${availableAmount.toFixed(2)}.`,
      activeLoan,
    };
  }

  async listAllRepayments() {
    const repayments = await this.prisma.loanRepayment.findMany({
      orderBy: { repaidAt: 'desc' },
    });
    return { repayments };
  }

  /**
   * Handle a BudPay transaction forwarded from notification-service.
   * Strategy:
   * - Find user by customer.email
   * - Find their most recent DISBURSED loan
   * - Apply repayLoan with the BudPay amount
   *
   * This automatically records the user via LoanRepayment.userId and
   * updates loan state / provider credits (user wallet is not debited — funds came via BudPay).
   */
  private extractLoanIdFromPaystackMetadata(metadata: unknown): string | null {
    if (!metadata || typeof metadata !== 'object') return null;
    const m = metadata as Record<string, unknown>;
    const direct = m.loan_id;
    if (typeof direct === 'string' && direct.trim()) return direct.trim();
    if (typeof direct === 'number' && String(direct)) return String(direct);
    const cf = m.custom_fields;
    if (Array.isArray(cf)) {
      for (const item of cf) {
        if (item && typeof item === 'object') {
          const o = item as Record<string, unknown>;
          if (
            (o.variable_name === 'loan_id' || o.variable === 'loan_id') &&
            o.value != null
          ) {
            return String(o.value).trim();
          }
        }
      }
    }
    return null;
  }

  private extractUserIdFromPaystackMetadata(metadata: unknown): string | null {
    if (!metadata || typeof metadata !== 'object') return null;
    const m = metadata as Record<string, unknown>;
    const direct = m.user_id;
    if (typeof direct === 'string' && direct.trim()) return direct.trim();
    if (typeof direct === 'number' && String(direct)) return String(direct);
    return null;
  }

  private extractRepaymentScopeFromPaystackMetadata(
    metadata: unknown,
  ): 'portfolio' | 'single' {
    if (!metadata || typeof metadata !== 'object') return 'single';
    const m = metadata as Record<string, unknown>;
    const raw = m.repayment_scope;
    if (typeof raw === 'string' && raw.toLowerCase() === 'portfolio') {
      return 'portfolio';
    }
    const cf = m.custom_fields;
    if (Array.isArray(cf)) {
      for (const item of cf) {
        if (item && typeof item === 'object') {
          const o = item as Record<string, unknown>;
          if (
            (o.variable_name === 'repayment_scope' ||
              o.variable === 'repayment_scope') &&
            String(o.value ?? '').toLowerCase() === 'portfolio'
          ) {
            return 'portfolio';
          }
        }
      }
    }
    return 'single';
  }

  /**
   * Record a Paystack repayment once per `reference` (webhook + inline verify).
   * Uses ExternalPaymentRef unique on reference to prevent double crediting.
   */
  async applyPaystackRepaymentIfNew(payload: {
    loanId?: string;
    userId?: string;
    amount: number;
    reference: string;
    scope?: 'single' | 'portfolio';
  }) {
    const amount = this.roundMoney(Number(payload.amount));
    if (amount <= 0) {
      throw new BadRequestException('Repayment amount must be positive');
    }
    const scope: 'single' | 'portfolio' =
      payload.scope === 'portfolio'
        ? 'portfolio'
        : payload.scope === 'single' || payload.loanId
          ? 'single'
          : 'portfolio';

    if (scope === 'portfolio') {
      const userId = payload.userId;
      if (!userId) {
        throw new BadRequestException(
          'userId is required for portfolio repayment',
        );
      }
      const segments = await this.buildRepaymentSegments(userId, amount);
      if (segments.length === 0) {
        throw new BadRequestException('No outstanding balance to repay');
      }
      const anchorLoanId = segments[0].loanId;
      try {
        await this.prisma.externalPaymentRef.create({
          data: {
            provider: 'paystack',
            reference: payload.reference,
            loanId: anchorLoanId,
            userId,
            amount,
          },
        });
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code;
        if (code === 'P2002') {
          const loans = await this.prisma.loan.findMany({
            where: {
              userId,
              status: {
                in: [
                  LoanStatus.PENDING,
                  LoanStatus.APPROVED,
                  LoanStatus.DISBURSED,
                ],
              },
            },
            orderBy: { createdAt: 'desc' },
          });
          return {
            message:
              'Repayment already recorded for this Paystack reference',
            loan: loans[0] ?? null,
            loans,
            duplicate: true,
          };
        }
        throw err;
      }
      try {
        return await this.repayPortfolio(userId, amount);
      } catch (err) {
        await this.prisma.externalPaymentRef
          .deleteMany({ where: { reference: payload.reference } })
          .catch(() => {});
        throw err;
      }
    }

    if (!payload.loanId) {
      throw new BadRequestException('loanId is required for single repayment');
    }
    const loan = await this.prisma.loan.findUnique({
      where: { id: payload.loanId },
    });
    if (!loan) throw new NotFoundException('Loan not found');
    if (
      loan.status !== LoanStatus.DISBURSED &&
      loan.status !== LoanStatus.APPROVED
    ) {
      throw new BadRequestException(
        'Only approved or disbursed loans can be repaid',
      );
    }

    try {
      await this.prisma.externalPaymentRef.create({
        data: {
          provider: 'paystack',
          reference: payload.reference,
          loanId: loan.id,
          userId: loan.userId,
          amount,
        },
      });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'P2002') {
        const updated = await this.prisma.loan.findUnique({
          where: { id: payload.loanId },
        });
        return {
          message:
            'Repayment already recorded for this Paystack reference',
          loan: updated,
          duplicate: true,
        };
      }
      throw err;
    }

    try {
      return await this.repayLoan(payload.loanId, amount);
    } catch (err) {
      await this.prisma.externalPaymentRef
        .deleteMany({ where: { reference: payload.reference } })
        .catch(() => {});
      throw err;
    }
  }

  /**
   * Paystack charge.success — apply loan repayment when metadata / reference indicate our flow.
   */
  async handlePaystackWebhookCharge(payload: {
    reference: string;
    amountKobo: number;
    currency?: string;
    customer?: { email?: string };
    metadata?: unknown;
  }) {
    const ref = payload.reference;
    if (!ref) {
      return { applied: false, reason: 'missing_reference' };
    }
    if (payload.currency && payload.currency !== 'NGN') {
      return { applied: false, reason: 'unsupported_currency', reference: ref };
    }
    const amountKobo = Number(payload.amountKobo ?? 0);
    if (!Number.isFinite(amountKobo) || amountKobo <= 0) {
      return { applied: false, reason: 'invalid_amount', reference: ref };
    }
    const amountNaira = this.roundMoney(amountKobo / 100);

    const loanIdMeta = this.extractLoanIdFromPaystackMetadata(payload.metadata);
    const userIdMeta = this.extractUserIdFromPaystackMetadata(payload.metadata);
    const scopeMeta = this.extractRepaymentScopeFromPaystackMetadata(
      payload.metadata,
    );
    const isLoanRepayRef =
      ref.startsWith('PS_REPAY_') || ref.startsWith('REPAY_');

    if (!isLoanRepayRef) {
      return { applied: false, reason: 'not_loan_repayment', reference: ref };
    }

    /** Portfolio: settle FIFO across all tranches; metadata must include user_id. */
    if (scopeMeta === 'portfolio' && userIdMeta) {
      const user = await this.prisma.user.findUnique({
        where: { id: userIdMeta },
      });
      if (!user) {
        return { applied: false, reason: 'user_not_found', reference: ref };
      }
      const email = payload.customer?.email?.toLowerCase();
      if (email && user.email.toLowerCase() !== email) {
        return { applied: false, reason: 'email_mismatch', reference: ref };
      }
      const result = await this.applyPaystackRepaymentIfNew({
        userId: userIdMeta,
        amount: amountNaira,
        reference: ref,
        scope: 'portfolio',
      });
      const dup = (result as { duplicate?: boolean }).duplicate === true;
      return {
        applied: true,
        duplicate: dup,
        reference: ref,
        loanId: null,
        userId: userIdMeta,
        amount: amountNaira,
        result,
      };
    }

    let loanId: string | null = loanIdMeta;
    let resolvedUserId: string | null = userIdMeta;

    if (loanId) {
      const loan = await this.prisma.loan.findUnique({
        where: { id: loanId },
      });
      if (!loan) {
        return { applied: false, reason: 'loan_not_found', reference: ref };
      }
      if (resolvedUserId && loan.userId !== resolvedUserId) {
        return { applied: false, reason: 'user_mismatch', reference: ref };
      }
      resolvedUserId = loan.userId;
      const email = payload.customer?.email?.toLowerCase();
      if (email) {
        const user = await this.prisma.user.findUnique({
          where: { id: loan.userId },
        });
        if (user && user.email.toLowerCase() !== email) {
          return { applied: false, reason: 'email_mismatch', reference: ref };
        }
      }
    } else {
      const email = payload.customer?.email;
      if (!email) {
        return { applied: false, reason: 'missing_email', reference: ref };
      }
      const user = await this.prisma.user.findFirst({
        where: { email: email.toLowerCase() },
      });
      if (!user) {
        return { applied: false, reason: 'user_not_found', reference: ref };
      }
      const loan = await this.prisma.loan.findFirst({
        where: { userId: user.id, status: LoanStatus.DISBURSED },
        orderBy: { createdAt: 'desc' },
      });
      if (!loan) {
        return {
          applied: false,
          reason: 'no_disbursed_loan',
          reference: ref,
          userId: user.id,
        };
      }
      loanId = loan.id;
      resolvedUserId = user.id;
    }

    const result = await this.applyPaystackRepaymentIfNew({
      loanId: loanId!,
      amount: amountNaira,
      reference: ref,
      scope: 'single',
    });
    const dup = (result as { duplicate?: boolean }).duplicate === true;
    return {
      applied: true,
      duplicate: dup,
      reference: ref,
      loanId,
      userId: resolvedUserId,
      amount: amountNaira,
      result,
    };
  }

  async handleBudpayTransaction(payload: {
    reference?: string;
    amount: number;
    currency?: string;
    customer?: { email?: string };
    raw?: unknown;
  }) {
    const amount = Number(payload.amount ?? 0);
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      return {
        applied: false,
        reason: 'Invalid amount',
        reference: payload.reference,
      };
    }

    const email = payload.customer?.email;
    if (!email) {
      return {
        applied: false,
        reason: 'Missing customer email',
        reference: payload.reference,
      };
    }

    const user = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      return {
        applied: false,
        reason: 'User not found for email',
        reference: payload.reference,
      };
    }

    const loan = await this.prisma.loan.findFirst({
      where: { userId: user.id, status: LoanStatus.DISBURSED },
      orderBy: { createdAt: 'desc' },
    });
    if (!loan) {
      return {
        applied: false,
        reason: 'No DISBURSED loan for user',
        reference: payload.reference,
        userId: user.id,
      };
    }

    await this.repayLoan(loan.id, amount);
    return {
      applied: true,
      reference: payload.reference,
      userId: user.id,
      loanId: loan.id,
      amount,
      currency: payload.currency,
    };
  }
}
