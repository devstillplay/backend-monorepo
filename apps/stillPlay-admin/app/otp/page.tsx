"use client";

import {
  Alert,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import OTPInput from "react-otp-input";

import AuthShell from "../../components/AuthShell";
import { verifyCode } from "../../lib/api";
import { recordActivity } from "../../lib/queries";
import { useAuthStore } from "../../store/auth";
import { useUserStore } from "../../store/user";
import type { UserProfile } from "../../store/auth";

const OTP_LENGTH = 4;

export default function OtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow") ?? "login"; // login | register

  const {
    otpEmail,
    otpExpiresAt,
    status,
    setAuthenticated,
    reset: resetAuth,
    fullName,
  } = useAuthStore();
  const setProfile = useUserStore((s) => s.setProfile);
  const resetUser = useUserStore((s) => s.reset);

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
      return;
    }
    if (status !== "otp_required") {
      router.replace("/");
      return;
    }
    const interval = setInterval(() => {
      const remaining = Math.max(0, (otpExpiresAt ?? 0) - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0) {
        resetAuth();
        resetUser();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [otpExpiresAt, resetAuth, resetUser, router, status]);

  const formattedTime = useMemo(() => {
    const totalSeconds = Math.floor(timeLeft / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [timeLeft]);

  const mutation = useMutation({
    mutationFn: () =>
      verifyCode({
        type: flow === "register" ? "register" : "login",
        email: otpEmail ?? "",
        code: otp,
      }),
    onSuccess: (data) => {
      const user: UserProfile = data.user
        ? {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            picture: data.user.picture ?? null,
          }
        : {
            id: "",
            email: otpEmail ?? "",
            role: "admin",
            firstName: fullName?.split(" ")[0],
            lastName: fullName?.split(" ").slice(1).join(" "),
          };
      setAuthenticated(data.token, user);
      setProfile({ ...user });
      recordActivity({ action: "Logged in" });
      router.push("/dashboard");
    },
  });

  const handleResend = useCallback(() => {
    if (!otpEmail) return;
    router.push("/");
  }, [otpEmail, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!otpEmail || otp.length !== OTP_LENGTH) return;
    mutation.mutate();
  };

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
      <Stack spacing={3} sx={{ width: "100%", alignItems: "center" }}>
        <Box>
          <Typography variant="h4">OTP</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            We&apos;ve sent you a 4-digit code to your email.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="center">
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={OTP_LENGTH}
              renderInput={renderInput}
              inputType="number"
              shouldAutoFocus
              containerStyle={{ gap: 12 }}
            />

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Code expires in {formattedTime}
              </Typography>
              <Button variant="text" color="secondary" size="small" onClick={handleResend}>
                Send again
              </Button>
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
              disabled={mutation.isPending || otp.length !== OTP_LENGTH}
              sx={{ backgroundColor: "#0b7b4c" }}
            >
              {mutation.isPending ? "Verifying..." : "Confirm"}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </AuthShell>
  );
}
