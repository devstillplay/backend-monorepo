"use client";

import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { ReactNode } from "react";

import MobileFrame from "@/components/MobileFrame";

type AuthScreenShellProps = {
  children: ReactNode;
  /** Merged onto the inner scroll area (e.g. `justifyContent: "center"` for login). */
  contentSx?: SxProps<Theme>;
};

/**
 * Full-viewport animated gradient + scrollable content area for auth / onboarding.
 * Children are typically a Paper using styles from `@/lib/desktopLayout`.
 */
export default function AuthScreenShell({ children, contentSx }: AuthScreenShellProps) {
  return (
    <MobileFrame>
      <Box
        sx={{
          flex: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
        }}
      >
        <Box
          className="splash-frame"
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
          aria-hidden
        >
          <Box className="splash-gradient" />
        </Box>
        <Box
          className="screen-content"
          sx={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            px: { xs: 2, sm: 3 },
            py: { xs: 2, md: 4 },
            minHeight: 0,
            overflow: "auto",
            width: "100%",
            ...contentSx,
          }}
        >
          {children}
        </Box>
      </Box>
    </MobileFrame>
  );
}
