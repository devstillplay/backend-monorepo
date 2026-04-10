"use client";

import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import OTPInput from "react-otp-input";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import AuthScreenShell from "@/components/AuthScreenShell";
import { authCardNarrowSx, mergeSx } from "@/lib/desktopLayout";
import { requestRegisterCode, verifyCode } from "@/lib/api";
import useAuthStore from "@/store/useAuthStore";
import type { UserProfile } from "@/store/useAuthStore";
import { useSignupStore } from "@/store/useSignupStore";

const OTP_LENGTH = 4;

function OtpPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow") ?? "login";

  const {
    otpEmail,
    otpExpiresAt,
    status,
    fullName,
    setAuthenticated,
    setPendingOtp,
    reset: resetAuth,
  } = useAuthStore();

  const signupStore = useSignupStore();
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
      return;
    }
    if (status !== "otp_required") {
      router.replace("/login");
      return;
    }
    const interval = setInterval(() => {
      const remaining = Math.max(0, (otpExpiresAt ?? 0) - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0) {
        resetAuth();
        router.replace("/login");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [otpExpiresAt, resetAuth, router, status]);

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
            role: "user",
            firstName: fullName?.split(" ")[0],
            lastName: fullName?.split(" ").slice(1).join(" "),
          };
      setAuthenticated(data.token, user);
      router.replace("/dashboard");
    },
  });

  const handleResend = useCallback(async () => {
    if (flow === "register") {
      // Re-send the registration OTP using the stored signup data
      const { firstName, lastName, nin, email, password, picture, ninSlip } = signupStore;
      if (!email || !password) {
        // Signup data is gone (page was refreshed) — send user back to start
        router.replace("/signup/personal-details");
        return;
      }
      setResendState("sending");
      try {
        await requestRegisterCode({ firstName, lastName, nin, email, password, picture: picture ?? undefined, ninSlip: ninSlip ?? undefined });
        setPendingOtp(email, Date.now() + 10 * 60 * 1000, `${firstName} ${lastName}`);
        setResendState("sent");
        setTimeout(() => setResendState("idle"), 4000);
      } catch {
        setResendState("error");
        setTimeout(() => setResendState("idle"), 4000);
      }
    } else {
      router.push("/login");
    }
  }, [flow, router, signupStore, setPendingOtp]);

  const renderInput = useCallback(
    (inputProps: React.ComponentProps<"input">) => (
      <input
        {...inputProps}
        style={{
          width: 56,
          height: 56,
          textAlign: "center",
          fontSize: 20,
          fontWeight: 600,
          border: "2px solid #e0e0e0",
          borderRadius: 12,
          backgroundColor: "#f5f5f5",
          outline: "none",
          color: "#1a1a1a",
        }}
      />
    ),
    []
  );

  return (
    <AuthScreenShell
      contentSx={{
        justifyContent: "center",
        py: { xs: 3, md: 5 },
      }}
    >
      <Paper elevation={0} sx={authCardNarrowSx}>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          sx={{ p: { xs: 3, sm: 3.5, md: 4 } }}
        >
          <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              Enter your code
            </Typography>
            <Typography color="text.secondary">
              We&apos;ve sent a 4-digit code to{" "}
              <Box component="span" fontWeight={600} color="text.primary">
                {otpEmail}
              </Box>
            </Typography>
          </Stack>

          <Stack spacing={3} alignItems="center">
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={OTP_LENGTH}
              renderInput={renderInput}
              inputType="tel"
              shouldAutoFocus
              containerStyle={{ gap: 12, display: "flex" }}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Code expires in{" "}
                <Box component="span" fontWeight={600} color="primary.main">
                  {formattedTime}
                </Box>
              </Typography>
            </Stack>

            {mutation.isError ? (
              <Alert severity="error" sx={{ width: "100%" }}>
                {(mutation.error as Error).message}
              </Alert>
            ) : null}
          </Stack>

            <Stack spacing={2}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={mutation.isPending || otp.length !== OTP_LENGTH}
              >
                {mutation.isPending ? "Verifying..." : "Confirm"}
              </Button>

              <Button
                type="button"
                variant="text"
                size="large"
                fullWidth
                onClick={handleResend}
                disabled={resendState === "sending"}
                sx={{ color: "text.secondary" }}
              >
              {resendState === "sending"
                ? "Sending…"
                : resendState === "sent"
                  ? "Code sent ✓"
                  : resendState === "error"
                    ? "Failed — try again"
                    : "Didn't receive a code? Resend"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </AuthScreenShell>
  );
}

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <AuthScreenShell contentSx={{ justifyContent: "center" }}>
          <Paper elevation={0} sx={mergeSx(authCardNarrowSx, { py: 6, textAlign: "center" })}>
            <Typography color="text.secondary">Loading...</Typography>
          </Paper>
        </AuthScreenShell>
      }
    >
      <OtpPageContent />
    </Suspense>
  );
}
