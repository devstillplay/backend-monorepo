"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  isWebinarOver,
  toWebinarEvent,
  type WebinarEvent,
  type WebinarEventData,
} from "../lib/events";
import { getPublicApiBaseUrl } from "../lib/env";

export default function WebinarPromo() {
  const [event, setEvent] = useState<WebinarEvent | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${getPublicApiBaseUrl()}/events/featured`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { event?: WebinarEventData | null } | null) => {
        if (!cancelled && data?.event && !isWebinarOver(data.event)) {
          setEvent(toWebinarEvent(data.event, "/webinar"));
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!event) return null;

  return (
    <Box component="section" sx={{ pb: { xs: 6, md: 8 }, bgcolor: "#fff" }}>
      <Container maxWidth="lg">
        {event.bannerUrl ? (
          <Box
            component={Link}
            href={event.pagePath}
            aria-label={`${event.kicker}: ${event.title}`}
            sx={{
              display: "block",
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Box
              component="img"
              src={event.bannerUrl}
              alt={`${event.kicker}: ${event.title} — ${event.labels.dayLabel}, ${event.labels.timeLabel} on ${event.platform}`}
              sx={{ width: "100%", height: "auto", display: "block" }}
            />
          </Box>
        ) : (
          <Box
            component={Link}
            href={event.pagePath}
            sx={{
              display: "block",
              textDecoration: "none",
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              background: "linear-gradient(120deg, #f7f1e8 0%, #fbf8f3 45%, #ffffff 100%)",
              border: "1px solid rgba(201,162,39,0.25)",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Courier New', ui-monospace, monospace",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#3a3a3a",
              }}
            >
              {event.kicker}
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: "#2b2b2b", mt: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              {event.title}
            </Typography>
          </Box>
        )}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Typography variant="body2" sx={{ color: "#4a4a4a" }}>
            Free {event.kicker.toLowerCase()} on {event.platform} · {event.labels.dayLabel} ·{" "}
            {event.labels.timeLabel}
          </Typography>
          {event.registrationOpen && (
            <Button
              component={Link}
              href={`${event.pagePath}#register`}
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                bgcolor: "#0b7b4c",
                borderRadius: 2,
                px: 3,
                "&:hover": { bgcolor: "#08603b" },
              }}
            >
              {event.registerButtonLabel || "Register now"}
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
