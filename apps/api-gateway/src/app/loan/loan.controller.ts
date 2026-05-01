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
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export const LOAN_SERVICE = 'LOAN_SERVICE';
type RepaymentGateway = 'budpay' | 'paystack' | 'flutterwave';

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
  constructor(
    @Inject(LOAN_SERVICE) private readonly loanClient: ClientProxy,
    private readonly configService: ConfigService
  ) {}

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

  /**
   * Must be registered before @Get(':loanId') — otherwise "payment-gateway" is captured as a loan id.
   */
  @Get('payment-gateway')
  async getRepaymentGateway() {
    try {
      const settings = (await firstValueFrom(
        this.loanClient.send('app-settings-get-all', {})
      )) as Record<string, unknown>;
      const toGateway = (raw: unknown): RepaymentGateway | null => {
        const value = String(raw ?? '').toLowerCase();
        if (value === 'budpay' || value === 'paystack' || value === 'flutterwave') {
          return value;
        }
        return null;
      };
      const primary = toGateway(settings.repayment_primary_gateway) ?? 'budpay';
      const fallback1 = toGateway(settings.repayment_gateway_fallback_1);
      const fallback2 = toGateway(settings.repayment_gateway_fallback_2);
      const fallbackOrder = [fallback1, fallback2].filter(
        (g): g is RepaymentGateway => !!g && g !== primary
      );
      return { gateway: primary, primary, fallbackOrder };
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
  async repayLoan(
    @Body()
    body: {
      loanId?: string;
      userId?: string;
      amount: number;
      scope?: 'single' | 'portfolio';
    }
  ) {
    if (body?.amount == null) {
      throw new BadRequestException('amount is required');
    }
    const amount = Number(body.amount);
    const scope =
      body.scope === 'portfolio'
        ? 'portfolio'
        : body.scope === 'single' || body.loanId
          ? 'single'
          : body.userId
            ? 'portfolio'
            : 'single';
    try {
      if (scope === 'portfolio') {
        if (!body.userId) {
          throw new BadRequestException('userId is required for portfolio repayment');
        }
        return await firstValueFrom(
          this.loanClient.send('loan-repay-portfolio', {
            userId: body.userId,
            amount,
          })
        );
      }
      if (!body.loanId) {
        throw new BadRequestException('loanId is required for single-loan repayment');
      }
      return await firstValueFrom(
        this.loanClient.send('loan-repay', {
          loanId: body.loanId,
          amount,
        })
      );
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Post('paystack/verify')
  async verifyPaystackAndRepay(
    @Body()
    body: {
      loanId?: string;
      userId?: string;
      amount: number;
      reference: string;
      scope?: 'single' | 'portfolio';
    }
  ) {
    if (body?.amount == null || !body?.reference) {
      throw new BadRequestException('amount and reference are required');
    }
    const scope =
      body.scope === 'portfolio'
        ? 'portfolio'
        : body.scope === 'single' || body.loanId
          ? 'single'
          : body.userId
            ? 'portfolio'
            : 'single';
    if (scope === 'portfolio' && !body.userId) {
      throw new BadRequestException('userId is required for portfolio Paystack verify');
    }
    if (scope === 'single' && !body.loanId) {
      throw new BadRequestException('loanId is required for single-loan Paystack verify');
    }
    const expectedAmount = Number(body.amount);
    if (!Number.isFinite(expectedAmount) || expectedAmount <= 0) {
      throw new BadRequestException('amount must be a positive number');
    }

    const secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    if (!secretKey) {
      throw new HttpException('Paystack is not configured on server', 500);
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(body.reference)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const verifyJson = (await verifyRes.json().catch(() => ({}))) as {
      status?: boolean;
      message?: string;
      data?: {
        status?: string;
        amount?: number;
        currency?: string;
        reference?: string;
      };
    };

    if (!verifyRes.ok || verifyJson.status !== true) {
      throw new BadRequestException(
        verifyJson.message ?? 'Unable to verify Paystack transaction'
      );
    }

    const paidAmountNaira = Number(verifyJson.data?.amount ?? 0) / 100;
    const paidAmountRounded = Math.round(paidAmountNaira * 100) / 100;
    const expectedRounded = Math.round(expectedAmount * 100) / 100;
    if (paidAmountRounded + 0.009 < expectedRounded) {
      throw new BadRequestException(
        `Paystack amount mismatch. Expected at least ${expectedRounded}, got ${paidAmountRounded}`
      );
    }
    if (verifyJson.data?.status !== 'success') {
      throw new BadRequestException('Paystack transaction is not successful');
    }

    try {
      return await firstValueFrom(
        this.loanClient.send('loan-paystack-apply-repayment', {
          loanId: body.loanId,
          userId: body.userId,
          amount: expectedRounded,
          reference: body.reference,
          scope,
        })
      );
    } catch (err) {
      handleLoanError(err);
    }
  }
}
