"use client";

import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

import { theme } from "../theme/theme";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: "100%",
          maxWidth: "100vw",
          minHeight: "100vh",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
}
