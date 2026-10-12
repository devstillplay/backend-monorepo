import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaService } from '@my-workspace/prisma';
import {
  DEFAULT_OCCUPATIONS,
  DEFAULT_WEBINAR,
  HEADLINE_COLORS,
  type DiscussionPoint,
  type HeadlineColor,
  type HeadlineLine,
} from './events.config';
import { ZoomService } from './zoom.service';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

export type EventRegisterPayload = {
  eventSlug: string;
  fullName: string;
  email: string;
  occupation: string;
};

export type WebinarInput = Partial<{
  slug: string;
  kicker: string;
  title: string;
  headlineLines: unknown;
  description: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  timezoneLabel: string;
  platform: string;
  bannerUrl: string | null;
  discussionKicker: string | null;
  discussionTitle: string | null;
  discussionPoints: unknown;
  formTitle: string | null;
  formSubtitle: string | null;
  registerButtonLabel: string | null;
  occupationOptions: unknown;
  zoomMeetingId: string | null;
  zoomEventType: string | null;
  zoomJoinUrl: string | null;
  published: boolean;
  featured: boolean;
  registrationOpen: boolean;
}>;

type WebinarRecord = NonNullable<
  Awaited<ReturnType<PrismaService['webinarEvent']['findUnique']>>
>;

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts.shift() ?? fullName;
  return { firstName, lastName: parts.join(' ') };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function isValidTimezone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

function parseDate(value: unknown, field: string): Date {
  const d = new Date(typeof value === 'string' ? value : NaN);
  if (Number.isNaN(d.getTime())) throw new BadRequestException(`${field} must be a valid date`);
  return d;
}

function parseHeadlineLines(value: unknown): HeadlineLine[] | null {
  if (value == null) return null;
  if (!Array.isArray(value)) throw new BadRequestException('headlineLines must be a list');
  const lines = value
    .map((raw) => {
      const r = (raw ?? {}) as { text?: unknown; color?: unknown };
      const text = typeof r.text === 'string' ? r.text.trim() : '';
      const color = HEADLINE_COLORS.includes(r.color as HeadlineColor)
        ? (r.color as HeadlineColor)
        : 'ink';
      return { text, color };
    })
    .filter((l) => l.text);
  if (lines.length > 8) throw new BadRequestException('Headline can have at most 8 lines');
  if (lines.some((l) => l.text.length > 60)) {
    throw new BadRequestException('Each headline line must be 60 characters or fewer');
  }
  return lines.length ? lines : null;
}

function parseDiscussionPoints(value: unknown): DiscussionPoint[] | null {
  if (value == null) return null;
  if (!Array.isArray(value)) throw new BadRequestException('discussionPoints must be a list');
  const points = value
    .map((raw) => {
      const r = (raw ?? {}) as { title?: unknown; desc?: unknown };
      return {
        title: typeof r.title === 'string' ? r.title.trim() : '',
        desc: typeof r.desc === 'string' ? r.desc.trim() : '',
      };
    })
    .filter((p) => p.title);
  if (points.length > 8) throw new BadRequestException('At most 8 discussion points');
  if (points.some((p) => p.title.length > 80 || p.desc.length > 300)) {
    throw new BadRequestException(
      'Discussion point titles must be ≤ 80 characters and descriptions ≤ 300'
    );
  }
  return points.length ? points : null;
}

function parseOccupations(value: unknown): string[] {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new BadRequestException('occupationOptions must be a list');
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of value) {
    const v = typeof raw === 'string' ? raw.trim().slice(0, 80) : '';
    if (v && !seen.has(v.toLowerCase())) {
      seen.add(v.toLowerCase());
      out.push(v);
    }
  }
  return out.slice(0, 30);
}

