import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchWebinarBySlug, toWebinarEvent } from "../../../lib/events";
import { WebinarPageView, webinarMetadata } from "../webinarPage";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

async function loadEvent(slug: string) {
  const data = await fetchWebinarBySlug(slug);
  return data ? toWebinarEvent(data, `/webinar/${data.slug}`) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return webinarMetadata(await loadEvent(params.slug));
}

export default async function WebinarBySlugPage({ params }: Props) {
  const event = await loadEvent(params.slug);
  if (!event) notFound();
  return <WebinarPageView event={event} />;
}
