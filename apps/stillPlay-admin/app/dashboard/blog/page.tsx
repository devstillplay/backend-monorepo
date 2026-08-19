"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";

import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import {
  uploadImage,
  type BlogPost,
  type BlogPostPayload,
} from "../../../lib/api";
import {
  useBlogPosts,
  useCreateBlogPost,
  useDeleteBlogPost,
  useUpdateBlogPost,
} from "../../../lib/queries";
import { useAuthStore } from "../../../store/auth";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  status: "draft" | "published";
  publishedAt: string;
};

const emptyForm = (): FormState => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  authorName: "Still Play",
  status: "draft",
  publishedAt: "",
});

function formFromPost(post: BlogPost): FormState {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    content: post.content,
    coverImage: post.coverImage ?? "",
    authorName: post.authorName ?? "",
    status: post.status === "published" ? "published" : "draft",
    publishedAt: toDateInputValue(post.publishedAt),
  };
}

function toPayload(form: FormState): BlogPostPayload {
  return {
    title: form.title.trim(),
    slug: form.slug.trim() || undefined,
    excerpt: form.excerpt.trim() || null,
    content: form.content.trim(),
    coverImage: form.coverImage.trim() || null,
    authorName: form.authorName.trim() || null,
    status: form.status,
    publishedAt: form.publishedAt
      ? new Date(form.publishedAt).toISOString()
      : null,
  };
}

