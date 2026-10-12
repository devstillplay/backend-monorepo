import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type ZoomRegistrationResult = {
  joinUrl: string | null;
  registrantId: string | null;
};

type ZoomRegistrantResponse = {
  id?: number | string;
  registrant_id?: string;
  join_url?: string;
};

/**
 * Registers attendees on a Zoom meeting/webinar via a Server-to-Server OAuth app.
 * Without API credentials, falls back to the shared ZOOM_JOIN_URL.
 */
@Injectable()
export class ZoomService {
  private readonly logger = new Logger(ZoomService.name);
  private readonly accountId: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly meetingId: string;
  private readonly eventType: 'meeting' | 'webinar';
  private readonly fallbackJoinUrl: string | null;
  private cachedToken: { value: string; expiresAt: number } | null = null;

  constructor(config: ConfigService) {
    const read = (key: string) => String(config.get(key) ?? '').trim();
    this.accountId = read('ZOOM_ACCOUNT_ID');
    this.clientId = read('ZOOM_CLIENT_ID');
    this.clientSecret = read('ZOOM_CLIENT_SECRET');
    this.meetingId = read('ZOOM_MEETING_ID').replace(/\s+/g, '');
    this.eventType = read('ZOOM_EVENT_TYPE') === 'webinar' ? 'webinar' : 'meeting';
    this.fallbackJoinUrl = read('ZOOM_JOIN_URL') || null;

    if (this.isApiConfigured) {
      this.logger.log(`Zoom registration enabled (${this.eventType} ${this.meetingId})`);
    } else if (this.hasCredentials) {
      this.logger.log('Zoom credentials set; meeting ID must be set per webinar in admin.');
    } else if (this.fallbackJoinUrl) {
      this.logger.log('Zoom API not configured; using ZOOM_JOIN_URL for registrants.');
    } else {
      this.logger.warn('Zoom is not configured; registrants will not receive a join link.');
    }
  }

  get isApiConfigured(): boolean {
    return !!(this.accountId && this.clientId && this.clientSecret && this.meetingId);
  }

  private get hasCredentials(): boolean {
    return !!(this.accountId && this.clientId && this.clientSecret);
  }

  /** `target` values (set per webinar in admin) override the ZOOM_* env defaults. */
  async registerAttendee(
    input: {
      email: string;
      firstName: string;
      lastName: string;
      jobTitle?: string;
    },
    target?: {
      meetingId?: string | null;
      eventType?: string | null;
      joinUrl?: string | null;
    }
  ): Promise<ZoomRegistrationResult> {
    const meetingId = (target?.meetingId ?? '').replace(/\s+/g, '') || this.meetingId;
    const eventType = target?.eventType
      ? target.eventType === 'webinar'
        ? 'webinar'
        : 'meeting'
      : this.eventType;
    const fallbackJoinUrl = target?.joinUrl?.trim() || this.fallbackJoinUrl;
    const fallback = { joinUrl: fallbackJoinUrl, registrantId: null };
    if (!this.hasCredentials || !meetingId) return fallback;

    try {
      const token = await this.getAccessToken();
      const path = eventType === 'webinar' ? 'webinars' : 'meetings';
      const res = await fetch(
        `https://api.zoom.us/v2/${path}/${encodeURIComponent(meetingId)}/registrants`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: input.email,
            first_name: input.firstName,
            last_name: input.lastName || undefined,
            job_title: input.jobTitle || undefined,
          }),
        }
      );
      const data = (await res.json().catch(() => ({}))) as ZoomRegistrantResponse & {
        message?: string;
      };
      if (!res.ok) {
        this.logger.error(
          `Zoom registrant failed (${res.status}): ${data.message ?? JSON.stringify(data)}`
        );
        return fallback;
      }
      return {
        joinUrl: data.join_url ?? fallbackJoinUrl,
        registrantId:
          data.registrant_id ?? (data.id != null ? String(data.id) : null),
      };
    } catch (err) {
      this.logger.error(
        `Zoom registrant error: ${err instanceof Error ? err.message : String(err)}`
      );
      return fallback;
    }
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.cachedToken && this.cachedToken.expiresAt > now + 60_000) {
      return this.cachedToken.value;
    }
    const basic = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const res = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(this.accountId)}`,
      {
        method: 'POST',
        headers: { Authorization: `Basic ${basic}` },
      }
    );
    const data = (await res.json().catch(() => ({}))) as {
      access_token?: string;
      expires_in?: number;
      reason?: string;
    };
    if (!res.ok || !data.access_token) {
      throw new Error(`Zoom OAuth failed (${res.status}): ${data.reason ?? 'no token'}`);
    }
    this.cachedToken = {
      value: data.access_token,
      expiresAt: now + (data.expires_in ?? 3600) * 1000,
    };
    return data.access_token;
  }
}
