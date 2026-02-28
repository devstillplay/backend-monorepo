"use client";

import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import { useRouter } from "next/navigation";

export default function LoanSuccessPage() {
  const router = useRouter();

  return (
    <Box
      className="screen-content"
      sx={{ backgroundColor: "#FFFFFF", flex: 1 }}
    >
      <Stack sx={{ p: 3, flex: 1 }} spacing={4} alignItems="center">
        <Stack
          direction="row"
          alignItems="center"
          sx={{ alignSelf: "stretch" }}
        >
          <IconButton
            aria-label="Back"
            onClick={() => router.push("/dashboard")}
            sx={{ borderRadius: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Stack>

        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            backgroundColor: "#D9F8E2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "successPulse 1.6s ease-out",
            "@keyframes successPulse": {
              "0%": { transform: "scale(0.85)", opacity: 0.6 },
              "60%": { transform: "scale(1.05)", opacity: 1 },
              "100%": { transform: "scale(1)", opacity: 1 },
            },
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#2DAF63",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              animation: "successPop 420ms ease-out 120ms both",
              "@keyframes successPop": {
                "0%": { transform: "scale(0.6)" },
                "80%": { transform: "scale(1.05)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          >
            <CheckIcon sx={{ fontSize: 28 }} />
          </Box>
        </Box>

        <Stack spacing={0.5} alignItems="center">
          <Typography variant="h6" fontWeight={700} textAlign="center">
            Your loan will be approved shortly.
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Once approved, the amount will be credited to your wallet.
          </Typography>
        </Stack>

        <Box sx={{ mt: "auto", width: "100%" }}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              borderRadius: 999,
              py: 1.4,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Place a bet
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
