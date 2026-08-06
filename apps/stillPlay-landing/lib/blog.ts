import { getPublicApiBaseUrl } from "./env";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: string;
  authorName: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${getPublicApiBaseUrl()}/blog`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to load blog posts (${res.status})`);
  }
  const data = (await res.json().catch(() => ({}))) as { posts?: BlogPost[] };
  return Array.isArray(data.posts) ? data.posts : [];
}

export async function fetchPublishedPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const res = await fetch(
    `${getPublicApiBaseUrl()}/blog/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to load blog post (${res.status})`);
  }
  const data = (await res.json().catch(() => ({}))) as { post?: BlogPost };
  return data.post ?? null;
}

export function formatBlogDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
