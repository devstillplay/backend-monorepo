import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface OneSignalPushOptions {
  /** Message body. Use object for i18n: { en: "Hello", es: "Hola" } or string for single language. */
  contents: Record<string, string> | string;
  /** Optional title/headings. */
  headings?: Record<string, string> | string;
  /** Optional subtitle. */
  subtitle?: Record<string, string> | string;
  /** Target: segment name(s) e.g. ["Subscribed Users"], or external_id(s) for specific users. */
  includedSegments?: string[];
  /** Target: external_id (your user id) – use with include_aliases. */
  includeExternalIds?: string[];
  /** Optional URL to open on tap. */
  url?: string;
  /** Optional key-value data payload. */
  data?: Record<string, string | number | boolean>;
}

@Injectable()
export class OneSignalService {
  private readonly logger = new Logger(OneSignalService.name);
  private readonly appId: string;
  private readonly restApiKey: string;
  private readonly client: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    this.appId = this.config.get<string>('ONE_SIGNAL_APP_ID', '');
    this.restApiKey = this.config.get<string>('ONE_SIGNAL_REST_API_KEY', '');
    this.client = axios.create({
      baseURL: 'https://api.onesignal.com',
      timeout: 15_000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${this.restApiKey}`,
      },
    });
  }

  isConfigured(): boolean {
    return Boolean(this.appId && this.restApiKey);
  }

  /**
   * Send a push notification via OneSignal REST API.
   * See: https://documentation.onesignal.com/reference/create-notification
   */
  async sendPush(options: OneSignalPushOptions): Promise<{ id?: string; error?: string }> {
    if (!this.isConfigured()) {
      this.logger.warn('OneSignal not configured (ONE_SIGNAL_APP_ID / ONE_SIGNAL_REST_API_KEY). Skipping send.');
      return { error: 'OneSignal not configured' };
    }

    const contents =
      typeof options.contents === 'string'
        ? { en: options.contents }
        : options.contents;
    const headings = options.headings
      ? typeof options.headings === 'string'
        ? { en: options.headings }
        : options.headings
      : undefined;
    const subtitle = options.subtitle
      ? typeof options.subtitle === 'string'
        ? { en: options.subtitle }
        : options.subtitle
      : undefined;

    const body: Record<string, unknown> = {
      app_id: this.appId,
      contents,
      target_channel: 'push',
    };
    if (headings) body.headings = headings;
    if (subtitle) body.subtitle = subtitle;
    if (options.url) body.url = options.url;
    if (options.data) body.data = options.data;

    if (options.includedSegments?.length) {
      body.included_segments = options.includedSegments;
    } else if (options.includeExternalIds?.length) {
      body.include_aliases = { external_id: options.includeExternalIds };
    } else {
      body.included_segments = ['Subscribed Users'];
    }

    try {
      const { data } = await this.client.post('/notifications', body);
      this.logger.log(`OneSignal notification sent: ${data?.id ?? 'no id'}`);
      return { id: data?.id };
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.errors?.[0] ?? err.message
        : String(err);
      this.logger.error(`OneSignal send failed: ${message}`);
      return { error: message };
    }
  }
}
