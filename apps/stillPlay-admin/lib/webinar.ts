import { getLandingUrl } from "./env";
import type { WebinarEvent, WebinarHeadlineColor } from "./api";

export const WEBINAR_COLORS = {
  charcoal: "#3a3a3a",
  ink: "#2b2b2b",
  gold: "#C9A227",
  zoomYellow: "#F2B21B",
  green: "#0b7b4c",
  greenDark: "#08603b",
  zoomBlue: "#2D8CFF",
  cream: "#f7f1e8",
};

export const HEADLINE_COLOR_OPTIONS: { value: WebinarHeadlineColor; label: string; hex: string }[] = [
  { value: "ink", label: "Charcoal", hex: WEBINAR_COLORS.ink },
  { value: "gold", label: "Gold", hex: WEBINAR_COLORS.gold },
  { value: "green", label: "Green", hex: WEBINAR_COLORS.green },
];

export const TIMEZONE_OPTIONS = [
  { value: "Africa/Lagos", label: "Lagos (WAT, GMT+1)", short: "WAT" },
  { value: "Africa/Accra", label: "Accra (GMT)", short: "GMT" },
  { value: "Africa/Johannesburg", label: "Johannesburg (SAST, GMT+2)", short: "SAST" },
  { value: "Africa/Nairobi", label: "Nairobi (EAT, GMT+3)", short: "EAT" },
  { value: "Europe/London", label: "London (GMT/BST)", short: "UK time" },
  { value: "America/New_York", label: "New York (ET)", short: "ET" },
  { value: "UTC", label: "UTC", short: "UTC" },
];

export const DEFAULT_OCCUPATIONS = [
  "Student",
  "Software / Tech professional",
  "Finance / Banking",
  "Betting / Gaming industry",
  "Entrepreneur / Business owner",
  "Regulator / Public sector",
  "Media / Journalist",
  "Researcher / Academic",
  "Legal / Compliance",
];

function zonedFields(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour") % 24,
    minute: get("minute"),
    second: get("second"),
  };
}

function offsetMs(date: Date, timeZone: string): number {
  const f = zonedFields(date, timeZone);
  return Date.UTC(f.year, f.month - 1, f.day, f.hour, f.minute, f.second) - date.getTime();
}

const pad = (n: number) => String(n).padStart(2, "0");

/** ISO instant → wall-clock date ("YYYY-MM-DD") and time ("HH:mm") in `timeZone`. */
export function toZonedInputs(iso: string, timeZone: string): { date: string; time: string } {
  const f = zonedFields(new Date(iso), timeZone);
  return { date: `${f.year}-${pad(f.month)}-${pad(f.day)}`, time: `${pad(f.hour)}:${pad(f.minute)}` };
}

/** Wall-clock date + time in `timeZone` → ISO instant (UTC). */
export function fromZonedInputs(date: string, time: string, timeZone: string): string | null {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const first = guess - offsetMs(new Date(guess), timeZone);
  const adjusted = guess - offsetMs(new Date(first), timeZone);
  return new Date(adjusted).toISOString();
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
  event: Pick<WebinarEvent, "startsAt" | "endsAt" | "timezone" | "timezoneLabel">
) {
  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);
  const tz = event.timezone || "Africa/Lagos";
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { dayLabel: "", dateDay: "", dateMonthYear: "", startTime: "", endTime: "", timeLabel: "" };
  }
  const f = zonedFields(start, tz);
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
    dateDay: ordinal(f.day),
    dateMonthYear: `${shortMonth}${get("month").length > shortMonth.length ? "." : ""} ${f.year}`,
    startTime,
    endTime,
    timeLabel: `${startTime} – ${endTime}${tzLabel ? ` (${tzLabel})` : ""}`,
  };
}

export function resolveLandingAsset(url: string | null | undefined): string {
  if (!url) return "";
  return url.startsWith("/") ? `${getLandingUrl()}${url}` : url;
}

export function webinarPublicUrl(event: Pick<WebinarEvent, "slug" | "featured">): string {
  return event.featured
    ? `${getLandingUrl()}/webinar`
    : `${getLandingUrl()}/webinar/${event.slug}`;
}
