import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@my-workspace/prisma';
import {
  MarketingEmailService,
  type MarketingRecipientSendResult,
} from './marketing-email.service';

export type MarketingAudience =
  | 'customers'
  | 'admins'
  | 'waitlist'
  | 'financial_partners'
  | 'partner_inquiries'
  | 'all_survey';

export type MarketingRecipient = {
  email: string;
  name?: string;
  source: string;
};

export type MarketingSendPayload = {
  audiences?: MarketingAudience[];
  customEmails?: string[];
  individualEmails?: string[];
  subject: string;
  html: string;
  sentById?: string;
  sentByEmail?: string;
};

export type MarketingRecipientRecord = MarketingRecipient & {
  status: 'sent' | 'failed';
  error?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseEmailList(raw: string[] | undefined): string[] {
  if (!raw?.length) return [];
  const out: string[] = [];
  for (const line of raw) {
    const parts = line.split(/[\s,;]+/);
    for (const p of parts) {
      const e = p.trim().toLowerCase();
      if (e && EMAIL_RE.test(e)) out.push(e);
    }
  }
  return out;
}

function deriveSendStatus(sent: number, failed: number): 'sent' | 'partial' | 'failed' {
  if (failed === 0 && sent > 0) return 'sent';
  if (sent === 0 && failed > 0) return 'failed';
  return 'partial';
}

@Injectable()
export class MarketingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: MarketingEmailService
  ) {}

  async previewRecipients(payload: Omit<MarketingSendPayload, 'subject' | 'html'>) {
    const recipients = await this.resolveRecipients(payload);
    return {
      count: recipients.length,
      recipients,
    };
  }

  async listSendHistory(limit = 50) {
    const sends = await this.prisma.marketingEmailSend.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 200),
      select: {
        id: true,
        subject: true,
        audiences: true,
        recipientCount: true,
        sent: true,
        failed: true,
        status: true,
        sentByEmail: true,
        createdAt: true,
      },
    });
    return { sends };
  }

  async getSendHistory(id: string) {
    const record = await this.prisma.marketingEmailSend.findUnique({
      where: { id },
    });
    if (!record) throw new NotFoundException('Marketing send record not found');
    return { send: record };
  }

  async sendMarketing(payload: MarketingSendPayload) {
    const subject = payload.subject?.trim();
    const html = payload.html?.trim();
    if (!subject || !html) {
      throw new BadRequestException('subject and html are required');
    }

    const recipients = await this.resolveRecipients(payload);
    if (recipients.length === 0) {
      throw new BadRequestException('No recipients match the selected audiences.');
    }

    const bulkResult = await this.emailService.sendBulk(
      recipients.map((r) => r.email),
      subject,
      html
    );

    const statusByEmail = new Map(
      bulkResult.recipientResults.map((r) => [r.email, r])
    );

    const recipientRecords: MarketingRecipientRecord[] = recipients.map((r) => {
      const delivery = statusByEmail.get(r.email);
      return {
        ...r,
        status: delivery?.status ?? 'failed',
        error: delivery?.error,
      };
    });

    const status = deriveSendStatus(bulkResult.sent, bulkResult.failed);
    const errorsStr =
      bulkResult.errors.length > 0 ? bulkResult.errors.join('; ') : null;

    const saved = await this.prisma.marketingEmailSend.create({
      data: {
        subject,
        audiences: payload.audiences ?? [],
        recipientCount: recipients.length,
        sent: bulkResult.sent,
        failed: bulkResult.failed,
        status,
        errors: errorsStr,
        recipients: recipientRecords,
        sentById: payload.sentById?.trim() || null,
        sentByEmail: payload.sentByEmail?.trim().toLowerCase() || null,
      },
    });

    if (bulkResult.sent === 0 && bulkResult.failed > 0) {
      throw new BadRequestException(
        `Email delivery failed: ${bulkResult.errors.join('; ') || 'Resend rejected the send.'}`,
      );
    }

    return {
      message: 'Marketing email send completed',
      sendId: saved.id,
      recipientCount: recipients.length,
      recipients: recipientRecords,
      status,
      createdAt: saved.createdAt,
      ...bulkResult,
    };
  }

  private async resolveRecipients(
    payload: Pick<
      MarketingSendPayload,
      'audiences' | 'customEmails' | 'individualEmails'
    >
  ): Promise<MarketingRecipient[]> {
    const map = new Map<string, MarketingRecipient>();
    const audiences = payload.audiences ?? [];

    const add = (email: string, source: string, name?: string) => {
      const key = email.trim().toLowerCase();
      if (!key || !EMAIL_RE.test(key)) return;
      if (!map.has(key)) {
        map.set(key, { email: key, source, name: name?.trim() || undefined });
      }
    };

    if (audiences.includes('customers')) {
      const users = await this.prisma.user.findMany({
        select: { email: true, firstName: true, lastName: true },
      });
      for (const u of users) {
        const name = [u.firstName, u.lastName].filter(Boolean).join(' ');
        add(u.email, 'customers', name);
      }
    }

    if (audiences.includes('admins')) {
      const employees = await this.prisma.employee.findMany({
        where: { active: true },
        select: { email: true, firstName: true, lastName: true },
      });
      for (const e of employees) {
        const name = [e.firstName, e.lastName].filter(Boolean).join(' ');
        add(e.email, 'admins', name);
      }
    }

    const needsWaitlist =
      audiences.includes('waitlist') ||
      audiences.includes('financial_partners') ||
      audiences.includes('partner_inquiries') ||
      audiences.includes('all_survey');

    if (needsWaitlist) {
      const entries = await this.prisma.waitlistEntry.findMany({
        select: {
          email: true,
          fullName: true,
          source: true,
          partnerType: true,
        },
      });

      for (const row of entries) {
        const isFinancial =
          row.source === 'financial' ||
          (row.source === 'partners' &&
            row.partnerType === 'Financial Institution');
        const isPartnerInquiry =
          row.source === 'partners' && !isFinancial;
        const isWaitlist = row.source === 'landing';

        if (audiences.includes('all_survey')) {
          add(row.email, `survey:${row.source}`, row.fullName);
          continue;
        }
        if (audiences.includes('waitlist') && isWaitlist) {
          add(row.email, 'waitlist', row.fullName);
        }
        if (audiences.includes('financial_partners') && isFinancial) {
          add(row.email, 'financial_partners', row.fullName);
        }
        if (audiences.includes('partner_inquiries') && isPartnerInquiry) {
          add(row.email, 'partner_inquiries', row.fullName);
        }
      }
    }

    for (const email of parseEmailList(payload.customEmails)) {
      add(email, 'custom');
    }
    for (const email of parseEmailList(payload.individualEmails)) {
      add(email, 'individual');
    }

    return Array.from(map.values());
  }
}
