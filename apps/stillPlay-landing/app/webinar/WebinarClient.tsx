"use client";

import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import AppleIcon from "@mui/icons-material/Apple";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";
import { useState, type FormEvent, type MouseEvent } from "react";

import {
  downloadIcs,
  googleCalendarUrl,
  isWebinarOver,
  outlookCalendarUrl,
  registerForEvent,
  type EventRegistrationResult,
  type HeadlineColor,
  type WebinarEvent,
} from "../../lib/events";

const COLORS = {
  charcoal: "#3a3a3a",
  ink: "#2b2b2b",
  gold: "#C9A227",
  zoomYellow: "#F2B21B",
  green: "#0b7b4c",
  greenDark: "#08603b",
  zoomBlue: "#2D8CFF",
  cream: "#f7f1e8",
};

const DISPLAY_FONT = "var(--font-webinar-display), Impact, 'Arial Narrow', sans-serif";
const MONO_FONT = "'Courier New', ui-monospace, SFMono-Regular, Menlo, monospace";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HEADLINE_COLOR: Record<HeadlineColor, string> = {
  ink: COLORS.ink,
  gold: COLORS.gold,
  green: COLORS.green,
};

const stickerText = (color: string) => ({
  color,
  WebkitTextStroke: "6px #fff",
  paintOrder: "stroke fill",
  textShadow: `5px 5px 0 ${COLORS.charcoal}`,
});

function Headline({ event }: { event: WebinarEvent }) {
  const lines = event.headlineLines?.length
    ? event.headlineLines
    : [{ text: event.title, color: "ink" as const }];
  return (
    <Typography
      component="h1"
      sx={{
        fontFamily: DISPLAY_FONT,
        textTransform: "uppercase",
        lineHeight: 0.98,
        letterSpacing: "0.01em",
        fontSize: { xs: "2.6rem", sm: "3.4rem", md: "4.2rem" },
      }}
    >
      {lines.map((line, i) => (
        <Box
          key={i}
          component="span"
          sx={{ display: "block", ...stickerText(HEADLINE_COLOR[line.color] ?? COLORS.ink) }}
        >
          {line.text.split(/(&)/).map((part, j) =>
            part === "&" ? (
              <Box key={j} component="span" sx={stickerText(COLORS.green)}>
                &amp;
              </Box>
            ) : (
              part
            )
          )}
        </Box>
      ))}
    </Typography>
  );
}

