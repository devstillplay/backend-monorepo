"use client";

import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import BadgeIcon from "@mui/icons-material/Badge";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useRouter } from "next/navigation";

import AuthScreenShell from "@/components/AuthScreenShell";
import { authCardWideSx, mergeSx } from "@/lib/desktopLayout";
import { useSignupStore } from "@/store/useSignupStore";

const steps = [
  {
    title: "Personal Details",
    description: "Your name, NIN, email, and password",
    icon: <PersonIcon />,
  },
  {
    title: "Identity verification (Dojah)",
    description: "Government ID and liveness via Dojah",
    icon: <VerifiedUserIcon />,
  },
  {
    title: "A selfie",
    description: "Optional photo for your profile",
    icon: <PhotoCameraIcon />,
  },
  {
    title: "NIN slip",
    description: "Optional upload, then create your account",
    icon: <BadgeIcon />,
  },
];

export default function SignupPage() {
  const router = useRouter();
  const firstName = useSignupStore((s) => s.firstName);
  const email = useSignupStore((s) => s.email);
  const nin = useSignupStore((s) => s.nin);
  const hasPersonalForDojah = Boolean(
    firstName?.trim() && email?.trim() && nin?.trim()
  );

  const goToDojahKyc = () => {
    if (hasPersonalForDojah) {
      router.push("/signup/verify-identity");
    } else {
      router.push("/signup/personal-details");
    }
  };

  return (
    <AuthScreenShell>
      <Paper elevation={0} sx={mergeSx(authCardWideSx, { overflow: "hidden" })}>
        <Stack spacing={3} sx={{ height: "100%", pb: 4 }}>
          <Box sx={{ px: 2, pt: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton onClick={() => router.back()}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" fontWeight={600}>
                Verify your Identity
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ height: 1, backgroundColor: "#E4E7EC" }} />

          <Box
            component="img"
            src="/assets/svg/verify.svg"
            alt="Verify identity"
            sx={{
              width: "60%",
              maxWidth: 260,
              alignSelf: "center",
              mt: 1
            }}
          />

          <Stack spacing={2} sx={{ px: 3 }}>
            {steps.map((step) => (
              <Box
                key={step.title}
                sx={{
                  backgroundColor: "#F8F9FB",
                  borderRadius: 3,
                  p: 2,
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)"
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      backgroundColor: "#FFF4D9",
                      color: "#F5B000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Stack spacing={0.4}>
                    <Typography fontWeight={600}>{step.title}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {step.description}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>

          <Stack spacing={1.5} sx={{ px: 3, mt: "auto" }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => router.push("/signup/personal-details")}
              sx={{ borderRadius: 999, py: 1.25, textTransform: "none", fontWeight: 700 }}
            >
              Continue
            </Button>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={goToDojahKyc}
              startIcon={<VerifiedUserIcon />}
              sx={{
                borderRadius: 999,
                py: 1.25,
                textTransform: "none",
                fontWeight: 700,
                borderColor: "#F5B000",
                color: "#1D2939",
                "&:hover": { borderColor: "#d49a00", bgcolor: "#FFF9E6" },
              }}
            >
              Validate KYC with Dojah
            </Button>
            <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
              {hasPersonalForDojah
                ? "Opens Dojah identity verification (ID + liveness)."
                : "Complete personal details first — we’ll send you there if needed."}
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </AuthScreenShell>
  );
}
