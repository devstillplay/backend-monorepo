"use client";

import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

import OneSignalProvider from "../components/OneSignalProvider";
import { theme } from "../theme/theme";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true,
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <OneSignalProvider>
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
        </OneSignalProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
