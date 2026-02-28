import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OneSignalService, OneSignalPushOptions } from './onesignal/onesignal.service';

export interface RenderWebhookPayload {
  type: string;
  timestamp: string;
  data?: {
    id?: string;
    serviceId?: string;
    serviceName?: string;
    status?: string;
  };
}

// Minimal shape matching BudPay transaction / payout / virtual account webhooks:
// https://developer.budpay.com/webhooks
export interface BudPayWebhookPayload {
  notify?: 'transaction' | 'payout' | 'virtual_account' | string;
  notifyType?: 'successful' | 'failed' | 'pending' | string;
  data?: {
    reference?: string;
    amount?: string | number;
    currency?: string;
    status?: string;
    channel?: string;
    customer?: {
      email?: string;
      first_name?: string | null;
      last_name?: string | null;
      phone?: string | null;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly oneSignal: OneSignalService,
    @Inject('LOAN_SERVICE') private readonly loanClient: ClientProxy,
  ) {}

  async sendPush(options: OneSignalPushOptions) {
    return this.oneSignal.sendPush(options);
  }

  /**
   * Handle Render webhook (deploy_ended, deploy_started, server_failed, etc.).
   * Optionally sends a OneSignal push to "Admin" segment for failures.
   * See: https://render.com/docs/webhooks
   */
  async handleRenderWebhook(payload: RenderWebhookPayload) {
    this.logger.log(`Render webhook: ${payload.type}`, payload.data ?? {});

    const { type, data } = payload;
    const serviceName = data?.serviceName ?? 'Service';
    const status = data?.status;

    if (type === 'deploy_ended' && status === 'succeeded') {
      this.logger.log(`${serviceName} deploy succeeded`);
      return { received: true, message: 'Deploy succeeded' };
    }

    if (type === 'deploy_ended' && status === 'failed') {
      if (this.oneSignal.isConfigured()) {
        await this.oneSignal.sendPush({
          contents: `${serviceName} deploy failed.`,
          headings: 'Deploy failed',
          includedSegments: ['Subscribed Users'],
          data: { type: 'render_deploy_failed', serviceName, eventId: data?.id },
        });
      }
      return { received: true, message: 'Deploy failed – notification sent' };
    }

    if (type === 'server_failed') {
      if (this.oneSignal.isConfigured()) {
        await this.oneSignal.sendPush({
          contents: `${serviceName} has failed. Check Render dashboard.`,
          headings: 'Server failed',
          includedSegments: ['Subscribed Users'],
          data: { type: 'render_server_failed', serviceName, eventId: data?.id },
        });
      }
      return { received: true, message: 'Server failed – notification sent' };
    }

    return { received: true };
  }

  /**
   * Handle BudPay webhooks for transactions, payouts, or virtual account credits.
   * For now we log the event and return 200; you can later wire this to
   * loan-service or wallet logic using the reference / amount / status.
   *
   * Docs: https://developer.budpay.com/webhooks
   */
  async handleBudpayWebhook(payload: BudPayWebhookPayload) {
    const { notify, notifyType, data } = payload;
    const reference = data?.reference;
    const amount = data?.amount;
    const currency = data?.currency;
    const status = data?.status ?? notifyType;

    this.logger.log(
      `BudPay webhook: type=${notify} status=${notifyType} reference=${reference} amount=${amount} ${currency}`,
      data ?? {},
    );

    // If this is a successful payment transaction, attempt to apply it as a loan repayment.
    if (notify === 'transaction' && notifyType === 'successful' && data) {
      const numericAmount = Number(
        // BudPay docs: requested_amount is the original amount; fall back to amount
        (data as any).requested_amount ?? amount ?? 0,
      );
      if (!Number.isNaN(numericAmount) && numericAmount > 0) {
        try {
          await firstValueFrom(
            this.loanClient.send('loan-budpay-transaction', {
              reference,
              amount: numericAmount,
              currency,
              customer: data.customer ?? undefined,
              raw: data,
            }),
          );
        } catch (err) {
          this.logger.error(
            `Failed to forward BudPay transaction ${reference} to loan-service`,
            err instanceof Error ? err.stack : String(err),
          );
        }
      }
    }

    // Always acknowledge so BudPay doesn't keep retrying.
    return { received: true };
  }
}
