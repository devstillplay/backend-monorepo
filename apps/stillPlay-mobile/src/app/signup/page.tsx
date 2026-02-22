"use client";

import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import BadgeIcon from "@mui/icons-material/Badge";
import { useRouter } from "next/navigation";

import MobileFrame from "@/components/MobileFrame";

const steps = [
  {
    title: "Personal Details",
    description: "Provide you full name, NIN & address",
    icon: <PersonIcon />
  },
  {
    title: "A selfie",
    description: "Provide you full name, DOB & address",
    icon: <PhotoCameraIcon />
  },
  {
    title: "NIN (National Identity Number)",
    description: "Provide you full name, DOB & address",
    icon: <BadgeIcon />
  }
];

export default function SignupPage() {
  const router = useRouter();

  return (
    <MobileFrame>
      <Box className="screen-content" sx={{ pb: 4 }}>
        <Stack spacing={3} sx={{ height: "100%" }}>
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

          <Box sx={{ px: 3, mt: "auto" }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => router.push("/signup/personal-details")}
            >
              Continue
            </Button>
          </Box>
        </Stack>
      </Box>
    </MobileFrame>
  );
}
