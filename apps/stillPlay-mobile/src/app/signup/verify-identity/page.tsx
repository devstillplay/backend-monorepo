"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { startTransition, useCallback, useMemo, useRef, useState } from "react";

import AuthScreenShell from "@/components/AuthScreenShell";
import DojahWebSdkButton, {
  type DojahLauncherHandle,
} from "@/components/DojahWebSdkButton";
import { authCardWideSx, mergeSx } from "@/lib/desktopLayout";
import { getDojahWebSdkConfig } from "@/lib/dojahConfig";
import { useSignupStore } from "@/store/useSignupStore";

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <Stack direction="row" spacing={1}>
      {Array.from({ length: total }).map((_, i) => (
        <Box
          key={i}
          sx={{
            height: 4,
            flex: 1,
            borderRadius: 2,
            backgroundColor: i < current ? "primary.main" : "#E4E7EC",
            transition: "background-color 0.3s",
          }}
        />
      ))}
    </Stack>
  );
}

function extractReference(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const ref = o.reference_id ?? o.referenceId;
  return typeof ref === "string" && ref.length > 0 ? ref : null;
}

/** Dojah reference_id should be long enough for tracking (see Dojah docs). */
function buildReferenceId(email: string): string {
  const safe = email.replace(/[^a-zA-Z0-9@._-]/g, "").slice(0, 32);
  return `sp_${safe}_${Date.now()}_x`.replace(/@/g, "_at_");
}

export default function VerifyIdentityPage() {
  const router = useRouter();
  const firstName = useSignupStore((s) => s.firstName);
  const lastName = useSignupStore((s) => s.lastName);
  const nin = useSignupStore((s) => s.nin);
  const email = useSignupStore((s) => s.email);
  const setDojahResult = useSignupStore((s) => s.setDojahResult);

  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const dojahRef = useRef<DojahLauncherHandle>(null);

  const { widgetId, isReady } = useMemo(() => getDojahWebSdkConfig(), []);

  const userData = useMemo(
    () => ({
      first_name: firstName || undefined,
      last_name: lastName || undefined,
      email: email || undefined,
      residence_country: "NG",
    }),
    [firstName, lastName, email]
  );

  const govData = useMemo(
    () => ({
      nin: nin || "",
      bvn: "",
      dl: "",
      mobile: "",
    }),
    [nin]
  );

  const onSdkReady = useCallback(() => {
    setSdkReady(true);
  }, []);

  const onDojahSuccess = useCallback(
    (data: unknown) => {
      console.log("[Dojah] onSuccess response:", data);
      const ref = extractReference(data);
      setDojahResult(ref, true);
      // Defer client navigation out of Dojah’s global callback to avoid re-entrancy with
      // Next’s lazy chunk loader (can otherwise request `/_next/undefined` in dev).
      startTransition(() => {
        router.push("/signup/selfie");
      });
    },
    [router, setDojahResult]
  );

  const onDojahError = useCallback((message?: string) => {
    setError(message ?? "Verification could not be completed. Please try again.");
  }, []);

  const onDojahClose = useCallback(() => {
    setError(null);
  }, []);

  const startVerification = () => {
    setError(null);
    if (!firstName || !email || !nin) {
      router.replace("/signup/personal-details");
      return;
    }
    if (!isReady) {
      setError(
        "Dojah is not configured. Set NEXT_PUBLIC_DOJAH_WIDGET_ID (Easy Onboard widget id) in your environment."
      );
      return;
    }
    const referenceId = buildReferenceId(email || "signup");
    const metadata = {
      flow: "stillplay_signup",
      email: email || undefined,
      cache_bust: `${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
    };
    const opened = dojahRef.current?.open({ referenceId, metadata }) ?? false;
    if (!opened) {
      setError("Dojah is still loading. Wait a few seconds and try again.");
    }
  };

  return (
    <AuthScreenShell>
      <Paper elevation={0} sx={mergeSx(authCardWideSx, { overflow: "hidden" })}>
        <Stack spacing={0} sx={{ minHeight: "100%" }}>
          <Box sx={{ px: 3, pt: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <IconButton onClick={() => router.back()} size="small">
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" fontWeight={700}>
                Verify identity
              </Typography>
            </Stack>
            <StepIndicator current={2} total={4} />
          </Box>

          <Box sx={{ height: 1, backgroundColor: "#E4E7EC", mt: 2 }} />

          <Stack spacing={2.5} sx={{ px: 3, pt: 3, pb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: "#E8F5EF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <VerifiedUserIcon sx={{ color: "primary.main" }} />
              </Box>
              <Box>
                <Typography fontWeight={600}>Dojah KYC</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Use the button below to open Dojah (hidden Web SDK embed — each attempt uses a new
                  session). Confirm the result on your backend.
                </Typography>
              </Box>
            </Stack>

            {!isReady && (
              <Alert severity="warning">
                Set <strong>NEXT_PUBLIC_DOJAH_WIDGET_ID</strong> to your Easy Onboard widget id
                from{" "}
                <a href="https://app.dojah.io/easy-onboard" target="_blank" rel="noopener noreferrer">
                  app.dojah.io/easy-onboard
                </a>{" "}
                (the id string from the embed — not <code>null</code> or a placeholder). Restart{" "}
                <code>next dev</code> after changing <code>.env.local</code>.
              </Alert>
            )}

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={startVerification}
              disabled={!isReady || !sdkReady}
              sx={{
                borderRadius: 999,
                py: 1.4,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Start verification
            </Button>

            <DojahWebSdkButton
              ref={dojahRef}
              widgetId={widgetId}
              userData={userData}
              govData={govData}
              onSuccess={onDojahSuccess}
              onError={onDojahError}
              onClose={onDojahClose}
              onSdkReady={onSdkReady}
            />

            <Typography variant="caption" color="text.secondary" display="block">
              Web SDK:{" "}
              <a
                href="https://widget.dojah.io/websdk.js"
                target="_blank"
                rel="noopener noreferrer"
              >
                widget.dojah.io/websdk.js
              </a>
              . Overview:{" "}
              <a href="https://docs.dojah.io/overview/quickstart" target="_blank" rel="noopener noreferrer">
                Dojah quickstart
              </a>
              .
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </AuthScreenShell>
  );
}
