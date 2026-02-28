import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('loan-wallet-get')
  getWallet(@Payload() userId: string) {
    return this.appService.getWallet(userId);
  }

  @MessagePattern('loan-request')
  requestLoan(@Payload() payload: { userId: string; amount: number; purpose?: string }) {
    return this.appService.requestLoan(payload);
  }

  @MessagePattern('loan-list')
  listLoans(@Payload() userId: string) {
    return this.appService.listLoans(userId);
  }

  @MessagePattern('loan-list-all')
  listAllLoans() {
    return this.appService.listAllLoans();
  }

  @MessagePattern('loan-get')
  getLoan(@Payload() loanId: string) {
    return this.appService.getLoan(loanId);
  }

  @MessagePattern('loan-approve')
  approveLoan(@Payload() loanId: string) {
    return this.appService.approveLoan(loanId);
  }

  @MessagePattern('loan-reject')
  rejectLoan(@Payload() loanId: string) {
    return this.appService.rejectLoan(loanId);
  }

  @MessagePattern('loan-disburse')
  disburseLoan(
    @Payload()
    payload: {
      loanId: string;
      dueDate?: string;
      providerFunding?: { providerId: string; amount: number }[];
    },
  ) {
    const dueDate = payload.dueDate ? new Date(payload.dueDate) : undefined;
    return this.appService.disburseLoan(
      payload.loanId,
      dueDate,
      payload.providerFunding,
    );
  }

  @MessagePattern('loan-repay')
  repayLoan(@Payload() payload: { loanId: string; amount: number }) {
    return this.appService.repayLoan(payload.loanId, payload.amount);
  }

  /**
   * Apply a BudPay transaction as a loan repayment.
   * Payload is forwarded from notification-service and should contain:
   * { reference, amount, currency, customer, raw }
   */
  @MessagePattern('loan-budpay-transaction')
  handleBudpayTransaction(
    @Payload()
    payload: {
      reference?: string;
      amount: number;
      currency?: string;
      customer?: { email?: string };
      raw?: unknown;
    },
  ) {
    return this.appService.handleBudpayTransaction(payload);
  }

  @MessagePattern('loan-repayments-by-loan')
  listRepaymentsByLoanId(@Payload() loanId: string) {
    return this.appService.listRepaymentsByLoanId(loanId);
  }

  @MessagePattern('loan-repayments-by-user')
  listRepaymentsByUserId(@Payload() userId: string) {
    return this.appService.listRepaymentsByUserId(userId);
  }

  @MessagePattern('loan-repayments-all')
  listAllRepayments() {
    return this.appService.listAllRepayments();
  }

  // ─── App Settings ──────────────────────────────────────────────────────────

  @MessagePattern('app-settings-get-all')
  getAllSettings() {
    return this.appService.getAllSettings();
  }

  @MessagePattern('app-settings-set')
  setAppSetting(@Payload() payload: { key: string; value: string }) {
    return this.appService.setAppSetting(payload.key, payload.value);
  }

  // ─── Loan Eligibility ──────────────────────────────────────────────────────

  @MessagePattern('loan-eligibility')
  getLoanEligibility(@Payload() userId: string) {
    return this.appService.getLoanEligibility(userId);
  }
}
