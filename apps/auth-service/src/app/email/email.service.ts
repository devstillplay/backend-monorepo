import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const raw = config.get('RESEND_API_KEY');
    const apiKey = typeof raw === 'string' ? raw.trim() : '';
    this.from = config.get('EMAIL_FROM', 'StillPlay <onboarding@resend.dev>');
    this.resend = apiKey ? new Resend(apiKey) : null;

    // Confirm env is visible (do not log the key)
    if (apiKey) {
      this.logger.log('RESEND_API_KEY is set; login code emails will be sent.');
    } else {
      this.logger.warn(
        'RESEND_API_KEY is not set; login codes will not be sent by email.',
      );
    }
  }

  async sendLoginCode(to: string, code: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn(
        `Login code for ${to}: ${code} (email not sent - Resend not configured)`,
      );
      return;
    }
    const subject = 'Your StillPlay login code';
    const html = `
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>It expires in 10 minutes. Do not share this code.</p>
    `;
    const { error } = await this.resend.emails.send({
      from: this.from,
      to: [to],
      subject,
      html,
    });
    if (error) {
      this.logger.error(
        `Failed to send login code to ${to}: ${JSON.stringify(error)}`,
      );
      throw new ServiceUnavailableException(
        'Verification email could not be sent. Please try again later or contact support.',
      );
    }
  }

  async sendPasswordResetCode(to: string, code: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn(
        `Password reset code for ${to}: ${code} (email not sent - Resend not configured)`,
      );
      return;
    }
    const subject = 'StillPlay – Reset your password';
    const html = `
      <p>Your password reset code is: <strong>${code}</strong></p>
      <p>It expires in 10 minutes. Do not share this code.</p>
    `;
    const { error } = await this.resend.emails.send({
      from: this.from,
      to: [to],
      subject,
      html,
    });
    if (error) {
      this.logger.error(
        `Failed to send password reset code to ${to}: ${JSON.stringify(error)}`,
      );
      throw new ServiceUnavailableException(
        'Reset email could not be sent. Please try again later or contact support.',
      );
    }
  }
}
