import { SITE_URL } from "./config";
import { getPublicApiBaseUrl } from "./env";

export type HeadlineColor = "ink" | "gold" | "green";

/** Shape returned by GET /events/featured and /events/:slug (edited in the admin app). */
export type WebinarEventData = {
  id: string;
  slug: string;
  kicker: string;
  title: string;
  headlineLines: { text: string; color: HeadlineColor }[] | null;
  description: string;
  /** ISO 8601, UTC */
  startsAt: string;
  /** ISO 8601, UTC */
  endsAt: string;
  timezone: string;
  timezoneLabel: string;
  platform: string;
  bannerUrl: string | null;
  discussionKicker: string | null;
  discussionTitle: string | null;
  discussionPoints: { title: string; desc: string }[] | null;
  formTitle: string | null;
  formSubtitle: string | null;
  registerButtonLabel: string | null;
  occupationOptions: string[];
  featured: boolean;
  registrationOpen: boolean;
};

export type WebinarLabels = {
  dayLabel: string;
  dateDay: string;
  dateMonthYear: string;
  startTime: string;
  endTime: string;
  timeLabel: string;
};

export type WebinarEvent = WebinarEventData & {
  pagePath: string;
  labels: WebinarLabels;
  /** Absolute URL of the banner, or null. */
  bannerAbsoluteUrl: string | null;
};

function zonedDay(date: Date, timeZone: string): number {
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone, day: "numeric" }).format(date)
  );
}

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

function formatClock(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const period = get("dayPeriod").toUpperCase();
  const minute = get("minute");
  return minute === "00" ? `${get("hour")}${period}` : `${get("hour")}:${minute}${period}`;
}

export function formatWebinarLabels(
  event: Pick<WebinarEventData, "startsAt" | "endsAt" | "timezone" | "timezoneLabel">
): WebinarLabels {
  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);
  const tz = event.timezone || "Africa/Lagos";
  const longParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(start);
  const get = (type: string) => longParts.find((p) => p.type === type)?.value ?? "";
  const shortMonth = new Intl.DateTimeFormat("en-US", { timeZone: tz, month: "short" }).format(start);
  const startTime = formatClock(start, tz);
  const endTime = formatClock(end, tz);
  const tzLabel = event.timezoneLabel?.trim();
  return {
    dayLabel: `${get("weekday")}, ${get("day")} ${get("month")} ${get("year")}`,
    dateDay: ordinal(zonedDay(start, tz)),
    dateMonthYear: `${shortMonth}${get("month").length > shortMonth.length ? "." : ""} ${get("year")}`,
    startTime,
    endTime,
    timeLabel: `${startTime} – ${endTime}${tzLabel ? ` (${tzLabel})` : ""}`,
  };
}

export function toWebinarEvent(data: WebinarEventData, pagePath?: string): WebinarEvent {
  const banner = data.bannerUrl?.trim() || null;
  return {
    ...data,
    pagePath: pagePath ?? (data.featured ? "/webinar" : `/webinar/${data.slug}`),
    labels: formatWebinarLabels(data),
    bannerAbsoluteUrl: banner ? (banner.startsWith("/") ? `${SITE_URL}${banner}` : banner) : null,
  };
}

export function isWebinarOver(event: Pick<WebinarEventData, "endsAt">): boolean {
  return new Date(event.endsAt).getTime() < Date.now();
}

async function fetchEvent(path: string, init?: RequestInit): Promise<WebinarEventData | null> {
  try {
    const res = await fetch(`${getPublicApiBaseUrl()}${path}`, {
      ...init,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json().catch(() => ({}))) as { event?: WebinarEventData | null };
    return data.event ?? null;
  } catch {
    return null;
  }
}

/** Server: always fresh so admin edits show immediately. */
export function fetchFeaturedWebinar(): Promise<WebinarEventData | null> {
  return fetchEvent("/events/featured", { cache: "no-store" });
}

export function fetchWebinarBySlug(slug: string): Promise<WebinarEventData | null> {
  return fetchEvent(`/events/${encodeURIComponent(slug)}`, { cache: "no-store" });
}

export type EventRegistrationResult = {
  message: string;
  alreadyRegistered: boolean;
  registration: {
    id: string;
    fullName: string;
    email: string;
    occupation: string;
    zoomJoinUrl: string | null;
    createdAt: string;
  };
};

export async function registerForEvent(
  slug: string,
  payload: { fullName: string; email: string; occupation: string }
): Promise<EventRegistrationResult> {
  const res = await fetch(
    `${getPublicApiBaseUrl()}/events/${encodeURIComponent(slug)}/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  const data = (await res.json().catch(() => ({}))) as Partial<EventRegistrationResult> & {
    message?: string | string[];
  };
  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message[0] : data.message;
    throw new Error(msg || `Could not register (${res.status})`);
  }
  return data as EventRegistrationResult;
}

function toCalendarStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function calendarDetails(event: WebinarEvent, joinUrl?: string | null): string {
  const pageUrl = `${SITE_URL}${event.pagePath}`;
  return [
    event.description,
    "",
    joinUrl ? `Join on ${event.platform}: ${joinUrl}` : `Event details: ${pageUrl}`,
  ].join("\n");
}

function calendarLocation(event: WebinarEvent, joinUrl?: string | null): string {
  return joinUrl || `${event.platform} (online)`;
}

export function googleCalendarUrl(event: WebinarEvent, joinUrl?: string | null): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toCalendarStamp(event.startsAt)}/${toCalendarStamp(event.endsAt)}`,
    details: calendarDetails(event, joinUrl),
    location: calendarLocation(event, joinUrl),
    ctz: event.timezone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(event: WebinarEvent, joinUrl?: string | null): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: new Date(event.startsAt).toISOString(),
    enddt: new Date(event.endsAt).toISOString(),
    body: calendarDetails(event, joinUrl),
    location: calendarLocation(event, joinUrl),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function buildIcs(event: WebinarEvent, joinUrl?: string | null): string {
  const url = joinUrl || `${SITE_URL}${event.pagePath}`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Still Play//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@still-play.com`,
    `DTSTAMP:${toCalendarStamp(new Date().toISOString())}`,
    `DTSTART:${toCalendarStamp(event.startsAt)}`,
    `DTEND:${toCalendarStamp(event.endsAt)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(calendarDetails(event, joinUrl))}`,
    `LOCATION:${escapeIcs(calendarLocation(event, joinUrl))}`,
    `URL:${url}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Webinar starts in 30 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(event: WebinarEvent, joinUrl?: string | null): void {
  const blob = new Blob([buildIcs(event, joinUrl)], {
    type: "text/calendar;charset=utf-8",
  });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = `${event.slug}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}
