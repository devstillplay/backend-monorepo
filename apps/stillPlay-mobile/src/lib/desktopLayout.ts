import type { SxProps, Theme } from "@mui/material";

/** Merges multiple `sx` values (MUI v7 `Paper` typings reject raw `[base, extra]` arrays). */
export function mergeSx(...parts: SxProps<Theme>[]): SxProps<Theme> {
  if (parts.length === 0) return {};
  if (parts.length === 1) return parts[0]!;
  return parts as unknown as SxProps<Theme>;
}

/** Main content column inside dashboard (beside sidebar). */
export const DESKTOP_MAIN_MAX_WIDTH = 1120;

/** Centered frosted panel — login, OTP, narrow flows. */
export const authCardNarrowSx: SxProps<Theme> = {
  width: "100%",
  maxWidth: 440,
  borderRadius: { xs: 3, md: 4 },
  bgcolor: "rgba(255,255,255,0.96)",
  backdropFilter: "blur(14px)",
  boxShadow: {
    xs: "0 8px 32px rgba(15, 23, 42, 0.15)",
    md: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
  },
  border: { md: "1px solid rgba(255,255,255,0.8)" },
};

/** Wider signup / verification steps. */
export const authCardWideSx: SxProps<Theme> = {
  width: "100%",
  maxWidth: { xs: "100%", sm: 560 },
  borderRadius: { xs: 3, md: 4 },
  bgcolor: "rgba(255,255,255,0.96)",
  backdropFilter: "blur(14px)",
  boxShadow: {
    xs: "0 8px 32px rgba(15, 23, 42, 0.15)",
    md: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
  },
  border: { md: "1px solid rgba(255,255,255,0.8)" },
};

/** Pending verification / medium content. */
export const authCardMediumSx: SxProps<Theme> = {
  width: "100%",
  maxWidth: { xs: "100%", sm: 480 },
  borderRadius: { xs: 3, md: 4 },
  bgcolor: "rgba(255,255,255,0.96)",
  backdropFilter: "blur(14px)",
  boxShadow: {
    xs: "0 8px 32px rgba(15, 23, 42, 0.15)",
    md: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
  },
  border: { md: "1px solid rgba(255,255,255,0.8)" },
};