export default function BlogAdminPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuthStore((s) => s.token);
  const { data: posts = [], isLoading, isError, error, refetch, isFetching } =
    useBlogPosts();
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const deleteMutation = useDeleteBlogPost();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.excerpt ?? "").toLowerCase().includes(q) ||
        (p.authorName ?? "").toLowerCase().includes(q)
    );
  }, [posts, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setFormError(null);
    setDialogOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm(formFromPost(post));
    setFormError(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (createMutation.isPending || updateMutation.isPending || uploadingCover) {
      return;
    }
    setDialogOpen(false);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploadingCover(true);
    setFormError(null);
    try {
      const result = await uploadImage(file, {
        folder: "stillplay/blog",
        token,
      });
      setForm((prev) => ({ ...prev, coverImage: result.secureUrl || result.url }));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Cover upload failed");
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  };

  const handleSave = () => {
    setFormError(null);
    if (!form.title.trim() || !form.content.trim()) {
      setFormError("Title and content are required.");
      return;
    }
    const payload = toPayload(form);
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, payload },
        {
          onSuccess: () => setDialogOpen(false),
          onError: (err) =>
            setFormError(err instanceof Error ? err.message : "Update failed"),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setDialogOpen(false),
        onError: (err) =>
          setFormError(err instanceof Error ? err.message : "Create failed"),
      });
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <DashboardHeader search={search} onSearchChange={setSearch} />

      <Box
        sx={{
          background: "#ffffff",
          borderRadius: { xs: 2, md: 2 },
          padding: { xs: 1.5, md: 3.5 },
          marginTop: { xs: 1, md: 3 },
          minHeight: { xs: "auto", md: "calc(100vh - 220px)" },
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              BLOG
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create and publish posts for the Still Play website
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton onClick={() => refetch()} disabled={isFetching} aria-label="Refresh">
              <RefreshIcon />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
              sx={{
                textTransform: "none",
                borderRadius: 999,
                bgcolor: "#0b7b4c",
                "&:hover": { bgcolor: "#0a6b3a" },
              }}
            >
              New post
            </Button>
          </Stack>
        </Stack>

        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error instanceof Error ? error.message : "Failed to load posts"}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
              bgcolor: "#f3f3f3",
              borderRadius: 2,
            }}
          >
            <Typography color="text.secondary">
              {search
                ? "No posts match your search."
                : "No blog posts yet. Create your first one."}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {filtered.map((post) => (
              <Box
                key={post.id}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 2,
                  bgcolor: "#fafafa",
                  borderRadius: 2,
                  border: "1px solid #eee",
                  alignItems: "stretch",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", sm: 140 },
                    height: { xs: 160, sm: 100 },
                    borderRadius: 1.5,
                    overflow: "hidden",
                    bgcolor: "#f4f6f5",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {post.coverImage ? (
                    <Box
                      component="img"
                      src={post.coverImage}
                      alt=""
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <ImageOutlinedIcon sx={{ color: "#bbb", fontSize: 36 }} />
                  )}
                </Box>
                <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      noWrap
                      sx={{ maxWidth: "100%" }}
                    >
                      {post.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={post.status === "published" ? "Published" : "Draft"}
                      sx={{
                        bgcolor: post.status === "published" ? "#e8f5ef" : "#f3f3f3",
                        color: post.status === "published" ? "#0b7b4c" : "#666",
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.excerpt || post.content.slice(0, 140)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.authorName || "Still Play"} ·{" "}
                    {formatDate(post.publishedAt || post.createdAt)} · /blog/{post.slug}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{ alignSelf: { sm: "center" } }}
                >
                  <IconButton aria-label="Edit" onClick={() => openEdit(post)}>
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    color="error"
                    onClick={() => setDeleteTarget(post)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        scroll="paper"
      >
        <DialogTitle>{editing ? "Edit blog post" : "New blog post"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField
              label="Title"
              required
              fullWidth
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <TextField
              label="Slug (optional)"
              fullWidth
              helperText="URL path under /blog/ — leave blank to auto-generate from title"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
            <TextField
              label="Excerpt"
              fullWidth
              multiline
              minRows={2}
              helperText="Short summary shown on the blog list"
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            />
            <TextField
              label="Content"
              required
              fullWidth
              multiline
              minRows={10}
              helperText="Write the full article. Use blank lines between paragraphs."
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Author"
                fullWidth
                value={form.authorName}
                onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
              />
              <TextField
                label="Publish date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.publishedAt}
                onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
              />
            </Stack>
            <FormControl fullWidth size="small">
              <InputLabel id="blog-status-label">Status</InputLabel>
              <Select
                labelId="blog-status-label"
                label="Status"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as "draft" | "published",
                  }))
                }
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={form.status === "published"}
                  onChange={(_, checked) =>
                    setForm((f) => ({
                      ...f,
                      status: checked ? "published" : "draft",
                      publishedAt:
                        checked && !f.publishedAt
                          ? toDateInputValue(new Date().toISOString())
                          : f.publishedAt,
                    }))
                  }
                />
              }
              label="Publish on the website"
            />
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Cover image
              </Typography>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleCoverUpload}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    width: { xs: "100%", sm: 200 },
                    maxWidth: "100%",
                    height: 120,
                    borderRadius: 1.5,
                    overflow: "hidden",
                    bgcolor: "#f4f6f5",
                    border: "1px solid #e5e5e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {form.coverImage ? (
                    <Box
                      component="img"
                      src={form.coverImage}
                      alt="Cover preview"
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <ImageOutlinedIcon sx={{ color: "#bbb" }} />
                  )}
                </Box>
                <Stack spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={
                      uploadingCover ? (
                        <CircularProgress size={16} />
                      ) : (
                        <ImageOutlinedIcon />
                      )
                    }
                    disabled={uploadingCover}
                    onClick={() => coverInputRef.current?.click()}
                    sx={{ textTransform: "none", borderColor: "#0b7b4c", color: "#0b7b4c" }}
                  >
                    {uploadingCover ? "Uploading…" : "Upload cover"}
                  </Button>
                  {form.coverImage ? (
                    <Button
                      size="small"
                      color="inherit"
                      onClick={() => setForm((f) => ({ ...f, coverImage: "" }))}
                      sx={{ textTransform: "none" }}
                    >
                      Remove image
                    </Button>
                  ) : null}
                  <TextField
                    size="small"
                    label="Or paste image URL"
                    value={form.coverImage}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, coverImage: e.target.value }))
                    }
                    sx={{ minWidth: { xs: "100%", sm: 280 }, maxWidth: "100%" }}
                  />
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeDialog} disabled={saving} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || uploadingCover}
            sx={{
              textTransform: "none",
              bgcolor: "#0b7b4c",
              "&:hover": { bgcolor: "#0a6b3a" },
            }}
          >
            {saving ? "Saving…" : editing ? "Save changes" : "Create post"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
      >
        <DialogTitle>Delete post?</DialogTitle>
        <DialogContent>
          <Typography>
            Remove <strong>{deleteTarget?.title}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteTarget(null)}
            disabled={deleteMutation.isPending}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (!deleteTarget) return;
              deleteMutation.mutate(deleteTarget.id, {
                onSuccess: () => setDeleteTarget(null),
              });
            }}
            sx={{ textTransform: "none" }}
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