function EventInfoCard({ event }: { event: WebinarEvent }) {
  const { labels } = event;
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        maxWidth: 460,
        mt: 2,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -16,
          left: 14,
          width: 36,
          height: 36,
          borderRadius: "50%",
          bgcolor: COLORS.green,
          border: "3px solid #fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <LocationOnIcon sx={{ color: "#fff", fontSize: 20 }} />
      </Box>
      <Box
        sx={{
          bgcolor: COLORS.zoomYellow,
          borderRadius: "16px 0 0 16px",
          pl: { xs: 2.5, sm: 3 },
          pr: { xs: 3.5, sm: 4.5 },
          py: 2.5,
          mr: -2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          minWidth: { xs: 108, sm: 130 },
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "12px",
            bgcolor: COLORS.zoomBlue,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <VideocamRoundedIcon sx={{ color: "#fff", fontSize: 28 }} />
        </Box>
        <Typography sx={{ color: COLORS.zoomBlue, fontWeight: 700, fontSize: "1.1rem" }}>
          {event.platform.toLowerCase()}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          bgcolor: COLORS.green,
          borderRadius: "16px",
          border: "4px solid #fff",
          boxShadow: "0 10px 30px rgba(11,123,76,0.18)",
          display: "flex",
          alignItems: "stretch",
          px: { xs: 2, sm: 2.5 },
          py: 2,
          zIndex: 1,
        }}
      >
        <Box sx={{ pr: { xs: 1.5, sm: 2 }, borderRight: "2px solid rgba(255,255,255,0.7)" }}>
          <Typography sx={{ color: COLORS.zoomYellow, fontWeight: 800, fontSize: "0.75rem" }}>
            DATE:
          </Typography>
          <Typography
            sx={{
              fontFamily: DISPLAY_FONT,
              color: "#fff",
              fontSize: { xs: "1.7rem", sm: "2.1rem" },
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {labels.dateDay}
          </Typography>
          <Typography
            sx={{
              fontFamily: DISPLAY_FONT,
              color: "#fff",
              fontSize: { xs: "0.95rem", sm: "1.1rem" },
              textTransform: "uppercase",
            }}
          >
            {labels.dateMonthYear}
          </Typography>
        </Box>
        <Box sx={{ pl: { xs: 1.5, sm: 2 } }}>
          <Typography sx={{ color: COLORS.zoomYellow, fontWeight: 800, fontSize: "0.75rem" }}>
            TIME:
          </Typography>
          <Typography
            sx={{
              fontFamily: DISPLAY_FONT,
              color: "#fff",
              fontSize: { xs: "1.3rem", sm: "1.6rem" },
              lineHeight: 1.05,
            }}
          >
            {labels.startTime}–
            <br />
            {labels.endTime}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.7rem", mt: 0.5 }}>
            {event.timezoneLabel}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function AddToCalendarButton({
  event,
  joinUrl,
  variant = "outlined",
  fullWidth,
}: {
  event: WebinarEvent;
  joinUrl?: string | null;
  variant?: "outlined" | "contained";
  fullWidth?: boolean;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const close = () => setAnchor(null);

  return (
    <>
      <Button
        variant={variant}
        size="large"
        fullWidth={fullWidth}
        startIcon={<CalendarMonthOutlinedIcon />}
        onClick={open}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 2,
          px: 3,
          py: 1.4,
          ...(variant === "outlined"
            ? {
                borderColor: COLORS.green,
                color: COLORS.green,
                bgcolor: "#fff",
                "&:hover": { borderColor: COLORS.greenDark, bgcolor: "rgba(11,123,76,0.04)" },
              }
            : {
                bgcolor: COLORS.green,
                color: "#fff",
                "&:hover": { bgcolor: COLORS.greenDark },
              }),
        }}
      >
        Add to calendar
      </Button>
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem
          component="a"
          href={googleCalendarUrl(event, joinUrl)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
        >
          <ListItemIcon>
            <GoogleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Google Calendar</ListItemText>
        </MenuItem>
        <MenuItem
          component="a"
          href={outlookCalendarUrl(event, joinUrl)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
        >
          <ListItemIcon>
            <MicrosoftIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Outlook</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            downloadIcs(event, joinUrl);
            close();
          }}
        >
          <ListItemIcon>
            <AppleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Apple / other (.ics)</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#fff",
    "&.Mui-focused fieldset": { borderColor: COLORS.green },
  },
  "& label.Mui-focused": { color: COLORS.green },
};

function RegistrationForm({
  event,
  onRegistered,
}: {
  event: WebinarEvent;
  onRegistered: (result: EventRegistrationResult) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nameError = touched && !fullName.trim();
  const emailError = touched && !EMAIL_RE.test(email.trim());
  const occupationError = touched && !occupation.trim();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError(null);
    if (!fullName.trim() || !EMAIL_RE.test(email.trim()) || !occupation.trim()) return;
    setSubmitting(true);
    try {
      const result = await registerForEvent(event.slug, {
        fullName: fullName.trim(),
        email: email.trim(),
        occupation: occupation.trim(),
      });
      onRegistered(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        <TextField
          label="Full name"
          placeholder="e.g. Ada Okafor"
          autoComplete="name"
          required
          fullWidth
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={nameError}
          helperText={nameError ? "Please enter your full name" : " "}
          inputProps={{ maxLength: 120 }}
          sx={fieldSx}
        />
        <TextField
          label="Email address"
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          helperText={
            emailError
              ? "Please enter a valid email address"
              : `We'll use this to send your ${event.platform} link`
          }
          sx={fieldSx}
        />
        <Autocomplete
          freeSolo
          options={event.occupationOptions}
          inputValue={occupation}
          onInputChange={(_, value) => setOccupation(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Occupation"
              placeholder="Select or type your occupation"
              required
              fullWidth
              error={occupationError}
              helperText={occupationError ? "Please tell us your occupation" : " "}
              inputProps={{ ...params.inputProps, maxLength: 120 }}
              sx={fieldSx}
            />
          )}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting}
          endIcon={submitting ? undefined : <ArrowForwardIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            fontSize: "1rem",
            borderRadius: 2,
            py: 1.6,
            bgcolor: COLORS.zoomYellow,
            color: COLORS.ink,
            boxShadow: "none",
            "&:hover": { bgcolor: "#e0a312", boxShadow: "none" },
          }}
        >
          {submitting ? (
            <CircularProgress size={22} sx={{ color: COLORS.ink }} />
          ) : (
            event.registerButtonLabel || "Register for free"
          )}
        </Button>
        <Typography variant="caption" sx={{ color: "#6b6b6b", textAlign: "center" }}>
          By registering you agree to receive event updates from Still Play. We never share your
          details.
        </Typography>
      </Stack>
    </Box>
  );
}

function RegistrationSuccess({
  event,
  result,
}: {
  event: WebinarEvent;
  result: EventRegistrationResult;
}) {
  const firstName = result.registration.fullName.split(/\s+/)[0];
  const joinUrl = result.registration.zoomJoinUrl;

  return (
    <Stack spacing={2.5} alignItems="center" textAlign="center">
      <CheckCircleIcon sx={{ fontSize: 56, color: COLORS.green }} />
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.ink }}>
          {result.alreadyRegistered ? "You're already registered" : "You're registered"}, {firstName}!
        </Typography>
        <Typography sx={{ color: "#4a4a4a", mt: 1 }}>
          {event.labels.dayLabel} · {event.labels.timeLabel}
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b6b6b", mt: 0.5 }}>
          Registered with <strong>{result.registration.email}</strong>
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: "100%" }}>
        {joinUrl ? (
          <Button
            component="a"
            href={joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            size="large"
            fullWidth
            startIcon={<VideocamRoundedIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              py: 1.4,
              bgcolor: COLORS.zoomBlue,
              "&:hover": { bgcolor: "#1f74db" },
            }}
          >
            Join on {event.platform}
          </Button>
        ) : null}
        <AddToCalendarButton
          event={event}
          joinUrl={joinUrl}
          variant={joinUrl ? "outlined" : "contained"}
          fullWidth
        />
      </Stack>

      {!joinUrl && (
        <Typography variant="body2" sx={{ color: "#6b6b6b" }}>
          Your {event.platform} link will be emailed to you before the event.
        </Typography>
      )}
    </Stack>
  );
}

