import type { Metadata } from "next";
import { Anton } from "next/font/google";
import Link from "next/link";

import { SITE_URL } from "../../lib/config";
import type { WebinarEvent } from "../../lib/events";
import WebinarClient from "./WebinarClient";

const displayFont = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-webinar-display",
  display: "swap",
});

export function webinarMetadata(event: WebinarEvent | null): Metadata {
  if (!event) {
    return {
      title: "Webinars | Still Play",
      description: "Upcoming Still Play webinars on responsible betting and financial innovation.",
    };
  }
  const summary = `${event.labels.dayLabel} · ${event.labels.timeLabel} · ${event.platform}`;
  const images = event.bannerAbsoluteUrl ? [event.bannerAbsoluteUrl] : undefined;
  return {
    title: `${event.title} | Still Play ${event.kicker}`,
    description: `${summary}. ${event.description}`,
    openGraph: {
      title: `${event.kicker}: ${event.title}`,
      description: summary,
      url: `${SITE_URL}${event.pagePath}`,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: `${event.kicker}: ${event.title}`,
      images,
    },
  };
}

export function WebinarPageView({ event }: { event: WebinarEvent | null }) {
  if (!event) {
    return (
      <div style={{ padding: "96px 24px", textAlign: "center", background: "#f7f1e8" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#2b2b2b", marginBottom: 12 }}>
          No upcoming webinar right now
        </h1>
        <p style={{ color: "#5a5a5a", marginBottom: 24 }}>
          Check back soon — we host regular sessions on responsible betting and fair credit.
        </p>
        <Link href="/" style={{ color: "#0b7b4c", fontWeight: 700 }}>
          ← Back to home
        </Link>
      </div>
    );
  }
  return (
    <div className={displayFont.variable}>
      <WebinarClient event={event} />
    </div>
  );
}
