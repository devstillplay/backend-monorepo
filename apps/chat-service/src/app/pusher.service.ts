import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Pusher from 'pusher';

@Injectable()
export class PusherService {
  private readonly logger = new Logger(PusherService.name);
  private readonly pusher: Pusher | null = null;

  constructor(private readonly config: ConfigService) {
    const appId = this.config.get<string>('PUSHER_APP_ID');
    const key = this.config.get<string>('PUSHER_KEY');
    const secret = this.config.get<string>('PUSHER_SECRET');
    const cluster = this.config.get<string>('PUSHER_CLUSTER', 'ap1');

    if (appId && key && secret) {
      this.pusher = new Pusher({
        appId,
        key,
        secret,
        cluster,
        useTLS: true,
      });
    } else {
      this.logger.warn(
        'Pusher not configured (PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET). Skipping real-time events.',
      );
    }
  }

  isConfigured(): boolean {
    return this.pusher !== null;
  }

  async trigger(chatSupportId: string, event: string, data: unknown) {
    if (!this.pusher) return;
    const channel = `chat-${chatSupportId}`;
    try {
      await this.pusher.trigger(channel, event, data);
      this.logger.log(`Pusher triggered: ${channel} / ${event}`);
    } catch (err) {
      this.logger.error(
        `Pusher trigger failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
