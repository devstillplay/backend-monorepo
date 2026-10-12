import type { Metadata } from "next";

import { fetchFeaturedWebinar, toWebinarEvent } from "../../lib/events";
import { WebinarPageView, webinarMetadata } from "./webinarPage";

export const dynamic = "force-dynamic";

async function loadEvent() {
  const data = await fetchFeaturedWebinar();
  return data ? toWebinarEvent(data, "/webinar") : null;
}

export async function generateMetadata(): Promise<Metadata> {
  return webinarMetadata(await loadEvent());
}

export default async function WebinarPage() {
  return <WebinarPageView event={await loadEvent()} />;
}
