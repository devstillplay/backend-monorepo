import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../guards/auth/auth.guard';
import type { RequestWithUser } from '../types/request.types';
import { LOAN_SERVICE } from '../loan/loan.controller';

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
  const isConnectionError =
    typeof msgStr === 'string' &&
    (msgStr.includes('ECONNREFUSED') ||
      msgStr.includes('ETIMEDOUT') ||
      msgStr.includes('connect'));
  const message =
    msgStr && msgStr !== 'Internal server error'
      ? msgStr
      : isConnectionError
        ? 'Loan service unavailable. Ensure the loan-service is running.'
        : 'Internal server error';
  const code = statusCode >= 400 && statusCode < 600 ? statusCode : 500;
  const finalCode =
    code === 500 && typeof message === 'string' && message.includes('unavailable')
      ? 503
      : code;
  throw new HttpException(message, finalCode);
}

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(
    @Inject('ADMIN_SERVICE') private readonly adminClient: ClientProxy,
    @Inject(LOAN_SERVICE) private readonly loanClient: ClientProxy
  ) {}

  @Get('users')
  listUsers() {
    return firstValueFrom(this.adminClient.send('admin-users-list', {}));
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return firstValueFrom(this.adminClient.send('admin-users-get', id));
  }

  @Post('users')
  createUser(@Body() body: unknown) {
    return firstValueFrom(this.adminClient.send('admin-users-create', body));
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() body: unknown) {
    return firstValueFrom(
      this.adminClient.send('admin-users-update', { id, data: body })
    );
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return firstValueFrom(this.adminClient.send('admin-users-delete', id));
  }

  @Post('users/:id/verify')
  verifyUser(@Param('id') id: string) {
    return firstValueFrom(this.adminClient.send('admin-users-verify', id));
  }

  @Get('employees')
  listEmployees() {
    return firstValueFrom(this.adminClient.send('admin-employees-list', {}));
  }

  @Get('employees/:id')
  getEmployee(@Param('id') id: string) {
    return firstValueFrom(this.adminClient.send('admin-employees-get', id));
  }

  @Post('employees')
  createEmployee(@Body() body: unknown) {
    return firstValueFrom(
      this.adminClient.send('admin-employees-create', body)
    );
  }

  @Patch('employees/:id')
  updateEmployee(@Param('id') id: string, @Body() body: unknown) {
    return firstValueFrom(
      this.adminClient.send('admin-employees-update', { id, data: body })
    );
  }

  @Delete('employees/:id')
  deleteEmployee(@Param('id') id: string) {
    return firstValueFrom(
      this.adminClient.send('admin-employees-delete', id)
    );
  }

  @Post('activity')
  createActivity(
    @Req() req: RequestWithUser,
    @Body() body: { action: string; ip?: string }
  ) {
    return firstValueFrom(
      this.adminClient.send('admin-activity-create', {
        userId: req.user.id,
        action: body.action,
        ip: body.ip,
      })
    );
  }

  @Get('activity')
  listActivity(
    @Req() req: RequestWithUser,
    @Query('limit') limit?: string
  ) {
    return firstValueFrom(
      this.adminClient.send('admin-activity-list', {
        userId: req.user.id,
        limit: limit != null ? parseInt(limit, 10) : 50,
      })
    );
  }

  // ---------- Admin: loans (request for user, view user loan history & repayments) ----------
  @Post('loans/request')
  async requestLoanForUser(
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

  @Get('loans')
  async getAllLoans() {
    try {
      return await firstValueFrom(this.loanClient.send('loan-list-all', {}));
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Get('loans/all')
  async getAllLoansAlt() {
    return this.getAllLoans();
  }

  @Get('loans/all/repayments')
  async getAllRepayments() {
    try {
      return await firstValueFrom(this.loanClient.send('loan-repayments-all', {}));
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Get('loans/user/:userId')
  async getUserLoanHistory(@Param('userId') userId: string) {
    try {
      return await firstValueFrom(
        this.loanClient.send('loan-list', userId)
      );
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Get('loans/user/:userId/repayments')
  async getUserRepayments(@Param('userId') userId: string) {
    try {
      return await firstValueFrom(
        this.loanClient.send('loan-repayments-by-user', userId)
      );
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Get('loans/user/:userId/wallet')
  async getUserWallet(@Param('userId') userId: string) {
    try {
      return await firstValueFrom(
        this.loanClient.send('loan-wallet-get', userId)
      );
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Get('loans/:loanId/repayments')
  async getLoanRepayments(@Param('loanId') loanId: string) {
    try {
      return await firstValueFrom(
        this.loanClient.send('loan-repayments-by-loan', loanId)
      );
    } catch (err) {
      handleLoanError(err);
    }
  }

  @Post('loans/approve')
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

  @Post('loans/reject')
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
}
