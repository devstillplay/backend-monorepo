"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
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
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useMemo, useState } from "react";

import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import type { EventRegistration, WebinarEvent } from "../../../lib/api";
import {
  useDeleteWebinarEvent,
  useEventRegistrations,
  useWebinarEvents,
} from "../../../lib/queries";
import {
  formatWebinarLabels,
  resolveLandingAsset,
  webinarPublicUrl,
} from "../../../lib/webinar";

function WebinarPagesSection({ onSelect }: { onSelect: (slug: string) => void }) {
  const { data: webinars = [], isLoading, isError, error } = useWebinarEvents();
  const deleteMutation = useDeleteWebinarEvent();
  const [deleteTarget, setDeleteTarget] = useState<WebinarEvent | null>(null);

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, mb: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Webinar pages
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Edit the content, date, banner and Zoom settings shown on the website.
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/dashboard/events/new"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 999,
            bgcolor: "#0b7b4c",
            "&:hover": { bgcolor: "#0a6b3a" },
          }}
        >
          New webinar
        </Button>
      </Stack>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      ) : isError ? (
        <Alert severity="error">
          {error instanceof Error ? error.message : "Failed to load webinars"}
        </Alert>
      ) : webinars.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          No webinars yet. Create one to publish a registration page.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {webinars.map((w) => {
            const labels = formatWebinarLabels(w);
            const ended = new Date(w.endsAt).getTime() < Date.now();
            return (
              <Box
                key={w.id}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 1.5,
                  bgcolor: "#fafafa",
                  borderRadius: 2,
                  border: "1px solid #eee",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { sm: "center" },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", sm: 150 },
                    height: { xs: 110, sm: 56 },
                    borderRadius: 1.5,
                    overflow: "hidden",
                    bgcolor: "#f4f6f5",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {w.bannerUrl ? (
                    <Box
                      component="img"
                      src={resolveLandingAsset(w.bannerUrl)}
                      alt=""
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <ImageOutlinedIcon sx={{ color: "#bbb" }} />
                  )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography fontWeight={700} noWrap>
                    {w.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {labels.dayLabel} · {labels.timeLabel}
                  </Typography>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
                    <Chip
                      size="small"
                      label={w.published ? "Published" : "Draft"}
                      sx={{
                        bgcolor: w.published ? "#e8f5ef" : "#f3f3f3",
                        color: w.published ? "#0b7b4c" : "#666",
                        fontWeight: 600,
                      }}
                    />
                    {w.featured && <Chip size="small" color="warning" label="Featured" />}
                    {ended ? (
                      <Chip size="small" variant="outlined" label="Ended" />
                    ) : !w.registrationOpen ? (
                      <Chip size="small" variant="outlined" label="Registration closed" />
                    ) : null}
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`${w.registrationCount ?? 0} registered`}
                      onClick={() => onSelect(w.slug)}
                    />
                  </Stack>
                </Box>
                <Stack direction="row" spacing={0.5} sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}>
                  <Tooltip title="Edit page">
                    <IconButton component={Link} href={`/dashboard/events/${w.id}`} aria-label="Edit page">
                      <EditOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  {w.published && (
                    <Tooltip title="View on website">
                      <IconButton
                        component="a"
                        href={webinarPublicUrl(w)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View on website"
                      >
                        <OpenInNewIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete">
                    <IconButton color="error" aria-label="Delete" onClick={() => setDeleteTarget(w)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}

      <Dialog open={!!deleteTarget} onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}>
        <DialogTitle>Delete webinar?</DialogTitle>
        <DialogContent>
          <Typography>
            Remove <strong>{deleteTarget?.title}</strong> and its{" "}
            <strong>{deleteTarget?.registrationCount ?? 0}</strong> registration
            {deleteTarget?.registrationCount === 1 ? "" : "s"}? Export the registrations first if you
            need them. This cannot be undone.
          </Typography>
          {deleteMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteMutation.error instanceof Error ? deleteMutation.error.message : "Delete failed"}
            </Alert>
          )}
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
            onClick={() =>
              deleteTarget &&
              deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
            }
            sx={{ textTransform: "none" }}
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

function formatWhen(iso: string, timeZone?: string) {
  try {
    return new Date(iso).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone,
    });
  } catch {
    return iso;
  }
}

function csvCell(value: string | null | undefined): string {
  const s = value ?? "";
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(rows: EventRegistration[], filename: string) {
  const header = ["Full name", "Email", "Occupation", "Zoom join link", "Registered at"];
  const lines = rows.map((r) =>
    [r.fullName, r.email, r.occupation, r.zoomJoinUrl, new Date(r.createdAt).toISOString()]
      .map(csvCell)
      .join(",")
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string>("");

  const { data, isLoading, isError, error, refetch, isFetching } = useEventRegistrations();
  const events = data?.events ?? [];
  const activeSlug = selectedSlug || events[0]?.slug || "";
  const activeEvent = events.find((e) => e.slug === activeSlug) ?? null;

  const forEvent = useMemo(
    () => (data?.registrations ?? []).filter((r) => r.eventSlug === activeSlug),
    [data?.registrations, activeSlug]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return forEvent;
    return forEvent.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.occupation.toLowerCase().includes(q)
    );
  }, [forEvent, search]);

  const zoomLinked = forEvent.filter((r) => r.zoomRegistrantId).length;

  const topOccupations = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of forEvent) {
      const key = r.occupation.trim();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [forEvent]);

  return (
    <Box>
      <DashboardHeader search={search} onSearchChange={setSearch} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          EVENTS
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage webinar pages and see who registered from the website.
        </Typography>
      </Box>

      <WebinarPagesSection onSelect={setSelectedSlug} />

      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
        Registrations
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color="error">
          {error instanceof Error ? error.message : "Failed to load registrations"}
        </Typography>
      ) : (
        <Stack spacing={2}>
          {events.length > 1 && (
            <FormControl size="small" sx={{ maxWidth: 420 }}>
              <InputLabel id="event-select-label">Event</InputLabel>
              <Select
                labelId="event-select-label"
                label="Event"
                value={activeSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
              >
                {events.map((ev) => (
                  <MenuItem key={ev.slug} value={ev.slug}>
                    {ev.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {activeEvent && (
            <Paper variant="outlined" sx={{ p: 2, borderLeft: "4px solid #0b7b4c" }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={2}
              >
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Webinar
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {activeEvent.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatWhen(activeEvent.startsAt, activeEvent.timezone)} –{" "}
                    {new Date(activeEvent.endsAt).toLocaleTimeString("en-NG", {
                      timeStyle: "short",
                      timeZone: activeEvent.timezone,
                    })}{" "}
                    ({activeEvent.timezone})
                  </Typography>
                </Box>
                <Stack direction="row" spacing={3}>
                  <Box>
                    <Typography variant="h5" fontWeight={800}>
                      {forEvent.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Registrations
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800}>
                      {zoomLinked}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Registered on Zoom
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
              {topOccupations.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                  {topOccupations.map(([occupation, count]) => (
                    <Chip
                      key={occupation}
                      size="small"
                      variant="outlined"
                      label={`${occupation} · ${count}`}
                    />
                  ))}
                </Stack>
              )}
            </Paper>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {filtered.length} registrant{filtered.length === 1 ? "" : "s"}
              {search.trim() && filtered.length !== forEvent.length
                ? ` (filtered from ${forEvent.length})`
                : ""}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                startIcon={<DownloadOutlinedIcon />}
                disabled={filtered.length === 0}
                onClick={() => downloadCsv(filtered, `${activeSlug || "event"}-registrations.csv`)}
              >
                Export CSV
              </Button>
              <Button
                size="small"
                startIcon={
                  isFetching ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />
                }
                onClick={() => refetch()}
                disabled={isFetching}
              >
                Refresh
              </Button>
            </Stack>
          </Box>

          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ overflowX: "auto", maxWidth: "100%" }}
          >
            <Table size="small" sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Occupation</TableCell>
                  <TableCell>Zoom</TableCell>
                  <TableCell align="right">Registered</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography color="text.secondary" sx={{ py: 2 }}>
                        {forEvent.length === 0
                          ? "No registrations yet."
                          : "No registrations match your search."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{row.fullName}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.occupation}</TableCell>
                      <TableCell>
                        {row.zoomRegistrantId ? (
                          <Chip size="small" color="success" label="Registered" />
                        ) : row.zoomJoinUrl ? (
                          <Chip size="small" variant="outlined" label="Shared link" />
                        ) : (
                          <Chip size="small" variant="outlined" label="No link" />
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {formatWhen(row.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}
    </Box>
  );
}
