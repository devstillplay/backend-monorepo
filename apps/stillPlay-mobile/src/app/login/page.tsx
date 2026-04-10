"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
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

import AuthScreenShell from "@/components/AuthScreenShell";
import { authCardNarrowSx, mergeSx } from "@/lib/desktopLayout";
import useAuthStore from "@/store/useAuthStore";
import { login, decodeToken, isTokenExpired } from "@/lib/api";

const loginShellContentSx = {
  justifyContent: "center",
  py: { xs: 3, md: 5 },
};

/** Tighter corners than shared `authCardNarrowSx` (login only). */
const loginPaperRadiusSx = { borderRadius: { xs: 2, md: 2 } };

function LoginPageContent() {
  const router = useRouter();

  const status = useAuthStore((s) => s.status);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isValidSession =
    status === "authenticated" && !!token && !!user?.id && !isTokenExpired(token);

  useEffect(() => {
    if (!isMounted) return;
    if (isValidSession) {
      if (user?.verified === false) {
        router.replace("/pending-verification");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isMounted, isValidSession, user?.verified, router]);

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

  if (!isMounted || isValidSession) {
    return (
      <AuthScreenShell contentSx={loginShellContentSx}>
        <Paper
          elevation={0}
          sx={mergeSx(authCardNarrowSx, loginPaperRadiusSx, {
            py: 6,
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <CircularProgress color="primary" />
        </Paper>
      </AuthScreenShell>
    );
  }

  return (
    <AuthScreenShell contentSx={loginShellContentSx}>
      <Paper elevation={0} sx={mergeSx(authCardNarrowSx, loginPaperRadiusSx)}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: { xs: 3, sm: 3.5, md: 4 } }}
        >
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4" fontWeight={700} color="text.primary">
                Welcome back
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Your football space is waiting for you.
              </Typography>
            </Stack>

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
                  autoComplete="email"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(0,0,0,0.04)",
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
                  autoComplete="current-password"
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
                      backgroundColor: "rgba(0,0,0,0.04)",
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
                <Alert severity="error">{(mutation.error as Error).message}</Alert>
              ) : null}
            </Stack>

            <Stack spacing={2}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={mutation.isPending}
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
      </Paper>
    </AuthScreenShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthScreenShell contentSx={loginShellContentSx}>
          <Paper
            elevation={0}
            sx={mergeSx(authCardNarrowSx, loginPaperRadiusSx, {
              py: 6,
              px: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <Typography color="text.secondary">Loading...</Typography>
          </Paper>
        </AuthScreenShell>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
