import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import type { OneSignalPushOptions } from './onesignal/onesignal.service';
import type { RenderWebhookPayload } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('notification-send-push')
  async sendPush(@Payload() options: OneSignalPushOptions) {
    return this.appService.sendPush(options);
  }

  @MessagePattern('notification-render-webhook')
  async handleRenderWebhook(@Payload() payload: RenderWebhookPayload) {
    return this.appService.handleRenderWebhook(payload);
  }
}
