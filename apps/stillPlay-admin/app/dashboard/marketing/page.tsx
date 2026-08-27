"use client";

import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import type { AdminUser, MarketingRecipientPreview } from "../../../lib/api";
import {
  MARKETING_AUDIENCE_OPTIONS,
  MARKETING_TEMPLATES,
  buildMarketingHtml,
  type MarketingTemplateId,
} from "../../../lib/marketingTemplates";
import {
  useAdminUsers,
  useMarketingSendDetail,
  useMarketingSendHistory,
  usePreviewMarketingRecipients,
  useSendMarketingEmail,
} from "../../../lib/queries";

type AudienceId = (typeof MARKETING_AUDIENCE_OPTIONS)[number]["id"];

const SOURCE_LABELS: Record<string, string> = {
  customers: "Customer",
  admins: "Admin",
  waitlist: "Waitlist",
  financial_partners: "Financial partner",
  partner_inquiries: "Partner inquiry",
  custom: "Custom",
  individual: "Individual",
};

function formatRecipientSource(source: string): string {
  if (SOURCE_LABELS[source]) return SOURCE_LABELS[source];
  if (source.startsWith("survey:")) {
    const kind = source.slice("survey:".length);
    return `Survey (${kind})`;
  }
  return source;
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function statusChipColor(
  status: string
): "success" | "warning" | "error" | "default" {
  if (status === "sent") return "success";
  if (status === "partial") return "warning";
  if (status === "failed") return "error";
  return "default";
}

export default function MarketingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { data: users = [] } = useAdminUsers();
  const previewMutation = usePreviewMarketingRecipients();
  const sendMutation = useSendMarketingEmail();
  const { data: historyData, isLoading: historyLoading } =
    useMarketingSendHistory(50);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const { data: historyDetailData, isLoading: historyDetailLoading } =
    useMarketingSendDetail(selectedHistoryId);
  const [search, setSearch] = useState("");

  const historySends = useMemo(() => {
    const sends = historyData?.sends ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return sends;
    return sends.filter(
      (row) =>
        row.subject.toLowerCase().includes(q) ||
        (row.sentByEmail?.toLowerCase().includes(q) ?? false)
    );
  }, [historyData?.sends, search]);

  const [selectedAudiences, setSelectedAudiences] = useState<AudienceId[]>([]);
  const [customEmails, setCustomEmails] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<AdminUser[]>([]);
  const [templateId, setTemplateId] =
    useState<MarketingTemplateId>("announcement");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("https://still-play.com");
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [recipientList, setRecipientList] = useState<MarketingRecipientPreview[]>([]);
  const [recipientListMode, setRecipientListMode] = useState<"preview" | "sent" | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const individualEmails = useMemo(
    () => selectedUsers.map((u) => u.email).filter(Boolean),
    [selectedUsers]
  );

  const recipientPayload = useMemo(
    () => ({
      audiences: selectedAudiences,
      customEmails: customEmails
        ? [customEmails]
        : undefined,
      individualEmails:
        individualEmails.length > 0 ? individualEmails : undefined,
    }),
    [selectedAudiences, customEmails, individualEmails]
  );

  const previewHtml = useMemo(
    () =>
      buildMarketingHtml(templateId, {
        title: title || "Still Play",
        body: body || "Your message will appear here.",
        ctaText: ctaText.trim() || undefined,
        ctaUrl: ctaUrl.trim() || undefined,
      }),
    [templateId, title, body, ctaText, ctaUrl]
  );

  const toggleAudience = (id: AudienceId) => {
    setPreviewCount(null);
    setRecipientList([]);
    setRecipientListMode(null);
    setSelectedAudiences((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handlePreviewRecipients = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const result = await previewMutation.mutateAsync(recipientPayload);
      setPreviewCount(result.count);
      setRecipientList(result.recipients ?? []);
      setRecipientListMode("preview");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to preview recipients"
      );
    }
  };

  const handleSend = async () => {
    setConfirmOpen(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!subject.trim()) {
      setErrorMessage("Subject is required.");
      return;
    }
    try {
      const result = await sendMutation.mutateAsync({
        ...recipientPayload,
        subject: subject.trim(),
        html: previewHtml,
      });
      if (result.failed > 0) {
        setErrorMessage(
          `Some emails failed (${result.sent} sent, ${result.failed} failed). ${result.errors?.join(' ') ?? ''}`
        );
      } else {
        setSuccessMessage(
          `Sent to ${result.recipientCount} recipient(s). Delivered: ${result.sent}.`
        );
      }
      setRecipientList(result.recipients ?? []);
      setRecipientListMode("sent");
      setPreviewCount(result.recipientCount);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to send email"
      );
    }
  };

  const canSend =
    subject.trim().length > 0 &&
    body.trim().length > 0 &&
    (selectedAudiences.length > 0 ||
      customEmails.trim().length > 0 ||
      individualEmails.length > 0);

  return (
    <Box>
      <DashboardHeader search={search} onSearchChange={setSearch} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            MARKETING
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Send branded emails to customers, staff, waitlist, and survey
            respondents via Resend.
          </Typography>
        </Box>

        <Stack spacing={2}>
          {successMessage && (
            <Alert severity="success" onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" onClose={() => setErrorMessage(null)}>
              {errorMessage}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Recipients
                  </Typography>
                  <FormGroup>
                    {MARKETING_AUDIENCE_OPTIONS.map((opt) => (
                      <FormControlLabel
                        key={opt.id}
                        control={
                          <Checkbox
                            checked={selectedAudiences.includes(opt.id)}
                            onChange={() => toggleAudience(opt.id)}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2">{opt.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {opt.description}
                            </Typography>
                          </Box>
                        }
                      />
                    ))}
                  </FormGroup>

                  <Autocomplete
                    multiple
                    sx={{ mt: 2 }}
                    options={users}
                    value={selectedUsers}
                    onChange={(_, value) => {
                      setPreviewCount(null);
                      setRecipientList([]);
                      setRecipientListMode(null);
                      setSelectedUsers(value);
                    }}
                    getOptionLabel={(u) =>
                      `${u.firstName ?? ""} ${u.lastName ?? ""} (${u.email})`.trim()
                    }
                    isOptionEqualToValue={(a, b) => a.id === b.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Individual customers"
                        placeholder="Search by name or email"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.id}
                          label={option.email}
                          size="small"
                        />
                      ))
                    }
                  />

                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    sx={{ mt: 2 }}
                    label="Custom email addresses"
                    placeholder="one@example.com, two@example.com"
                    value={customEmails}
                    onChange={(e) => {
                      setPreviewCount(null);
                      setRecipientList([]);
                      setRecipientListMode(null);
                      setCustomEmails(e.target.value);
                    }}
                    helperText="Comma, space, or newline separated — for any typed addresses"
                  />

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      startIcon={
                        previewMutation.isPending ? (
                          <CircularProgress size={18} />
                        ) : (
                          <PreviewOutlinedIcon />
                        )
                      }
                      onClick={handlePreviewRecipients}
                      disabled={previewMutation.isPending}
                    >
                      Preview recipient count
                    </Button>
                    {previewCount !== null && (
                      <Chip
                        color="primary"
                        label={`${previewCount} recipient(s)`}
                        icon={<EmailOutlinedIcon />}
                      />
                    )}
                  </Stack>

                  {previewCount !== null && recipientListMode === "preview" && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Full recipient list shown below.
                      </Typography>
                    </Box>
                  )}
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Message
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="marketing-template-label">Template</InputLabel>
                    <Select
                      labelId="marketing-template-label"
                      label="Template"
                      value={templateId}
                      onChange={(e) =>
                        setTemplateId(e.target.value as MarketingTemplateId)
                      }
                    >
                      {MARKETING_TEMPLATES.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                          {t.name} — {t.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      required
                      label="Email subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Title (in email body)"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      required
                      multiline
                      minRows={5}
                      label="Body"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your message. Use blank lines for paragraphs."
                    />
                    <TextField
                      fullWidth
                      label="CTA button text (optional)"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="CTA link"
                      value={ctaUrl}
                      onChange={(e) => setCtaUrl(e.target.value)}
                    />
                  </Stack>

                  <Button
                    fullWidth={isMobile}
                    sx={{ mt: 2 }}
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={
                      sendMutation.isPending ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SendOutlinedIcon />
                      )
                    }
                    disabled={!canSend || sendMutation.isPending}
                    onClick={() => setConfirmOpen(true)}
                  >
                    Send email
                  </Button>
                </Paper>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  height: isMobile ? "auto" : "calc(100vh - 200px)",
                  minHeight: 400,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Email preview
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "#f3f4f6",
                  }}
                >
                  <iframe
                    title="Email preview"
                    srcDoc={previewHtml}
                    sandbox=""
                    style={{
                      width: "100%",
                      height: isMobile ? 420 : "100%",
                      border: "none",
                      minHeight: 400,
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {recipientList.length > 0 && (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  {recipientListMode === "sent"
                    ? "Emails sent to"
                    : "Recipient list"}
                </Typography>
                <Chip
                  size="small"
                  color={recipientListMode === "sent" ? "success" : "default"}
                  label={`${recipientList.length} recipient(s)`}
                />
              </Stack>
              <TableContainer sx={{ maxHeight: 420 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      {recipientListMode === "sent" && (
                        <TableCell>Status</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recipientList.map((row) => (
                      <TableRow key={row.email} hover>
                        <TableCell sx={{ fontFamily: "monospace", fontSize: 13 }}>
                          {row.email}
                        </TableCell>
                        <TableCell>{row.name ?? "—"}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            variant="outlined"
                            label={formatRecipientSource(row.source)}
                          />
                        </TableCell>
                        {recipientListMode === "sent" && (
                          <TableCell>
                            <Chip
                              size="small"
                              color={statusChipColor(row.status ?? "failed")}
                              label={row.status === "sent" ? "Sent" : "Failed"}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 2 }}
            >
              <HistoryOutlinedIcon fontSize="small" color="action" />
              <Typography variant="subtitle1" fontWeight={600}>
                Send history
              </Typography>
            </Stack>

            {historyLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={28} />
              </Box>
            ) : historySends.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No marketing emails sent yet.
              </Typography>
            ) : (
              <TableContainer sx={{ maxHeight: 360 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date & time</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Recipients</TableCell>
                      <TableCell>Delivered</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Sent by</TableCell>
                      <TableCell align="right">Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historySends.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        selected={selectedHistoryId === row.id}
                      >
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {formatDateTime(row.createdAt)}
                        </TableCell>
                        <TableCell>{row.subject}</TableCell>
                        <TableCell>{row.recipientCount}</TableCell>
                        <TableCell>
                          {row.sent}/{row.recipientCount}
                          {row.failed > 0 ? ` (${row.failed} failed)` : ""}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            color={statusChipColor(row.status)}
                            label={
                              row.status === "sent"
                                ? "Sent"
                                : row.status === "partial"
                                  ? "Partial"
                                  : "Failed"
                            }
                          />
                        </TableCell>
                        <TableCell>{row.sentByEmail ?? "—"}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              setSelectedHistoryId(
                                selectedHistoryId === row.id ? null : row.id
                              )
                            }
                          >
                            {selectedHistoryId === row.id ? "Hide" : "View"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {selectedHistoryId && (
              <Box sx={{ mt: 2 }}>
                {historyDetailLoading ? (
                  <CircularProgress size={24} />
                ) : historyDetailData?.send ? (
                  <>
                    <Typography variant="subtitle2" gutterBottom>
                      Recipients — {historyDetailData.send.subject}
                    </Typography>
                    <TableContainer sx={{ maxHeight: 320 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(historyDetailData.send.recipients ?? []).map(
                            (r: MarketingRecipientPreview) => (
                              <TableRow key={r.email} hover>
                                <TableCell
                                  sx={{ fontFamily: "monospace", fontSize: 13 }}
                                >
                                  {r.email}
                                </TableCell>
                                <TableCell>{r.name ?? "—"}</TableCell>
                                <TableCell>
                                  {formatRecipientSource(r.source)}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    size="small"
                                    color={statusChipColor(r.status ?? "failed")}
                                    label={
                                      r.status === "sent" ? "Sent" : "Failed"
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : null}
              </Box>
            )}
          </Paper>
        </Stack>
      </motion.div>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Confirm send</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            You are about to send &quot;{subject}&quot; to{" "}
            {previewCount !== null
              ? `${previewCount} recipient(s)`
              : "the selected audiences"}.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            This action cannot be undone. Make sure the preview looks correct.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={sendMutation.isPending}
          >
            Send now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
