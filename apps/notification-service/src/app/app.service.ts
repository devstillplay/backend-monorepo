import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly oneSignal: OneSignalService) {}

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
}
