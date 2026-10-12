"use client";

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import WebinarPreview from "../../../../components/events/WebinarPreview";
import {
  uploadImage,
  type WebinarEvent,
  type WebinarEventPayload,
  type WebinarHeadlineColor,
} from "../../../../lib/api";
import {
  useCreateWebinarEvent,
  useUpdateWebinarEvent,
  useWebinarEvent,
} from "../../../../lib/queries";
import {
  DEFAULT_OCCUPATIONS,
  HEADLINE_COLOR_OPTIONS,
  TIMEZONE_OPTIONS,
  fromZonedInputs,
  resolveLandingAsset,
  toZonedInputs,
  webinarPublicUrl,
} from "../../../../lib/webinar";
import { useAuthStore } from "../../../../store/auth";

type HeadlineLine = { text: string; color: WebinarHeadlineColor };
type DiscussionPoint = { title: string; desc: string };

type FormState = {
  title: string;
  slug: string;
  kicker: string;
  description: string;
  headlineLines: HeadlineLine[];
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  timezoneLabel: string;
  platform: string;
  bannerUrl: string;
  discussionKicker: string;
  discussionTitle: string;
  discussionPoints: DiscussionPoint[];
  formTitle: string;
  formSubtitle: string;
  registerButtonLabel: string;
  occupationOptions: string[];
  zoomMeetingId: string;
  zoomEventType: "" | "meeting" | "webinar";
  zoomJoinUrl: string;
  published: boolean;
  featured: boolean;
  registrationOpen: boolean;
};

function emptyForm(): FormState {
  const inTwoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  return {
    title: "",
    slug: "",
    kicker: "Webinar",
    description: "",
    headlineLines: [],
    date: toZonedInputs(inTwoWeeks.toISOString(), "Africa/Lagos").date,
    startTime: "12:00",
    endTime: "14:00",
    timezone: "Africa/Lagos",
    timezoneLabel: "WAT",
    platform: "Zoom",
    bannerUrl: "",
    discussionKicker: "What we'll discuss",
    discussionTitle: "",
    discussionPoints: [{ title: "", desc: "" }],
    formTitle: "Reserve your spot",
    formSubtitle: "Register to receive your Zoom link and event reminders.",
    registerButtonLabel: "Register for free",
    occupationOptions: DEFAULT_OCCUPATIONS,
    zoomMeetingId: "",
    zoomEventType: "",
    zoomJoinUrl: "",
    published: false,
    featured: false,
    registrationOpen: true,
  };
}

function formFromEvent(e: WebinarEvent): FormState {
  const start = toZonedInputs(e.startsAt, e.timezone);
  const end = toZonedInputs(e.endsAt, e.timezone);
  return {
    title: e.title,
    slug: e.slug,
    kicker: e.kicker,
    description: e.description,
    headlineLines: e.headlineLines ?? [],
    date: start.date,
    startTime: start.time,
    endTime: end.time,
    timezone: e.timezone,
    timezoneLabel: e.timezoneLabel,
    platform: e.platform,
    bannerUrl: e.bannerUrl ?? "",
    discussionKicker: e.discussionKicker ?? "",
    discussionTitle: e.discussionTitle ?? "",
    discussionPoints: e.discussionPoints?.length ? e.discussionPoints : [{ title: "", desc: "" }],
    formTitle: e.formTitle ?? "",
    formSubtitle: e.formSubtitle ?? "",
    registerButtonLabel: e.registerButtonLabel ?? "",
    occupationOptions: e.occupationOptions ?? [],
    zoomMeetingId: e.zoomMeetingId ?? "",
    zoomEventType: e.zoomEventType ?? "",
    zoomJoinUrl: e.zoomJoinUrl ?? "",
    published: e.published,
    featured: e.featured,
    registrationOpen: e.registrationOpen,
  };
}

function scheduleFromForm(form: FormState) {
  const startsAt = fromZonedInputs(form.date, form.startTime, form.timezone);
  let endsAt = fromZonedInputs(form.date, form.endTime, form.timezone);
  if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) {
    // End time earlier than start → event runs past midnight.
    endsAt = new Date(new Date(endsAt).getTime() + 24 * 60 * 60 * 1000).toISOString();
  }
  return { startsAt, endsAt };
}

