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
import { Suspense, useCallback, useEffect, useState } from "react";
import OTPInput from "react-otp-input";

import AuthShell from "../../components/AuthShell";
import {
  clearStoredResetToken,
  getStoredResetToken,
  resetPassword,
} from "../../lib/api";

const OTP_LENGTH = 4;

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";

  const [resetToken, setResetToken] = useState<string | null>(null);
  const [email, setEmail] = useState(emailFromQuery);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setResetToken(getStoredResetToken());
  }, []);
  useEffect(() => {
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const mutation = useMutation({
    mutationFn: () => {
      const token = getStoredResetToken();
      return resetPassword({
        resetToken: token ?? undefined,
        email: token ? undefined : email.trim(),
        code,
        newPassword,
      });
    },
    onSuccess: () => {
      clearStoredResetToken();
      router.replace("/?reset=success");
    },
  });

  const hasIdentity =
    Boolean(getStoredResetToken()) || email.trim() !== "";
  const canSubmit =
    code.length === OTP_LENGTH &&
    newPassword.length >= 6 &&
    newPassword === confirmPassword &&
    hasIdentity;

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (newPassword !== confirmPassword) {
        mutation.reset();
        return;
      }
      if (newPassword.length < 6) return;
      if (code.length !== OTP_LENGTH) return;
      const token = getStoredResetToken();
      if (!token && !email.trim()) return;
      mutation.mutate();
    },
    [email, code, newPassword, confirmPassword]
  );

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const renderInput = useCallback(
    (inputProps: React.ComponentProps<"input">, index: number) => (
      <input
        {...inputProps}
        style={{
          width: 56,
          height: 56,
          textAlign: "center",
          fontSize: 20,
          fontWeight: 600,
          border: "none",
          borderRadius: 8,
          backgroundColor: "#f2f2f2",
          outline: "none",
        }}
      />
    ),
    []
  );

  return (
    <AuthShell>
      <Stack spacing={3} sx={{ width: "100%", alignItems: "stretch" }}>
        <Typography variant="h4" sx={{ color: "#4a4a4a", textAlign: "left" }}>
          Reset password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {resetToken
            ? "Enter the 4-digit code from your email and choose a new password."
            : "Enter your email, the code from your email, and a new password. Or request a new code from the forgot password page."}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {!resetToken && (
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Email
                </Typography>
                <TextField
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f2f2f2",
                      borderRadius: 2,
                      "& fieldset": { border: "none" },
                    },
                  }}
                />
              </Stack>
            )}
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Code
              </Typography>
              <OTPInput
                value={code}
                onChange={setCode}
                numInputs={OTP_LENGTH}
                renderInput={renderInput}
                inputType="number"
                containerStyle={{ gap: 8, justifyContent: "flex-start" }}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                New password
              </Typography>
              <TextField
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                required
                fullWidth
                error={newPassword.length > 0 && newPassword.length < 6}
                helperText={
                  newPassword.length > 0 && newPassword.length < 6
                    ? "At least 6 characters"
                    : undefined
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide" : "Show"}
                        onClick={() => setShowPassword((p) => !p)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f2f2f2",
                    borderRadius: 2,
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Confirm password
              </Typography>
              <TextField
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                required
                fullWidth
                error={passwordMismatch}
                helperText={passwordMismatch ? "Passwords do not match" : undefined}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f2f2f2",
                    borderRadius: 2,
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            </Stack>
            {mutation.isError ? (
              <Alert severity="error">
                {(mutation.error as Error).message}
              </Alert>
            ) : null}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={mutation.isPending || !canSubmit}
              fullWidth
              sx={{ backgroundColor: "#0b7b4c" }}
            >
              {mutation.isPending ? "Resetting..." : "Reset password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthShell>
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography color="text.secondary">Loading...</Typography>
          </Box>
        </AuthShell>
      }
    >
      <ResetPasswordPageContent />
    </Suspense>
  );
}
