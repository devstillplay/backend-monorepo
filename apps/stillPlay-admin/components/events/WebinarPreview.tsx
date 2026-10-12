"use client";

import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import { Box, Stack, Typography } from "@mui/material";

import type { WebinarHeadlineColor } from "../../lib/api";
import { WEBINAR_COLORS as C, formatWebinarLabels, resolveLandingAsset } from "../../lib/webinar";

const DISPLAY_FONT = "Impact, 'Anton', 'Arial Narrow', sans-serif";
const MONO_FONT = "'Courier New', ui-monospace, Menlo, monospace";

export type WebinarPreviewData = {
  kicker: string;
  title: string;
  headlineLines: { text: string; color: WebinarHeadlineColor }[];
  description: string;
  startsAt: string | null;
  endsAt: string | null;
  timezone: string;
  timezoneLabel: string;
  platform: string;
  bannerUrl: string;
  discussionKicker: string;
  discussionTitle: string;
  discussionPoints: { title: string; desc: string }[];
  formTitle: string;
  formSubtitle: string;
  registerButtonLabel: string;
};

const sticker = (color: string) => ({
  color,
  WebkitTextStroke: "3px #fff",
  paintOrder: "stroke fill",
  textShadow: `3px 3px 0 ${C.charcoal}`,
});

function HeadlineLineText({ text, color }: { text: string; color: WebinarHeadlineColor }) {
  const parts = text.split(/(&)/);
  return (
    <Box component="span" sx={{ display: "block", ...sticker(C[color]) }}>
      {parts.map((p, i) =>
        p === "&" ? (
          <Box key={i} component="span" sx={sticker(C.green)}>
            &amp;
          </Box>
        ) : (
          p
        )
      )}
    </Box>
  );
}