@Injectable()
export class EventsService implements OnModuleInit {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly zoom: ZoomService
  ) {}

  async onModuleInit() {
    try {
      const count = await this.prisma.webinarEvent.count();
      if (count === 0) {
        await this.prisma.webinarEvent.create({ data: DEFAULT_WEBINAR });
        this.logger.log(`Seeded default webinar "${DEFAULT_WEBINAR.slug}"`);
      }
    } catch (err) {
      this.logger.warn(
        `Could not seed default webinar: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  // ---- Public ----

  async getFeatured() {
    const featured =
      (await this.prisma.webinarEvent.findFirst({
        where: { published: true, featured: true },
        orderBy: { startsAt: 'desc' },
      })) ??
      (await this.prisma.webinarEvent.findFirst({
        where: { published: true, endsAt: { gte: new Date() } },
        orderBy: { startsAt: 'asc' },
      }));
    return { event: featured ? this.toPublic(featured) : null };
  }

  async getPublicBySlug(slug: string) {
    const event = slug
      ? await this.prisma.webinarEvent.findUnique({ where: { slug } })
      : null;
    if (!event || !event.published) throw new NotFoundException('Webinar not found');
    return { event: this.toPublic(event) };
  }

  async register(payload: EventRegisterPayload) {
    const event = payload?.eventSlug
      ? await this.prisma.webinarEvent.findUnique({ where: { slug: payload.eventSlug } })
      : null;
    if (!event || !event.published) throw new NotFoundException('Event not found');

    const fullName = payload.fullName?.trim();
    const email = payload.email?.trim().toLowerCase();
    const occupation = payload.occupation?.trim();
    if (!fullName || !email || !occupation) {
      throw new BadRequestException('fullName, email and occupation are required');
    }
    if (!EMAIL_RE.test(email)) {
      throw new BadRequestException('Please enter a valid email address');
    }
    if (fullName.length > 120 || occupation.length > 120) {
      throw new BadRequestException('Name and occupation must be 120 characters or fewer');
    }
    if (!event.registrationOpen || event.endsAt.getTime() < Date.now()) {
      throw new BadRequestException('Registration for this event has closed');
    }

    const where = { eventSlug_email: { eventSlug: event.slug, email } };
    const existing = await this.prisma.eventRegistration.findUnique({ where });

    let zoomJoinUrl = existing?.zoomJoinUrl ?? null;
    let zoomRegistrantId = existing?.zoomRegistrantId ?? null;
    if (!zoomRegistrantId) {
      const { firstName, lastName } = splitName(fullName);
      const zoom = await this.zoom.registerAttendee(
        { email, firstName, lastName, jobTitle: occupation },
        {
          meetingId: event.zoomMeetingId,
          eventType: event.zoomEventType,
          joinUrl: event.zoomJoinUrl,
        }
      );
      zoomJoinUrl = zoom.joinUrl ?? zoomJoinUrl;
      zoomRegistrantId = zoom.registrantId;
    }

    const registration = await this.prisma.eventRegistration.upsert({
      where,
      create: {
        eventSlug: event.slug,
        fullName,
        email,
        occupation,
        zoomJoinUrl,
        zoomRegistrantId,
      },
      update: { fullName, occupation, zoomJoinUrl, zoomRegistrantId },
    });

    return {
      message: existing ? 'Registration updated' : 'Registered',
      alreadyRegistered: !!existing,
      registration: {
        id: registration.id,
        fullName: registration.fullName,
        email: registration.email,
        occupation: registration.occupation,
        zoomJoinUrl: registration.zoomJoinUrl,
        createdAt: registration.createdAt,
      },
    };
  }

  // ---- Admin ----

  async listRegistrations(eventSlug?: string) {
    const events = await this.prisma.webinarEvent.findMany({
      orderBy: { startsAt: 'desc' },
      select: { slug: true, title: true, startsAt: true, endsAt: true, timezone: true },
    });
    if (eventSlug && !events.some((e) => e.slug === eventSlug)) {
      throw new NotFoundException('Event not found');
    }
    const registrations = await this.prisma.eventRegistration.findMany({
      where: eventSlug ? { eventSlug } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return { events, registrations };
  }

  async adminList() {
    const [events, counts] = await Promise.all([
      this.prisma.webinarEvent.findMany({ orderBy: { startsAt: 'desc' } }),
      this.prisma.eventRegistration.groupBy({ by: ['eventSlug'], _count: { _all: true } }),
    ]);
    const countBySlug = new Map(counts.map((c) => [c.eventSlug, c._count._all]));
    return {
      events: events.map((e) => ({ ...e, registrationCount: countBySlug.get(e.slug) ?? 0 })),
    };
  }

  async adminGet(id: string) {
    return { event: await this.findByIdOrThrow(id) };
  }

  async create(input: WebinarInput) {
    const data = this.buildData(input ?? {}, null);
    const slug = (data.slug as string | undefined) || slugify(String(data.title));
    if (!slug) throw new BadRequestException('Could not generate a slug from the title');
    await this.assertSlugAvailable(slug);

    const event = await this.prisma.webinarEvent.create({
      data: { ...(data as Prisma.WebinarEventCreateInput), slug },
    });
    if (event.featured) await this.unfeatureOthers(event.id);
    return { event };
  }

  async update(id: string, input: WebinarInput) {
    const existing = await this.findByIdOrThrow(id);
    const data = this.buildData(input ?? {}, existing);
    const nextSlug = data.slug as string | undefined;
    if (nextSlug && nextSlug !== existing.slug) {
      await this.assertSlugAvailable(nextSlug);
    }

    const event = await this.prisma.webinarEvent.update({
      where: { id: existing.id },
      data: data as Prisma.WebinarEventUpdateInput,
    });
    if (nextSlug && nextSlug !== existing.slug) {
      await this.prisma.eventRegistration.updateMany({
        where: { eventSlug: existing.slug },
        data: { eventSlug: nextSlug },
      });
    }
    if (event.featured && !existing.featured) await this.unfeatureOthers(event.id);
    return { event };
  }

  async remove(id: string) {
    const existing = await this.findByIdOrThrow(id);
    await this.prisma.eventRegistration.deleteMany({ where: { eventSlug: existing.slug } });
    await this.prisma.webinarEvent.delete({ where: { id: existing.id } });
    return { success: true };
  }

  // ---- Helpers ----

  private toPublic(event: WebinarRecord) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { zoomMeetingId, zoomEventType, zoomJoinUrl, ...rest } = event;
    return {
      ...rest,
      occupationOptions: rest.occupationOptions.length
        ? rest.occupationOptions
        : DEFAULT_OCCUPATIONS,
    };
  }

  private async findByIdOrThrow(id: string): Promise<WebinarRecord> {
    const event = id && OBJECT_ID_RE.test(id)
      ? await this.prisma.webinarEvent.findUnique({ where: { id } })
      : null;
    if (!event) throw new NotFoundException('Webinar not found');
    return event;
  }

  private async assertSlugAvailable(slug: string) {
    const clash = await this.prisma.webinarEvent.findUnique({ where: { slug } });
    if (clash) throw new BadRequestException(`The URL slug "${slug}" is already in use`);
  }

  private async unfeatureOthers(id: string) {
    await this.prisma.webinarEvent.updateMany({
      where: { featured: true, id: { not: id } },
      data: { featured: false },
    });
  }

  /** `existing` null = create (all required fields enforced); otherwise only provided keys are updated. */
  private buildData(input: WebinarInput, existing: WebinarRecord | null) {
    const isCreate = existing === null;
    const data: Record<string, unknown> = {};
    const has = (key: keyof WebinarInput) =>
      isCreate || Object.prototype.hasOwnProperty.call(input, key);
    const readText = (key: keyof WebinarInput, max: number, label: string) => {
      const raw = input[key];
      const value = typeof raw === 'string' ? raw.trim() : '';
      if (value.length > max) {
        throw new BadRequestException(`${label} must be ${max} characters or fewer`);
      }
      return value;
    };
    const required = (key: keyof WebinarInput, max: number, label: string) => {
      if (!has(key)) return;
      const value = readText(key, max, label);
      if (!value) throw new BadRequestException(`${label} is required`);
      data[key] = value;
    };
    const withDefault = (key: keyof WebinarInput, max: number, label: string, fallback: string) => {
      if (!has(key)) return;
      data[key] = readText(key, max, label) || fallback;
    };
    const nullable = (key: keyof WebinarInput, max: number, label: string) => {
      if (!has(key)) return;
      data[key] = readText(key, max, label) || null;
    };

    required('title', 200, 'Title');
    required('description', 2000, 'Description');
    withDefault('kicker', 40, 'Kicker', 'Webinar');
    withDefault('timezoneLabel', 30, 'Timezone label', 'WAT');
    withDefault('platform', 40, 'Platform', 'Zoom');
    nullable('discussionKicker', 60, 'Discussion kicker');
    nullable('discussionTitle', 200, 'Discussion heading');
    nullable('formTitle', 80, 'Form title');
    nullable('formSubtitle', 300, 'Form subtitle');
    nullable('registerButtonLabel', 40, 'Register button label');
    nullable('bannerUrl', 1000, 'Banner URL');
    nullable('zoomJoinUrl', 500, 'Zoom join URL');
    nullable('zoomMeetingId', 40, 'Zoom meeting ID');

    if (typeof data.bannerUrl === 'string' && !/^(https?:\/\/|\/)/i.test(data.bannerUrl)) {
      throw new BadRequestException('Banner URL must start with https:// or /');
    }
    if (typeof data.zoomJoinUrl === 'string' && !/^https:\/\//i.test(data.zoomJoinUrl)) {
      throw new BadRequestException('Zoom join URL must start with https://');
    }
    if (typeof data.zoomMeetingId === 'string') {
      data.zoomMeetingId = data.zoomMeetingId.replace(/\s+/g, '');
      if (!/^\d{9,13}$/.test(data.zoomMeetingId as string)) {
        throw new BadRequestException('Zoom meeting ID should be 9–13 digits');
      }
    }
    if (has('zoomEventType')) {
      const t = input.zoomEventType;
      data.zoomEventType = t === 'webinar' || t === 'meeting' ? t : null;
    }

    if (has('slug')) {
      const slug = readText('slug', 80, 'Slug').toLowerCase();
      if (slug) {
        if (!SLUG_RE.test(slug)) {
          throw new BadRequestException(
            'Slug can only contain lowercase letters, numbers and single hyphens'
          );
        }
        data.slug = slug;
      }
    }

    if (has('timezone')) {
      const tz = readText('timezone', 60, 'Timezone') || 'Africa/Lagos';
      if (!isValidTimezone(tz)) throw new BadRequestException(`Unknown timezone "${tz}"`);
      data.timezone = tz;
    }

    if (has('startsAt')) data.startsAt = parseDate(input.startsAt, 'Start time');
    if (has('endsAt')) data.endsAt = parseDate(input.endsAt, 'End time');
    const startsAt = (data.startsAt as Date | undefined) ?? existing?.startsAt;
    const endsAt = (data.endsAt as Date | undefined) ?? existing?.endsAt;
    if (startsAt && endsAt && endsAt.getTime() <= startsAt.getTime()) {
      throw new BadRequestException('End time must be after the start time');
    }

    if (has('headlineLines')) {
      data.headlineLines = parseHeadlineLines(input.headlineLines) ?? Prisma.DbNull;
    }
    if (has('discussionPoints')) {
      data.discussionPoints = parseDiscussionPoints(input.discussionPoints) ?? Prisma.DbNull;
    }
    if (has('occupationOptions')) {
      data.occupationOptions = parseOccupations(input.occupationOptions);
    }

    for (const key of ['published', 'featured', 'registrationOpen'] as const) {
      if (typeof input[key] === 'boolean') data[key] = input[key];
      else if (isCreate) data[key] = key === 'registrationOpen';
    }

    return data;
  }
}
