"use client";

import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import AuthShell from "../../components/AuthShell";
import {
  requestPasswordReset,
  setStoredResetToken,
} from "../../lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: () => requestPasswordReset(email.trim()),
    onSuccess: (data) => {
      if (data.resetToken) {
        setStoredResetToken(data.resetToken);
      }
      router.push("/reset-password");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    mutation.mutate();
  };

  return (
    <AuthShell>
      <Stack spacing={3} sx={{ width: "100%", alignItems: "stretch" }}>
        <Typography variant="h4" sx={{ color: "#4a4a4a", textAlign: "left" }}>
          Forgot password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your email and we&apos;ll send you a 4-digit code to reset your password.
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
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                fullWidth
                sx={{
                  "& input": { textAlign: "left" },
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
            {mutation.isError ? (
              <Alert severity="error">{(mutation.error as Error).message}</Alert>
            ) : null}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={mutation.isPending}
              fullWidth
              sx={{ backgroundColor: "#0b7b4c" }}
            >
              {mutation.isPending ? "Sending..." : "Send reset code"}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ textAlign: "center" }}>
          <Link href="/" style={{ color: "inherit" }}>
            Back to login
          </Link>
        </Typography>
      </Stack>
    </AuthShell>
  );
}
