import { Body, Controller, Headers, Inject, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import { AuthGuard } from '../guards/auth/auth.guard';

@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
    private readonly config: ConfigService
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

  /**
   * Paystack webhook — Dashboard → Settings → API Keys & Webhooks → Webhook URL.
   * Verifies `x-paystack-signature` (HMAC SHA512 of JSON.stringify(body), per Paystack docs).
   * Public URL example: `https://<your-api-host>/api/notifications/webhooks/paystack`
   */
  @Post('webhooks/paystack')
  paystackWebhook(
    @Body() body: Record<string, unknown>,
    @Headers('x-paystack-signature') signature: string | undefined
  ) {
    const secret = this.config.get<string>('PAYSTACK_SECRET_KEY')?.trim();
    if (!secret) {
      throw new UnauthorizedException('Paystack is not configured on server');
    }
    const bodyString = JSON.stringify(body);
    const hash = crypto.createHmac('sha512', secret).update(bodyString).digest('hex');
    if (
      !signature ||
      hash.length !== signature.length ||
      !crypto.timingSafeEqual(Buffer.from(hash, 'utf8'), Buffer.from(signature, 'utf8'))
    ) {
      throw new UnauthorizedException('Invalid Paystack webhook signature');
    }
    return firstValueFrom(
      this.notificationClient.send('notification-paystack-webhook', body)
    );
  }
}
