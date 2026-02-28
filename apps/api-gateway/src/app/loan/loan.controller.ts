import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export const LOAN_SERVICE = 'LOAN_SERVICE';

function isConnectionOrAggregateError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = (err.message ?? '').toLowerCase();
    if (
      msg.includes('econnrefused') ||
      msg.includes('etimedout') ||
      msg.includes('connect') ||
      msg.includes('enotfound') ||
      msg.includes('econnreset')
    )
      return true;
    if (err.name === 'AggregateError') return true;
  }
  const o = err && typeof err === 'object' ? (err as Record<string, unknown>) : {};
  if (o.name === 'AggregateError') return true;
  const agg = o.errors as unknown[] | undefined;
  if (Array.isArray(agg) && agg.some((e) => isConnectionOrAggregateError(e)))
    return true;
  return false;
}

function handleLoanError(err: unknown): never {
  const o = err && typeof err === 'object' ? (err as Record<string, unknown>) : {};
  const payload = (o.error ?? o.response ?? o) as Record<string, unknown> | undefined;
  const statusCode = Number(
    o.statusCode ?? payload?.statusCode ?? payload?.status ?? 500
  );
  const rawMessage =
    typeof o.message === 'string'
      ? o.message
      : typeof payload?.message === 'string'
        ? payload.message
        : err instanceof Error
          ? err.message
          : '';
  const msgStr =
    typeof rawMessage === 'string'
      ? rawMessage
      : Array.isArray(rawMessage)
        ? rawMessage[0]
        : '';
  const isConnectionError = isConnectionOrAggregateError(err);
  const message =
    msgStr && msgStr !== 'Internal server error' && !isConnectionError
      ? msgStr
      : isConnectionError
        ? 'Loan service unavailable. For local dev, start: npx nx serve loan-service (TCP 8883).'
        : 'Internal server error';
  const code = statusCode >= 400 && statusCode < 600 ? statusCode : 500;
  const finalCode =
    code === 500 && typeof message === 'string' && message.includes('unavailable')
      ? 503
      : code;
  throw new HttpException(
    Array.isArray(message) ? message[0] : message,
    finalCode
  );
}

@Controller('loans')
export class LoanController {
  constructor(@Inject(LOAN_SERVICE) private readonly loanClient: ClientProxy) {}

  @Get('wallet/:userId')
  async getWallet(@Param('userId') userId: string) {
    try {
      return await firstValueFrom(this.loanClient.send('loan-wallet-get', userId));
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Post('request')
  async requestLoan(
    @Body() body: { userId: string; amount: number; purpose?: string }
  ) {
    if (!body?.userId || body?.amount == null) {
      throw new BadRequestException('userId and amount are required');
    }
    try {
      return await firstValueFrom(
        this.loanClient.send('loan-request', {
          userId: body.userId,
          amount: Number(body.amount),
          purpose: body.purpose,
        })
      );
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Get('list/:userId')
  async listLoans(@Param('userId') userId: string) {
    try {
      return await firstValueFrom(this.loanClient.send('loan-list', userId));
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Get('repayments/:userId')
  async listRepaymentsByUser(@Param('userId') userId: string) {
    try {
      return await firstValueFrom(
        this.loanClient.send('loan-repayments-by-user', userId)
      );
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Get('eligibility/:userId')
  async getLoanEligibility(@Param('userId') userId: string) {
    try {
      return await firstValueFrom(
        this.loanClient.send('loan-eligibility', userId)
      );
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Get(':loanId')
  async getLoan(@Param('loanId') loanId: string) {
    try {
      return await firstValueFrom(this.loanClient.send('loan-get', loanId));
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Post('approve')
  async approveLoan(@Body() body: { loanId: string }) {
    if (!body?.loanId) throw new BadRequestException('loanId is required');
    try {
      return await firstValueFrom(
        this.loanClient.send('loan-approve', body.loanId)
      );
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Post('reject')
  async rejectLoan(@Body() body: { loanId: string }) {
    if (!body?.loanId) throw new BadRequestException('loanId is required');
    try {
      return await firstValueFrom(
        this.loanClient.send('loan-reject', body.loanId)
      );
    } catch (err) {
      handleLoanError(err);
    }
  }

  /** Alias for reject – loan request denied */
  @Post('deny')
  async denyLoan(@Body() body: { loanId: string }) {
    if (!body?.loanId) throw new BadRequestException('loanId is required');
    try {
      return await firstValueFrom(
        this.loanClient.send('loan-reject', body.loanId)
      );
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Post('disburse')
  async disburseLoan(
    @Body()
    body: {
      loanId: string;
      dueDate?: string;
      providerFunding?: { providerId: string; amount: number }[];
    },
  ) {
    if (!body?.loanId) throw new BadRequestException('loanId is required');
    try {
      return await firstValueFrom(
        this.loanClient.send('loan-disburse', {
          loanId: body.loanId,
          dueDate: body.dueDate,
          providerFunding: body.providerFunding,
        })
      );
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Post('repay')
  async repayLoan(@Body() body: { loanId: string; amount: number }) {
    if (!body?.loanId || body?.amount == null) {
      throw new BadRequestException('loanId and amount are required');
    }
    try {
      return await firstValueFrom(
        this.loanClient.send('loan-repay', {
          loanId: body.loanId,
          amount: Number(body.amount),
        })
      );
    } catch (err) {
      handleLoanError(err);
    }
  }
}
