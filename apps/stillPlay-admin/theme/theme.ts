import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0b7b4c",
    },
    secondary: {
      main: "#ff9f1a",
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
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 18,
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
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          paddingTop: 14,
          paddingBottom: 14,
        },
      },
    },
  },
});
