import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../guards/auth/auth.guard';

@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy
  ) {}

  @Post('send')
  @UseGuards(AuthGuard)
  sendPush(@Body() body: unknown) {
    return firstValueFrom(
      this.notificationClient.send('notification-send-push', body)
    );
  }

  /**
   * Render webhook endpoint. Configure this URL in Render Dashboard > Integrations > Webhooks.
   * No auth – validate using Render's webhook-signature header if needed.
   */
  @Post('webhooks/render')
  renderWebhook(@Body() body: unknown) {
    return firstValueFrom(
      this.notificationClient.send('notification-render-webhook', body)
    );
  }

  /**
   * BudPay payment webhook endpoint.
   * Configure this URL in BudPay Dashboard > Webhooks.
   * No auth – BudPay cannot send bearer tokens; rely on BudPay's signing/verification instead.
   */
  @Post('webhooks/budpay')
  budpayWebhook(@Body() body: unknown) {
    return firstValueFrom(
      this.notificationClient.send('notification-budpay-webhook', body)
    );
  }
}