function toPayload(form: FormState): WebinarEventPayload | string {
  if (!form.title.trim()) return "Title is required.";
  if (!form.description.trim()) return "Description is required.";
  const { startsAt, endsAt } = scheduleFromForm(form);
  if (!startsAt || !endsAt) return "Please set a valid date, start time and end time.";
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    kicker: form.kicker.trim(),
    description: form.description.trim(),
    headlineLines: form.headlineLines.filter((l) => l.text.trim()),
    startsAt,
    endsAt,
    timezone: form.timezone,
    timezoneLabel: form.timezoneLabel.trim(),
    platform: form.platform.trim(),
    bannerUrl: form.bannerUrl.trim() || null,
    discussionKicker: form.discussionKicker.trim() || null,
    discussionTitle: form.discussionTitle.trim() || null,
    discussionPoints: form.discussionPoints.filter((p) => p.title.trim()),
    formTitle: form.formTitle.trim() || null,
    formSubtitle: form.formSubtitle.trim() || null,
    registerButtonLabel: form.registerButtonLabel.trim() || null,
    occupationOptions: form.occupationOptions,
    zoomMeetingId: form.zoomMeetingId.trim() || null,
    zoomEventType: form.zoomEventType || null,
    zoomJoinUrl: form.zoomJoinUrl.trim() || null,
    published: form.published,
    featured: form.featured,
    registrationOpen: form.registrationOpen,
  };
}

/** Rough split of a title into short sticker lines (≈ 2 words / 16 chars each). */
function linesFromTitle(title: string): HeadlineLine[] {
  const words = title.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if (current && (current + " " + w).length > 16) {
      lines.push(current);
      current = w;
    } else {
      current = current ? `${current} ${w}` : w;
    }
  }
  if (current) lines.push(current);
  return lines.map((text, i): HeadlineLine => ({
    text,
    color: i >= Math.floor(lines.length / 2) && i < lines.length - 1 ? "gold" : "ink",
  }));
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={700}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      ) : (
        <Box sx={{ mb: 2 }} />
      )}
      <Stack spacing={2}>{children}</Stack>
    </Paper>
  );
}

