"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import MobileFrame from "@/components/MobileFrame";
import useAuthStore from "@/store/useAuthStore";
import { isTokenExpired } from "@/lib/api";

const steps = [
  "Identity documents submitted",
  "Admin review in progress",
  "Account activation",
];

export default function PendingVerificationPage() {
  const router = useRouter();
  const { status, token, user, reset } = useAuthStore();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Guard: if not authenticated at all, send to login
  useEffect(() => {
    if (!isMounted) return;
    if (status !== "authenticated" || !token || isTokenExpired(token)) {
      reset();
      router.replace("/login");
      return;
    }
    // If somehow they are now verified (e.g. token refreshed), push to dashboard
    if (user?.verified === true) {
      router.replace("/dashboard");
    }
  }, [isMounted, status, token, user?.verified, reset, router]);

  const handleLogout = () => {
    reset();
    router.replace("/login");
  };

  if (!isMounted) {
    return (
      <MobileFrame>
        <Box
          className="screen-content"
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <CircularProgress color="primary" />
        </Box>
      </MobileFrame>
    );
  }

  const displayName = user?.firstName
    ? `, ${user.firstName}`
    : "";

  return (
    <MobileFrame>
      <Box className="screen-content" sx={{ overflow: "auto" }}>
        <Stack
          spacing={4}
          alignItems="center"
          sx={{ px: 3, pt: 5, pb: 4, minHeight: "100%" }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              backgroundColor: "#FFF8E1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 12px #FFF3CD33",
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 52, color: "#F59E0B" }} />
          </Box>

          {/* Heading */}
          <Stack spacing={1} alignItems="center" textAlign="center">
            <Typography variant="h5" fontWeight={800}>
              Verification pending{displayName}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 320 }}>
              Your registration was received. An admin will review your
              details and activate your account shortly.
            </Typography>
          </Stack>

          {/* Progress steps */}
          <Box sx={{ width: "100%", maxWidth: 320 }}>
            {steps.map((step, i) => (
              <Stack
                key={step}
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: i < steps.length - 1 ? 0 : 0 }}
              >
                {/* Connector + dot */}
                <Stack alignItems="center" sx={{ width: 24 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor:
                        i === 0
                          ? "primary.main"
                          : i === 1
                            ? "#F59E0B"
                            : "#E4E7EC",
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  />
                  {i < steps.length - 1 && (
                    <Box
                      sx={{
                        width: 2,
                        height: 32,
                        backgroundColor: i === 0 ? "primary.main" : "#E4E7EC",
                        mt: "-2px",
                      }}
                    />
                  )}
                </Stack>
                <Typography
                  variant="body2"
                  fontWeight={i <= 1 ? 600 : 400}
                  color={i <= 1 ? "text.primary" : "text.secondary"}
                  sx={{ pb: i < steps.length - 1 ? 3 : 0 }}
                >
                  {step}
                </Typography>
              </Stack>
            ))}
          </Box>

          {/* Info card */}
          <Box
            sx={{
              width: "100%",
              maxWidth: 320,
              backgroundColor: "#F8F9FB",
              borderRadius: 3,
              p: 2.5,
              border: "1px solid #E4E7EC",
            }}
          >
            <Typography variant="body2" color="text.secondary" textAlign="center">
              You will receive an email once your account is activated. You
              can also try logging in again to check your status.
            </Typography>
          </Box>

          <Box flex={1} />

          {/* Actions */}
          <Stack spacing={1.5} sx={{ width: "100%" }}>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => router.replace("/login")}
              sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
            >
              Check status (log in again)
            </Button>
            <Button
              variant="text"
              size="large"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                color: "text.secondary",
              }}
            >
              Log out
            </Button>
          </Stack>
        </Stack>
      </Box>
    </MobileFrame>
  );
}