export default function WebinarPreview({ data }: { data: WebinarPreviewData }) {
  const labels =
    data.startsAt && data.endsAt
      ? formatWebinarLabels({
          startsAt: data.startsAt,
          endsAt: data.endsAt,
          timezone: data.timezone,
          timezoneLabel: data.timezoneLabel,
        })
      : null;
  const lines = data.headlineLines.filter((l) => l.text.trim());
  const banner = resolveLandingAsset(data.bannerUrl);

  return (
    <Box
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid #e5e5e5",
        bgcolor: "#fff",
        fontSize: 14,
      }}
    >
      <Box
        sx={{
          p: 2.5,
          background: `linear-gradient(120deg, ${C.cream} 0%, #fbf8f3 45%, #ffffff 100%)`,
        }}
      >
        <Typography
          sx={{
            fontFamily: MONO_FONT,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: C.charcoal,
            fontSize: "0.95rem",
          }}
        >
          {data.kicker || "Webinar"}
        </Typography>
        <Typography
          component="div"
          sx={{
            fontFamily: DISPLAY_FONT,
            textTransform: "uppercase",
            lineHeight: 1,
            fontSize: "1.9rem",
            my: 1.5,
          }}
        >
          {lines.length ? (
            lines.map((l, i) => <HeadlineLineText key={i} text={l.text} color={l.color} />)
          ) : (
            <HeadlineLineText text={data.title || "Webinar title"} color="ink" />
          )}
        </Typography>
        <Typography sx={{ color: "#4a4a4a", fontSize: "0.8rem", lineHeight: 1.6 }}>
          {data.description || "Description…"}
        </Typography>

        <Stack direction="row" sx={{ mt: 2, alignItems: "stretch" }}>
          <Box
            sx={{
              bgcolor: C.zoomYellow,
              borderRadius: "10px 0 0 10px",
              px: 1.5,
              pr: 2.5,
              mr: -1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                bgcolor: C.zoomBlue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VideocamRoundedIcon sx={{ color: "#fff", fontSize: 18 }} />
            </Box>
            <Typography sx={{ color: C.zoomBlue, fontWeight: 700, fontSize: "0.75rem" }}>
              {(data.platform || "Zoom").toLowerCase()}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              bgcolor: C.green,
              borderRadius: "10px",
              border: "3px solid #fff",
              display: "flex",
              px: 1.5,
              py: 1,
              zIndex: 1,
            }}
          >
            <Box sx={{ pr: 1.5, borderRight: "2px solid rgba(255,255,255,0.7)" }}>
              <Typography sx={{ color: C.zoomYellow, fontWeight: 800, fontSize: "0.6rem" }}>
                DATE:
              </Typography>
              <Typography sx={{ fontFamily: DISPLAY_FONT, color: "#fff", fontSize: "1.3rem", lineHeight: 1 }}>
                {labels?.dateDay || "—"}
              </Typography>
              <Typography sx={{ fontFamily: DISPLAY_FONT, color: "#fff", fontSize: "0.75rem" }}>
                {labels?.dateMonthYear.toUpperCase()}
              </Typography>
            </Box>
            <Box sx={{ pl: 1.5 }}>
              <Typography sx={{ color: C.zoomYellow, fontWeight: 800, fontSize: "0.6rem" }}>
                TIME:
              </Typography>
              <Typography sx={{ fontFamily: DISPLAY_FONT, color: "#fff", fontSize: "1rem", lineHeight: 1.05 }}>
                {labels ? `${labels.startTime}–${labels.endTime}` : "—"}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.6rem" }}>
                {data.timezoneLabel}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Typography
          sx={{
            fontFamily: MONO_FONT,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: C.green,
            fontWeight: 700,
            fontSize: "0.7rem",
          }}
        >
          {data.discussionKicker || "What we'll discuss"}
        </Typography>
        <Typography sx={{ fontWeight: 800, color: C.ink, fontSize: "0.95rem", mb: 1.5 }}>
          {data.discussionTitle}
        </Typography>
        <Stack spacing={1}>
          {data.discussionPoints
            .filter((p) => p.title.trim())
            .map((p, i) => (
              <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 22,
                    height: 22,
                    borderRadius: 1,
                    bgcolor: i % 2 === 1 ? C.zoomYellow : C.green,
                    color: i % 2 === 1 ? C.ink : "#fff",
                    fontFamily: DISPLAY_FONT,
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.8rem" }}>{p.title}</Typography>
                  <Typography sx={{ color: "#5a5a5a", fontSize: "0.72rem" }}>{p.desc}</Typography>
                </Box>
              </Stack>
            ))}
        </Stack>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            border: "1px solid rgba(0,0,0,0.08)",
            borderTop: `4px solid ${C.green}`,
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: "0.9rem" }}>
            {data.formTitle || "Reserve your spot"}
          </Typography>
          <Typography sx={{ color: "#6b6b6b", fontSize: "0.72rem", mb: 1 }}>
            {data.formSubtitle}
          </Typography>
          {["Full name", "Email address", "Occupation"].map((label) => (
            <Box
              key={label}
              sx={{
                border: "1px solid #ddd",
                borderRadius: 1,
                px: 1,
                py: 0.6,
                mb: 0.75,
                color: "#999",
                fontSize: "0.72rem",
              }}
            >
              {label}
            </Box>
          ))}
          <Box
            sx={{
              bgcolor: C.zoomYellow,
              color: C.ink,
              fontWeight: 700,
              textAlign: "center",
              borderRadius: 1,
              py: 0.75,
              fontSize: "0.8rem",
            }}
          >
            {data.registerButtonLabel || "Register for free"}
          </Box>
        </Box>
      </Box>

      {banner ? (
        <Box sx={{ px: 2.5, pb: 2.5 }}>
          <Typography variant="caption" color="text.secondary">
            Homepage banner &amp; social share image
          </Typography>
          <Box
            component="img"
            src={banner}
            alt=""
            sx={{ width: "100%", borderRadius: 1.5, display: "block", mt: 0.5 }}
          />
        </Box>
      ) : null}
    </Box>
  );
}
