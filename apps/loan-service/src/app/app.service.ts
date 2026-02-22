import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaPromise } from '@prisma/client';
import { PrismaService } from '@my-workspace/prisma';

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

  async requestLoan(payload: { userId: string; amount: number; purpose?: string }) {
    if (payload.amount <= 0) throw new BadRequestException('Amount must be positive');
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
    const updated = await this.prisma.loan.update({
      where: { id: loanId },
      data: { status: LoanStatus.APPROVED },
    });
    return { message: 'Loan approved', loan: updated };
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
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: loan.userId },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    const now = new Date();
    const updates: PrismaPromise<unknown>[] = [
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: loan.amount } },
      }),
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
    const updated = await this.prisma.loan.findUnique({ where: { id: loanId } });
    return { message: 'Loan disbursed to wallet', loan: updated };
  }

  async repayLoan(loanId: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Repayment amount must be positive');
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.status !== LoanStatus.DISBURSED) {
      throw new BadRequestException('Only DISBURSED loans can be repaid');
    }
    const currentRepaid = loan.amountRepaid;
    const newRepaid = currentRepaid + amount;
    const fullRepaid = newRepaid >= loan.amount;
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: loan.userId },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient wallet balance for repayment');
    }
    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      }),
      this.prisma.loan.update({
        where: { id: loanId },
        data: {
          amountRepaid: newRepaid,
          ...(fullRepaid ? { status: LoanStatus.REPAID, repaidAt: now } : {}),
        },
      }),
    ]);
    // Credit providers: each gets (their share of loan) * repayment * (1 + percentageToAdd/100)
    const fundings = await this.prisma.loanFunding.findMany({
      where: { loanId },
      include: { provider: true },
    });
    for (const f of fundings) {
      const share = f.amount / loan.amount;
      const creditAmount =
        share * amount * (1 + (f.provider.percentageToAdd ?? 0) / 100);
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
    const updated = await this.prisma.loan.findUnique({ where: { id: loanId } });
    return { message: fullRepaid ? 'Loan fully repaid' : 'Repayment recorded', loan: updated };
  }
}
