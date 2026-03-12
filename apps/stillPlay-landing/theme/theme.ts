import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0b7b4c", // green
    },
    secondary: {
      main: "#FFC107", // yellow-orange
    },
    background: {
      default: "#f4f6f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f1f1f",
      secondary: "#6b6b6b",
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 999,
          fontWeight: 600,
        },
      },
    },
  },
});
