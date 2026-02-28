"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

import MobileFrame from "@/components/MobileFrame";
import useAuthStore from "@/store/useAuthStore";
import { login, decodeToken, isTokenExpired } from "@/lib/api";

function LoginPageContent() {
  const router = useRouter();

  const status = useAuthStore((s) => s.status);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // isMounted starts false on both server and client's first render, preventing
  // a React hydration mismatch. The auth check only runs after mount, at which
  // point Zustand has already fully synced from localStorage (sync storage).
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If a valid session is already in the store, skip the login page entirely.
  const isValidSession =
    status === "authenticated" && !!token && !!user?.id && !isTokenExpired(token);

  useEffect(() => {
    if (!isMounted) return;
    if (isValidSession) {
      // Verified users go to dashboard; unverified users wait for admin approval
      if (user?.verified === false) {
        router.replace("/pending-verification");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isMounted, isValidSession, user?.verified, router]);

  // All hooks must be declared before any conditional returns.
  const mutation = useMutation({
    mutationFn: () => login({ email: email.trim(), password }),
    onSuccess: (data) => {
      const decoded = decodeToken(data.token);
      const userProfile = decoded
        ? {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            verified: decoded.verified,
          }
        : null;
      setAuthenticated(data.token, userProfile);
      // Unverified users must wait for admin approval before accessing the dashboard
      if (userProfile?.verified === false) {
        router.replace("/pending-verification");
      } else {
        router.replace("/dashboard");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  // While checking auth (before mount) or mid-redirect, show a neutral spinner
  // so the user never sees a flash of the login form before being taken in.
  if (!isMounted || isValidSession) {
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

  return (
    <MobileFrame>
      <Box className="screen-content" sx={{ p: 3 }}>
        <Stack spacing={3} sx={{ height: "100%" }}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              Welcome back
            </Typography>
            <Typography color="text.secondary">
              Your football space is waiting for you.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight={600}>
                  Email address
                </Typography>
                <TextField
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f2f2f2",
                      borderRadius: 999,
                      "& fieldset": { border: "none" },
                      "&:hover fieldset": { border: "none" },
                      "&.Mui-focused fieldset": { border: "none" },
                    },
                  }}
                />
              </Stack>

              <Stack spacing={1}>
                <Typography variant="body2" fontWeight={600}>
                  Password
                </Typography>
                <TextField
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  required
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((p) => !p)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f2f2f2",
                      borderRadius: 999,
                      "& fieldset": { border: "none" },
                      "&:hover fieldset": { border: "none" },
                      "&.Mui-focused fieldset": { border: "none" },
                    },
                  }}
                />
              </Stack>

              <Typography
                component={Link}
                href="/forgot-password"
                sx={{
                  alignSelf: "flex-end",
                  color: "primary.main",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: "0.875rem",
                }}
              >
                Forgot password?
              </Typography>

              {mutation.isError ? (
                <Alert severity="error">
                  {(mutation.error as Error).message}
                </Alert>
              ) : null}
            </Stack>
          </Box>

          <Box flex={1} />

          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? "Logging in..." : "Log in to Still Play"}
            </Button>

            <Typography variant="body2" textAlign="center" color="text.secondary">
              Don&apos;t have an account?{" "}
              <Typography
                component={Link}
                href="/signup"
                variant="body2"
                sx={{ color: "primary.main", fontWeight: 600, textDecoration: "none" }}
              >
                Sign up
              </Typography>
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </MobileFrame>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <MobileFrame>
          <Box
            className="screen-content"
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Typography color="text.secondary">Loading...</Typography>
          </Box>
        </MobileFrame>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
