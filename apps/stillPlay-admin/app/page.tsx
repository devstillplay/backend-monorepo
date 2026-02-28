"use client";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import AuthShell from "../components/AuthShell";
import { adminLogin } from "../lib/api";
import { recordActivity } from "../lib/queries";
import { useAuthStore } from "../store/auth";
import { useUserStore } from "../store/user";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";

  const status = useAuthStore((state) => state.status);
  const token = useAuthStore((state) => state.token);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // isMounted prevents React hydration mismatch (same pattern as mobile app).
  // Zustand reads localStorage synchronously, so auth state is ready by the
  // time this effect fires — no need for a setTimeout hack.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (status === "authenticated" && token) {
      router.replace("/dashboard");
    }
  }, [isMounted, status, token, router]);

  const mutation = useMutation({
    mutationFn: () => adminLogin({ email: email.trim(), password }),
    onSuccess: (data) => {
      setAuthenticated(data.token, data.user ?? null);
      if (data.user) {
        useUserStore.getState().setProfile({
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        });
      }
      recordActivity({ action: "Logged in" });
      router.replace("/dashboard");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <AuthShell>
      <Stack spacing={3} sx={{ width: "100%", alignItems: "stretch" }}>
        <Typography variant="h4" sx={{ color: "#4a4a4a", textAlign: "left" }}>
          Welcome to StillPlay.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <Stack spacing={2} sx={{ width: "100%" }}>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Email address
              </Typography>
              <TextField
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                fullWidth
                sx={{
                  "& input": { textAlign: "left" },
                  "& input::placeholder": { textAlign: "left" },
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
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Password
              </Typography>
              <TextField
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                required
                fullWidth
                InputProps={{
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
                }}
                sx={{
                  "& input": { textAlign: "left" },
                  "& input::placeholder": { textAlign: "left" },
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

            <Typography variant="body2" sx={{ textAlign: "right" }}>
              <Link
                href="/forgot-password"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Forgot Password?
              </Link>
            </Typography>

            {resetSuccess ? (
              <Alert severity="success">
                Password reset successfully. You can now log in.
              </Alert>
            ) : null}

            {mutation.isError ? (
              <Alert severity="error">
                {(mutation.error as Error).message}
              </Alert>
            ) : null}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={mutation.isPending}
              fullWidth
              sx={{ backgroundColor: "#0b7b4c" }}
            >
              {mutation.isPending ? "Logging in…" : "Log in"}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthShell>
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography color="text.secondary">Loading…</Typography>
          </Box>
        </AuthShell>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