function RegistrationClosed({ event }: { event: WebinarEvent }) {
  const over = isWebinarOver(event);
  return (
    <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ py: 2 }}>
      <EventOutlinedIcon sx={{ fontSize: 48, color: COLORS.gold }} />
      <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.ink }}>
        {over ? "This webinar has ended" : "Registration is closed"}
      </Typography>
      <Typography variant="body2" sx={{ color: "#6b6b6b" }}>
        {over
          ? "Thanks for your interest. Follow Still Play for upcoming events."
          : "We're no longer taking registrations for this webinar."}
      </Typography>
    </Stack>
  );
}

export default function WebinarClient({ event }: { event: WebinarEvent }) {
  const [result, setResult] = useState<EventRegistrationResult | null>(null);
  const canRegister = event.registrationOpen && !isWebinarOver(event);
  const points = event.discussionPoints ?? [];

  return (
    <Box sx={{ bgcolor: "#fff" }}>
      <Box
        component="section"
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 7, md: 11 },
          background: `linear-gradient(120deg, ${COLORS.cream} 0%, #fbf8f3 45%, #ffffff 100%)`,
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(40px)",
            pointerEvents: "none",
          },
          "&::before": {
            width: 420,
            height: 420,
            top: -160,
            left: -120,
            background: "radial-gradient(circle, rgba(214,170,90,0.35) 0%, rgba(214,170,90,0) 70%)",
          },
          "&::after": {
            width: 360,
            height: 360,
            bottom: -180,
            right: "20%",
            background: "radial-gradient(circle, rgba(201,162,39,0.18) 0%, rgba(201,162,39,0) 70%)",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={{ xs: 5, md: 6 }} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack
                spacing={3}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  sx={{
                    fontFamily: MONO_FONT,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                    color: COLORS.charcoal,
                  }}
                >
                  {event.kicker}
                </Typography>
                <Headline event={event} />
                <Typography
                  sx={{
                    color: "#4a4a4a",
                    maxWidth: 520,
                    fontSize: { xs: "1rem", md: "1.05rem" },
                    lineHeight: 1.7,
                    whiteSpace: "pre-line",
                  }}
                >
                  {event.description}
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  {canRegister && (
                    <Button
                      href="#register"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 4,
                        py: 1.4,
                        bgcolor: COLORS.zoomYellow,
                        color: COLORS.ink,
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#e0a312", boxShadow: "none" },
                      }}
                    >
                      {event.registerButtonLabel || "Register free"}
                    </Button>
                  )}
                  {!isWebinarOver(event) && (
                    <AddToCalendarButton event={event} joinUrl={result?.registration.zoomJoinUrl} />
                  )}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack
                spacing={3}
                alignItems={{ xs: "flex-start", md: "flex-end" }}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <Box
                  component="img"
                  src="/assets/svg/STILL PLAYLOGOBL.svg"
                  alt="Still Play"
                  sx={{ height: { xs: 32, md: 40 }, width: "auto", display: { xs: "none", md: "block" } }}
                />
                <EventInfoCard event={event} />
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="flex-start">
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  fontFamily: MONO_FONT,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: COLORS.green,
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {event.discussionKicker || "What we'll discuss"}
              </Typography>
              {event.discussionTitle ? (
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, color: COLORS.ink, mb: 4, fontSize: { xs: "1.6rem", md: "2rem" } }}
                >
                  {event.discussionTitle}
                </Typography>
              ) : (
                <Box sx={{ mb: 3 }} />
              )}
              <Stack spacing={2.5}>
                {points.map((point, i) => (
                  <Stack key={`${i}-${point.title}`} direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: i % 2 === 1 ? COLORS.zoomYellow : COLORS.green,
                        color: i % 2 === 1 ? COLORS.ink : "#fff",
                        fontFamily: DISPLAY_FONT,
                        fontSize: "1.2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {i + 1}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: COLORS.ink }}>{point.title}</Typography>
                      <Typography variant="body2" sx={{ color: "#5a5a5a", mt: 0.5 }}>
                        {point.desc}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>

              <Stack
                spacing={1.5}
                sx={{
                  mt: points.length ? 5 : 0,
                  p: 3,
                  borderRadius: 3,
                  bgcolor: COLORS.cream,
                  border: "1px solid rgba(201,162,39,0.25)",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <EventOutlinedIcon sx={{ color: COLORS.green }} />
                  <Typography sx={{ color: COLORS.ink, fontWeight: 600 }}>
                    {event.labels.dayLabel}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CalendarMonthOutlinedIcon sx={{ color: COLORS.green }} />
                  <Typography sx={{ color: COLORS.ink, fontWeight: 600 }}>
                    {event.labels.timeLabel}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <VideocamRoundedIcon sx={{ color: COLORS.zoomBlue }} />
                  <Typography sx={{ color: COLORS.ink, fontWeight: 600 }}>
                    Online via {event.platform} — free to attend
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                id="register"
                sx={{
                  scrollMarginTop: 96,
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  bgcolor: "#fff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
                  borderTop: `6px solid ${COLORS.green}`,
                }}
              >
                {result ? (
                  <RegistrationSuccess event={event} result={result} />
                ) : !canRegister ? (
                  <RegistrationClosed event={event} />
                ) : (
                  <>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.ink }}>
                      {event.formTitle || "Reserve your spot"}
                    </Typography>
                    {event.formSubtitle ? (
                      <Typography variant="body2" sx={{ color: "#6b6b6b", mt: 0.75, mb: 3 }}>
                        {event.formSubtitle}
                      </Typography>
                    ) : (
                      <Box sx={{ mb: 3 }} />
                    )}
                    <RegistrationForm event={event} onRegistered={setResult} />
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