function moveItem<T>(list: T[], index: number, delta: number): T[] {
  const next = [...list];
  const target = index + delta;
  if (target < 0 || target >= next.length) return list;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function WebinarEditorPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = typeof params?.id === "string" ? params.id : "";
  const isNew = rawId === "new";
  const token = useAuthStore((s) => s.token);

  const { data: existing, isLoading, isError, error } = useWebinarEvent(isNew ? null : rawId);
  const createMutation = useCreateWebinarEvent();
  const updateMutation = useUpdateWebinarEvent();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const loadedId = useRef<string | null>(null);

  useEffect(() => {
    if (existing && loadedId.current !== existing.id) {
      loadedId.current = existing.id;
      setForm(formFromEvent(existing));
    }
  }, [existing]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const schedule = useMemo(() => scheduleFromForm(form), [form]);
  const previewData = {
    ...form,
    startsAt: schedule.startsAt,
    endsAt: schedule.endsAt,
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading(true);
    setFormError(null);
    try {
      const result = await uploadImage(file, { folder: "stillplay/events", token });
      set("bannerUrl", result.secureUrl || result.url);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = () => {
    setFormError(null);
    const payload = toPayload(form);
    if (typeof payload === "string") {
      setFormError(payload);
      return;
    }
    const onError = (err: unknown) =>
      setFormError(err instanceof Error ? err.message : "Save failed");
    if (isNew) {
      createMutation.mutate(payload, {
        onSuccess: (event) => {
          setSaved(true);
          router.replace(`/dashboard/events/${event.id}`);
        },
        onError,
      });
    } else {
      updateMutation.mutate(
        { id: rawId, payload },
        {
          onSuccess: (event) => {
            loadedId.current = event.id;
            setForm(formFromEvent(event));
            setSaved(true);
          },
          onError,
        }
      );
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  if (!isNew && isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!isNew && isError) {
    return (
      <Stack spacing={2} sx={{ py: 4 }}>
        <Alert severity="error">
          {error instanceof Error ? error.message : "Failed to load webinar"}
        </Alert>
        <Button component={Link} href="/dashboard/events" startIcon={<ArrowBackIcon />}>
          Back to events
        </Button>
      </Stack>
    );
  }

  const publicUrl = existing ? webinarPublicUrl(existing) : null;

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 3, mt: 1 }}
      >
        <Box>
          <Button
            component={Link}
            href="/dashboard/events"
            startIcon={<ArrowBackIcon />}
            sx={{ textTransform: "none", px: 0, color: "text.secondary" }}
          >
            Events
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {isNew ? "New webinar page" : "Edit webinar page"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Changes appear on the website as soon as you save.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {publicUrl && existing?.published ? (
            <Button
              component="a"
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={<OpenInNewIcon />}
              sx={{ textTransform: "none", borderColor: "#0b7b4c", color: "#0b7b4c" }}
            >
              View live page
            </Button>
          ) : null}
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || uploading}
            sx={{ textTransform: "none", bgcolor: "#0b7b4c", "&:hover": { bgcolor: "#0a6b3a" } }}
          >
            {saving ? "Saving…" : isNew ? "Create webinar" : "Save changes"}
          </Button>
        </Stack>
      </Stack>

      {formError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormError(null)}>
          {formError}
        </Alert>
      )}

      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} lg={7}>
          <Stack spacing={2.5}>
            <Section title="Visibility" subtitle="Control whether and where this webinar shows on the website.">
              <FormControlLabel
                control={
                  <Switch checked={form.published} onChange={(_, v) => set("published", v)} />
                }
                label="Published — page is visible on the website"
              />
              <FormControlLabel
                control={<Switch checked={form.featured} onChange={(_, v) => set("featured", v)} />}
                label="Featured — shown at /webinar and on the homepage banner (only one at a time)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.registrationOpen}
                    onChange={(_, v) => set("registrationOpen", v)}
                  />
                }
                label="Registration open"
              />
            </Section>

            <Section title="Basics">
              <TextField
                label="Title"
                required
                fullWidth
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                helperText="Used for the browser tab, calendar invites and social sharing"
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Kicker"
                  fullWidth
                  value={form.kicker}
                  onChange={(e) => set("kicker", e.target.value)}
                  helperText="Small label above the headline, e.g. WEBINAR"
                />
                <TextField
                  label="URL slug"
                  fullWidth
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value.toLowerCase())}
                  helperText={
                    isNew ? "Leave blank to generate from the title" : `/webinar/${form.slug || "…"}`
                  }
                />
              </Stack>
              <TextField
                label="Description"
                required
                fullWidth
                multiline
                minRows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Section>

            <Section
              title="Headline"
              subtitle="The big sticker-style text. Each row is one line; any “&” is automatically shown in green."
            >
              {form.headlineLines.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No custom lines — the title will be used.
                </Typography>
              ) : (
                form.headlineLines.map((line, i) => (
                  <Stack key={i} direction="row" spacing={1} alignItems="center">
                    <TextField
                      size="small"
                      label={`Line ${i + 1}`}
                      fullWidth
                      value={line.text}
                      inputProps={{ maxLength: 60 }}
                      onChange={(e) =>
                        set(
                          "headlineLines",
                          form.headlineLines.map((l, j) => (j === i ? { ...l, text: e.target.value } : l))
                        )
                      }
                    />
                    <Select
                      size="small"
                      value={line.color}
                      onChange={(e) =>
                        set(
                          "headlineLines",
                          form.headlineLines.map((l, j) =>
                            j === i ? { ...l, color: e.target.value as WebinarHeadlineColor } : l
                          )
                        )
                      }
                      sx={{ minWidth: 130 }}
                      renderValue={(v) => {
                        const opt = HEADLINE_COLOR_OPTIONS.find((o) => o.value === v);
                        return (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: opt?.hex }} />
                            <span>{opt?.label}</span>
                          </Stack>
                        );
                      }}
                    >
                      {HEADLINE_COLOR_OPTIONS.map((o) => (
                        <MenuItem key={o.value} value={o.value}>
                          <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: o.hex, mr: 1 }} />
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <IconButton
                      size="small"
                      aria-label="Move up"
                      disabled={i === 0}
                      onClick={() => set("headlineLines", moveItem(form.headlineLines, i, -1))}
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label="Move down"
                      disabled={i === form.headlineLines.length - 1}
                      onClick={() => set("headlineLines", moveItem(form.headlineLines, i, 1))}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label="Remove line"
                      onClick={() =>
                        set("headlineLines", form.headlineLines.filter((_, j) => j !== i))
                      }
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                ))
              )}
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  disabled={form.headlineLines.length >= 8}
                  onClick={() =>
                    set("headlineLines", [...form.headlineLines, { text: "", color: "ink" }])
                  }
                  sx={{ textTransform: "none" }}
                >
                  Add line
                </Button>
                <Button
                  size="small"
                  disabled={!form.title.trim()}
                  onClick={() => set("headlineLines", linesFromTitle(form.title))}
                  sx={{ textTransform: "none" }}
                >
                  Split title into lines
                </Button>
              </Stack>
            </Section>

            <Section title="Date & time" subtitle="Enter the time as it is in the selected timezone.">
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                />
                <TextField
                  label="Starts"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={form.startTime}
                  onChange={(e) => set("startTime", e.target.value)}
                />
                <TextField
                  label="Ends"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={form.endTime}
                  onChange={(e) => set("endTime", e.target.value)}
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="webinar-tz-label">Timezone</InputLabel>
                  <Select
                    labelId="webinar-tz-label"
                    label="Timezone"
                    value={form.timezone}
                    onChange={(e) => {
                      const tz = e.target.value;
                      const opt = TIMEZONE_OPTIONS.find((o) => o.value === tz);
                      setForm((f) => ({
                        ...f,
                        timezone: tz,
                        timezoneLabel: opt?.short ?? f.timezoneLabel,
                      }));
                    }}
                  >
                    {TIMEZONE_OPTIONS.map((o) => (
                      <MenuItem key={o.value} value={o.value}>
                        {o.label}
                      </MenuItem>
                    ))}
                    {!TIMEZONE_OPTIONS.some((o) => o.value === form.timezone) && (
                      <MenuItem value={form.timezone}>{form.timezone}</MenuItem>
                    )}
                  </Select>
                </FormControl>
                <TextField
                  label="Timezone label"
                  fullWidth
                  value={form.timezoneLabel}
                  onChange={(e) => set("timezoneLabel", e.target.value)}
                  helperText="Shown next to the time, e.g. WAT"
                />
                <TextField
                  label="Platform"
                  fullWidth
                  value={form.platform}
                  onChange={(e) => set("platform", e.target.value)}
                />
              </Stack>
            </Section>

            <Section
              title="Banner image"
              subtitle="Shown as the homepage banner and when the link is shared on social media. Wide images (3:1) work best."
            >
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleUpload} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    width: { xs: "100%", sm: 240 },
                    height: 90,
                    borderRadius: 1.5,
                    overflow: "hidden",
                    bgcolor: "#f4f6f5",
                    border: "1px solid #e5e5e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {form.bannerUrl ? (
                    <Box
                      component="img"
                      src={resolveLandingAsset(form.bannerUrl)}
                      alt="Banner preview"
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <ImageOutlinedIcon sx={{ color: "#bbb" }} />
                  )}
                </Box>
                <Stack spacing={1} sx={{ flex: 1, width: "100%" }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      startIcon={uploading ? <CircularProgress size={16} /> : <ImageOutlinedIcon />}
                      disabled={uploading}
                      onClick={() => fileRef.current?.click()}
                      sx={{ textTransform: "none", borderColor: "#0b7b4c", color: "#0b7b4c" }}
                    >
                      {uploading ? "Uploading…" : "Upload banner"}
                    </Button>
                    {form.bannerUrl ? (
                      <Button
                        color="inherit"
                        onClick={() => set("bannerUrl", "")}
                        sx={{ textTransform: "none" }}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </Stack>
                  <TextField
                    size="small"
                    label="Or paste image URL"
                    fullWidth
                    value={form.bannerUrl}
                    onChange={(e) => set("bannerUrl", e.target.value)}
                  />
                </Stack>
              </Stack>
            </Section>

            <Section title="Discussion section">
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Section label"
                  fullWidth
                  value={form.discussionKicker}
                  onChange={(e) => set("discussionKicker", e.target.value)}
                />
                <TextField
                  label="Section heading"
                  fullWidth
                  value={form.discussionTitle}
                  onChange={(e) => set("discussionTitle", e.target.value)}
                />
              </Stack>
              {form.discussionPoints.map((point, i) => (
                <Stack
                  key={i}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ sm: "flex-start" }}
                >
                  <TextField
                    size="small"
                    label={`Point ${i + 1} title`}
                    value={point.title}
                    inputProps={{ maxLength: 80 }}
                    onChange={(e) =>
                      set(
                        "discussionPoints",
                        form.discussionPoints.map((p, j) => (j === i ? { ...p, title: e.target.value } : p))
                      )
                    }
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    size="small"
                    label="Description"
                    value={point.desc}
                    multiline
                    inputProps={{ maxLength: 300 }}
                    onChange={(e) =>
                      set(
                        "discussionPoints",
                        form.discussionPoints.map((p, j) => (j === i ? { ...p, desc: e.target.value } : p))
                      )
                    }
                    sx={{ flex: 2 }}
                  />
                  <Stack direction="row">
                    <IconButton
                      size="small"
                      aria-label="Move up"
                      disabled={i === 0}
                      onClick={() => set("discussionPoints", moveItem(form.discussionPoints, i, -1))}
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label="Move down"
                      disabled={i === form.discussionPoints.length - 1}
                      onClick={() => set("discussionPoints", moveItem(form.discussionPoints, i, 1))}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label="Remove point"
                      onClick={() =>
                        set("discussionPoints", form.discussionPoints.filter((_, j) => j !== i))
                      }
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}
              <Box>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  disabled={form.discussionPoints.length >= 8}
                  onClick={() =>
                    set("discussionPoints", [...form.discussionPoints, { title: "", desc: "" }])
                  }
                  sx={{ textTransform: "none" }}
                >
                  Add point
                </Button>
              </Box>
            </Section>

            <Section
              title="Registration form"
              subtitle="Name, email and occupation are always collected."
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Form title"
                  fullWidth
                  value={form.formTitle}
                  onChange={(e) => set("formTitle", e.target.value)}
                />
                <TextField
                  label="Button label"
                  fullWidth
                  value={form.registerButtonLabel}
                  onChange={(e) => set("registerButtonLabel", e.target.value)}
                />
              </Stack>
              <TextField
                label="Form subtitle"
                fullWidth
                value={form.formSubtitle}
                onChange={(e) => set("formSubtitle", e.target.value)}
              />
              <Autocomplete
                multiple
                freeSolo
                options={DEFAULT_OCCUPATIONS.filter((o) => !form.occupationOptions.includes(o))}
                value={form.occupationOptions}
                onChange={(_, value) =>
                  set(
                    "occupationOptions",
                    value.map((v) => v.trim()).filter(Boolean)
                  )
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return <Chip key={key} size="small" label={option} {...tagProps} />;
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Occupation suggestions"
                    helperText="Type and press Enter to add. Registrants can still type their own."
                  />
                )}
              />
            </Section>

            <Section
              title="Zoom"
              subtitle="Optional. With Zoom API credentials set on the server, registrants are added to this meeting and get a personal join link. Otherwise the join link below is shown to everyone after registering."
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Meeting / webinar ID"
                  fullWidth
                  value={form.zoomMeetingId}
                  onChange={(e) => set("zoomMeetingId", e.target.value)}
                  placeholder="e.g. 812 3456 7890"
                />
                <FormControl fullWidth>
                  <InputLabel id="zoom-type-label">Zoom type</InputLabel>
                  <Select
                    labelId="zoom-type-label"
                    label="Zoom type"
                    value={form.zoomEventType}
                    onChange={(e) => set("zoomEventType", e.target.value as FormState["zoomEventType"])}
                  >
                    <MenuItem value="">Server default</MenuItem>
                    <MenuItem value="meeting">Meeting</MenuItem>
                    <MenuItem value="webinar">Webinar</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <TextField
                label="Shared join link"
                fullWidth
                value={form.zoomJoinUrl}
                onChange={(e) => set("zoomJoinUrl", e.target.value)}
                placeholder="https://us06web.zoom.us/j/…"
              />
            </Section>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Box sx={{ position: { lg: "sticky" }, top: { lg: 88 } }}>
            <Typography variant="overline" color="text.secondary">
              Live preview
            </Typography>
            <WebinarPreview data={previewData} />
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        message="Webinar saved"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
