"use client";

import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  fetchPublishedPosts,
  formatBlogDate,
  type BlogPost,
} from "../../lib/blog";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPublishedPosts();
        if (!cancelled) setPosts(data);
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Could not load posts");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#fff" }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              mb: 1,
              color: "#1a1a1a",
              fontSize: { xs: "1.75rem", md: "2.5rem" },
            }}
          >
            Blog
          </Typography>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", color: "#4a4a4a", fontWeight: 400 }}
          >
            Insights, updates, and stories from Still Play
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#f5f5f5" }}>
        <Container maxWidth="lg">
          {loading ? (
            <Typography textAlign="center" color="text.secondary">
              Loading posts…
            </Typography>
          ) : loadError ? (
            <Typography color="error" textAlign="center">
              {loadError}
            </Typography>
          ) : posts.length === 0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
                bgcolor: "#fff",
                borderRadius: 2,
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Typography sx={{ color: "#4a4a4a" }}>
                No posts published yet. Check back soon.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {posts.map((post) => (
                <Grid item xs={12} md={6} key={post.id}>
                  <Box
                    component={Link}
                    href={`/blog/${post.slug}`}
                    sx={{
                      display: "block",
                      height: "100%",
                      textDecoration: "none",
                      color: "inherit",
                      bgcolor: "#fff",
                      borderRadius: 2,
                      border: "1px solid rgba(0,0,0,0.08)",
                      overflow: "hidden",
                      transition: "box-shadow 0.2s, transform 0.2s",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 200,
                        bgcolor: "#e8f5ef",
                        backgroundImage: post.coverImage
                          ? `url(${post.coverImage})`
                          : "linear-gradient(135deg, #0b7b4c 0%, #FFC107 100%)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <Stack spacing={1.25} sx={{ p: 3 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "#0b7b4c", fontWeight: 600 }}
                      >
                        {[
                          post.authorName || "Still Play",
                          formatBlogDate(post.publishedAt || post.createdAt),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#4a4a4a",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.6,
                        }}
                      >
                        {post.excerpt || post.content}
                      </Typography>
                      <Button
                        component="span"
                        sx={{
                          alignSelf: "flex-start",
                          textTransform: "none",
                          color: "#0b7b4c",
                          fontWeight: 600,
                          px: 0,
                          "&:hover": {
                            background: "transparent",
                            color: "#0a6b3a",
                          },
                        }}
                      >
                        Read more →
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
}
