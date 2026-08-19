"use client";

import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

import OneSignalProvider from "../components/OneSignalProvider";
import { getQueryClient } from "../lib/queryClient";
import { theme } from "../theme/theme";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <OneSignalProvider>
          <Box
            sx={{
              width: "100%",
              maxWidth: "100vw",
              minHeight: "100dvh",
              overflowX: "hidden",
              boxSizing: "border-box",
            }}
          >
            {children}
          </Box>
        </OneSignalProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
