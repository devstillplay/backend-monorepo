"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1d8a51"
    },
    secondary: {
      main: "#f4b400"
    }
  },
  shape: {
    borderRadius: 16
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif'
  }
});

export default function Providers({
  children
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
