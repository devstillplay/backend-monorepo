import {
  Injectable,
  BadGatewayException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Proxies Dojah KYC verification details (secret stays on the server).
 * @see https://docs.dojah.io/docs/technical-reference/get-verification-details
 */
@Injectable()
export class KycService {
  constructor(private readonly config: ConfigService) {}

  async getDojahVerification(referenceId: string): Promise<unknown> {
    const appId = this.config.get<string>('DOJAH_APP_ID')?.trim();
    const secret = this.config.get<string>('DOJAH_SECRET_KEY')?.trim();
    const baseUrl = (
      this.config.get<string>('DOJAH_API_BASE_URL')?.trim() ||
      'https://api.dojah.io'
    ).replace(/\/$/, '');

    if (!appId || !secret) {
      throw new ServiceUnavailableException(
        'Dojah API is not configured (set DOJAH_APP_ID and DOJAH_SECRET_KEY on the gateway).',
      );
    }

    const url = `${baseUrl}/api/v1/kyc/verification?reference_id=${encodeURIComponent(referenceId)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        AppId: appId,
        Authorization: secret,
      },
    });

    const text = await res.text();
    let body: unknown;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = { raw: text };
    }

    if (!res.ok) {
      const msg =
        typeof body === 'object' &&
        body !== null &&
        'message' in body &&
        typeof (body as { message: unknown }).message === 'string'
          ? (body as { message: string }).message
          : `Dojah returned ${res.status}`;
      throw new BadGatewayException({
        message: msg,
        status: res.status,
        dojah: body,
      });
    }

    return body;
  }
}
