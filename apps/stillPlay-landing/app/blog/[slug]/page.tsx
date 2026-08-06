"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  fetchPublishedPostBySlug,
  formatBlogDate,
  type BlogPost,
} from "../../../lib/blog";

function renderParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, i) => (
      <Typography
        key={i}
        variant="body1"
        sx={{
          color: "#2a2a2a",
          lineHeight: 1.8,
          mb: 2.5,
          whiteSpace: "pre-wrap",
          fontSize: { xs: "1rem", md: "1.05rem" },
        }}
      >
        {block}
      </Typography>
    ));
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundPost, setNotFoundPost] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPublishedPostBySlug(slug);
        if (cancelled) return;
        if (!data) setNotFoundPost(true);
        else setPost(data);
      } catch {
        if (!cancelled) setNotFoundPost(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography color="text.secondary">Loading…</Typography>
      </Box>
    );
  }

  if (notFoundPost || !post) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Post not found
        </Typography>
        <Button
          component={Link}
          href="/blog"
          sx={{ textTransform: "none", color: "#0b7b4c", fontWeight: 600 }}
        >
          ← Back to Blog
        </Button>
      </Box>
    );
  }

  const dateLabel = formatBlogDate(post.publishedAt || post.createdAt);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#fff" }}>
        <Container maxWidth="md">
          <Button
            component={Link}
            href="/blog"
            sx={{
              textTransform: "none",
              color: "#0b7b4c",
              fontWeight: 600,
              mb: 3,
              px: 0,
              "&:hover": { background: "transparent", color: "#0a6b3a" },
            }}
          >
            ← Back to Blog
          </Button>

          <Typography
            variant="caption"
            sx={{ color: "#0b7b4c", fontWeight: 600, display: "block", mb: 1.5 }}
          >
            {[post.authorName || "Still Play", dateLabel].filter(Boolean).join(" · ")}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#1a1a1a",
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            {post.title}
          </Typography>

          {post.excerpt ? (
            <Typography
              variant="h6"
              sx={{
                color: "#4a4a4a",
                fontWeight: 400,
                lineHeight: 1.5,
                mb: 3,
              }}
            >
              {post.excerpt}
            </Typography>
          ) : null}
        </Container>
      </Box>

      {post.coverImage ? (
        <Box sx={{ bgcolor: "#f5f5f5", pb: { xs: 4, md: 6 } }}>
          <Container maxWidth="md">
            <Box
              component="img"
              src={post.coverImage}
              alt=""
              sx={{
                width: "100%",
                maxHeight: 420,
                objectFit: "cover",
                borderRadius: 2,
                display: "block",
              }}
            />
          </Container>
        </Box>
      ) : null}

      <Box
        sx={{
          py: { xs: 4, md: 6 },
          bgcolor: post.coverImage ? "#fff" : "#f5f5f5",
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={0}>{renderParagraphs(post.content)}</Stack>

          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Button
              component={Link}
              href="/blog"
              variant="outlined"
              sx={{
                textTransform: "none",
                borderColor: "#0b7b4c",
                color: "#0b7b4c",
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#0a6b3a",
                  backgroundColor: "rgba(11,123,76,0.04)",
                },
              }}
            >
              More articles
            </Button>
            <Button
              component={Link}
              href="/#waitlist"
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#FFC107",
                color: "#fff",
                borderRadius: 2,
                "&:hover": { backgroundColor: "#e6ac00" },
              }}
            >
              Join Waitlist
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
