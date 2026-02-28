import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaPromise, PrismaService } from '@my-workspace/prisma';

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
    const loan = await this.prisma.loan.create({
      data: {
        userId: payload.userId,
        amount: payload.amount,
        purpose: payload.purpose ?? null,
        status: LoanStatus.PENDING,
      },
    });
    return { message: 'Loan request submitted', loan };
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
    const now = new Date();
    await this.prisma.$transaction(async (tx) => {
      const result = await tx.loan.updateMany({
        where: { id: loanId, status: LoanStatus.PENDING },
        data: { status: LoanStatus.APPROVED, approvedAt: now },
      });
      if (result.count === 0) {
        throw new BadRequestException(
          'Loan not found or already approved (prevents double disbursement to wallet)',
        );
      }
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: loan.amount } },
      });
    });
    const updated = await this.prisma.loan.findUnique({
      where: { id: loanId },
    });
    return { message: 'Loan approved and amount added to wallet', loan: updated };
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
    // APPROVED and DISBURSED both mean customer has received funds (wallet credited at approval)
    if (loan.status !== LoanStatus.DISBURSED && loan.status !== LoanStatus.APPROVED) {
      throw new BadRequestException('Only approved or disbursed loans can be repaid');
    }
    const currentRepaid = loan.amountRepaid;
    const newRepaid = currentRepaid + amount;
    const fullRepaid = newRepaid >= loan.amount;
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: loan.userId },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.balance < amount) {
      throw new BadRequestException(
        'Insufficient wallet balance for repayment',
      );
    }
    const now = new Date();
    await this.prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      });
      await tx.loan.update({
        where: { id: loanId },
        data: {
          amountRepaid: newRepaid,
          // Transition APPROVED → DISBURSED on first repayment (for consistency)
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
        data: { loanId, userId: loan.userId, amount, repaidAt: now },
      });
    });

    // On-time repayment bonus: increase credit limit by 5% when loan is fully repaid on or before due date
    if (fullRepaid && loan.dueDate) {
      const repaidAt = now;
      const dueDate = new Date(loan.dueDate);
      if (repaidAt <= dueDate) {
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
    }
    // Credit providers: each gets (their funded share) * repayment * (1 + providerCutPercentage/100)
    // The difference between percentageToAdd and providerCutPercentage remains with the company.
    const fundings = await this.prisma.loanFunding.findMany({
      where: { loanId },
      include: { provider: true },
    });
    for (const f of fundings) {
      const share = f.amount / loan.amount;
      const providerCut = f.provider.providerCutPercentage ?? f.provider.percentageToAdd ?? 0;
      const creditAmount = share * amount * (1 + providerCut / 100);
      if (creditAmount <= 0) continue;
      const providerWallet = await this.prisma.providerWallet.findUnique({
        where: { providerId: f.providerId },
      });
      if (providerWallet) {
        await this.prisma.$transaction([
          this.prisma.providerCredit.create({
            data: {
              providerId: f.providerId,
              amount: creditAmount,
              loanId,
            },
          }),
          this.prisma.providerWallet.update({
            where: { id: providerWallet.id },
            data: { balance: { increment: creditAmount } },
          }),
        ]);
      }
    }
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

  async getAppSetting(key: string, defaultValue?: string): Promise<string | undefined> {
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
        status: { in: [LoanStatus.PENDING, LoanStatus.APPROVED, LoanStatus.DISBURSED] },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalOutstanding = activeLoans.reduce((sum, l) => {
      const remaining = Math.max(0, l.amount - l.amountRepaid);
      return sum + remaining;
    }, 0);

    const availableAmount = Math.max(0, creditLimit - totalOutstanding);
    const canRequest = availableAmount > 0;

    // For repayment: use the loan with the highest remaining (primary debt)
    const withRemaining = activeLoans.map((l) => ({
      loan: l,
      remaining: Math.max(0, l.amount - l.amountRepaid),
    }));
    const primary =
      withRemaining.length > 0
        ? withRemaining.reduce((a, b) =>
            b.remaining > a.remaining ? b : a
          )
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
   * updates the wallet / provider credits using existing logic.
   */
  async handleBudpayTransaction(payload: {
    reference?: string;
    amount: number;
    currency?: string;
    customer?: { email?: string };
    raw?: unknown;
  }) {
    const amount = Number(payload.amount ?? 0);
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      return { applied: false, reason: 'Invalid amount', reference: payload.reference };
    }

    const email = payload.customer?.email;
    if (!email) {
      return { applied: false, reason: 'Missing customer email', reference: payload.reference };
    }

    const user = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      return { applied: false, reason: 'User not found for email', reference: payload.reference };
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
