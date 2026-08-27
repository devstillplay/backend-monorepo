import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export type MarketingRecipientSendResult = {
  email: string;
  status: 'sent' | 'failed';
  error?: string;
};

export type MarketingBulkSendResult = {
  sent: number;
  failed: number;
  errors: string[];
  recipientResults: MarketingRecipientSendResult[];
};

@Injectable()
export class MarketingEmailService {
  private readonly logger = new Logger(MarketingEmailService.name);
  private readonly resend: Resend | null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const raw = config.get('RESEND_API_KEY');
    const apiKey = typeof raw === 'string' ? raw.trim() : '';
    this.from =
      config.get('EMAIL_FROM', 'Still Play <noreply@still-play.com>') ??
      'Still Play <noreply@still-play.com>';
    this.resend = apiKey ? new Resend(apiKey) : null;

    if (!apiKey) {
      this.logger.warn(
        'RESEND_API_KEY is not set; marketing emails will not be sent.',
      );
    } else {
      this.logger.log(`Marketing email configured (from: ${this.from})`);
    }
  }

  async sendBulk(
    recipients: string[],
    subject: string,
    html: string
  ): Promise<MarketingBulkSendResult> {
    if (!this.resend) {
      throw new ServiceUnavailableException(
        'Email is not configured. Set RESEND_API_KEY and EMAIL_FROM on admin-service.',
      );
    }
    if (!subject?.trim() || !html?.trim()) {
      throw new BadRequestException('Subject and HTML body are required.');
    }

    const unique = [
      ...new Set(recipients.map((e) => e.trim().toLowerCase()).filter(Boolean)),
    ];
    if (unique.length === 0) {
      return { sent: 0, failed: 0, errors: [], recipientResults: [] };
    }

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];
    const recipientResults: MarketingRecipientSendResult[] = [];
    const chunkSize = 50;

    for (let i = 0; i < unique.length; i += chunkSize) {
      const chunk = unique.slice(i, i + chunkSize);
      const batch = chunk.map((to) => ({
        from: this.from,
        to: [to],
        subject: subject.trim(),
        html,
      }));

      try {
        const { data, error } = await this.resend.batch.send(batch);
        if (error) {
          const errMsg = JSON.stringify(error);
          failed += chunk.length;
          errors.push(errMsg);
          this.logger.error(`Resend batch error: ${errMsg}`);
          for (const email of chunk) {
            recipientResults.push({
              email,
              status: 'failed',
              error: errMsg,
            });
          }
        } else {
          const ids = data?.data ?? [];
          const count = ids.length > 0 ? ids.length : chunk.length;
          sent += count;
          this.logger.log(
            `Resend batch ok: ${count} email(s), ids: ${ids.map((x) => x.id).join(', ')}`,
          );
          for (const email of chunk) {
            recipientResults.push({ email, status: 'sent' });
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        failed += chunk.length;
        errors.push(msg);
        this.logger.error(`Resend batch failed: ${msg}`);
        for (const email of chunk) {
          recipientResults.push({ email, status: 'failed', error: msg });
        }
      }
    }

    return { sent, failed, errors, recipientResults };
  }
}
