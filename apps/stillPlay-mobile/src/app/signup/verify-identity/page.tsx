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
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import AuthScreenShell from "@/components/AuthScreenShell";
import DojahWebSdkButton, {
  type DojahLauncherHandle,
  type DojahSdkLoadStatus,
} from "@/components/DojahWebSdkButton";
import { fetchDojahVerificationFromGateway } from "@/lib/api";
import { authCardWideSx, mergeSx } from "@/lib/desktopLayout";
import { postDeviceFingerprint } from "@/lib/deviceGuard";
import { dojahDebugLog, getDojahWebSdkConfig } from "@/lib/dojahConfig";
import { loadDojahReferenceForEmail, saveDojahReferenceForEmail } from "@/lib/dojahLocalCache";
import { extractDojahReference, summarizeDojahVerificationForUi } from "@/lib/dojahPayload";
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

/** Dojah reference_id should be long enough for tracking (see Dojah docs). */
function buildReferenceId(email: string): string {
  const safe = email.replace(/[^a-zA-Z0-9@._-]/g, "").slice(0, 32);
  return `sp_${safe}_${Date.now()}_x`.replace(/@/g, "_at_");
}

export default function VerifyIdentityPage() {
  const router = useRouter();
  const email = useSignupStore((s) => s.email);
  const setDojahResult = useSignupStore((s) => s.setDojahResult);

  const [error, setError] = useState<string | null>(null);
  const [sdkLoadStatus, setSdkLoadStatus] = useState<DojahSdkLoadStatus>("loading");
  const [sdkLoadMessage, setSdkLoadMessage] = useState<string | null>(null);
  const [deviceGuard, setDeviceGuard] = useState<Awaited<
    ReturnType<typeof postDeviceFingerprint>
  > | null>(null);
  const [cachedDojahRef, setCachedDojahRef] = useState<string | null>(null);
  const [restoredDojah, setRestoredDojah] = useState<unknown>(null);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const dojahRef = useRef<DojahLauncherHandle>(null);
  /** Same referenceId passed to `open()` — fallback if widget payload omits `reference_id`. */
  const lastOpenedReferenceRef = useRef<string | null>(null);

  const { widgetId, isReady } = useMemo(() => getDojahWebSdkConfig(), []);

  const onSdkStatus = useCallback((status: DojahSdkLoadStatus, message?: string) => {
    setSdkLoadStatus(status);
    setSdkLoadMessage(status === "error" ? (message ?? null) : null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fp = await postDeviceFingerprint({
        email: email || undefined,
        flow: "signup_verify_identity",
      });
      if (!cancelled) {
        setDeviceGuard(fp);
        dojahDebugLog("DeviceGuard fingerprint:", fp);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [email]);

  useEffect(() => {
    if (!email?.trim()) {
      setCachedDojahRef(null);
      return;
    }
    const ref = loadDojahReferenceForEmail(email);
    setCachedDojahRef(ref);
    dojahDebugLog("Cached Dojah reference for email:", ref ? `${ref.slice(0, 12)}…` : null);
  }, [email]);

  useEffect(() => {
    if (!cachedDojahRef) {
      setRestoredDojah(null);
      setRestoreError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      setRestoreLoading(true);
      setRestoreError(null);
      try {
        const { dojah } = await fetchDojahVerificationFromGateway(cachedDojahRef);
        if (!cancelled) {
          setRestoredDojah(dojah);
          dojahDebugLog("Restored Dojah verification from API:", dojah);
        }
      } catch (e) {
        if (!cancelled) {
          setRestoredDojah(null);
          setRestoreError(e instanceof Error ? e.message : "Could not load Dojah verification");
          dojahDebugLog("Restore from Dojah failed:", e);
        }
      } finally {
        if (!cancelled) setRestoreLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cachedDojahRef]);

  const continueWithRestoredKyc = useCallback(() => {
    if (!cachedDojahRef) return;
    setDojahResult(cachedDojahRef, true);
    window.setTimeout(() => {
      startTransition(() => {
        router.push("/signup/selfie");
      });
    }, 0);
  }, [cachedDojahRef, router, setDojahResult]);

  const onDojahSuccess = useCallback(
    (data: unknown) => {
      dojahDebugLog("onSuccess raw payload:", data);
      const ref = extractDojahReference(data);
      const sentRef = lastOpenedReferenceRef.current;
      dojahDebugLog("onSuccess extracted reference_id:", ref, "| client referenceId sent:", sentRef);
      const finalRef = ref ?? sentRef;
      if (!finalRef?.trim()) {
        setError(
          "Dojah reported success but no reference id was returned. Check the browser console (enable NEXT_PUBLIC_DEBUG_DOJAH=true), complete the flow again, or contact support with a screenshot of the last Dojah screen."
        );
        return;
      }
      if (email?.trim()) saveDojahReferenceForEmail(email, finalRef);
      setDojahResult(finalRef, true);
      setError(null);
      // Signup: KYC only advances the flow (selfie → register). It does not create a login session.
      // Defer navigation out of Dojah’s postMessage stack so Next/Zustand apply cleanly.
      window.setTimeout(() => {
        startTransition(() => {
          router.push("/signup/selfie");
        });
      }, 0);
    },
    [email, router, setDojahResult]
  );

  const onDojahError = useCallback((message?: string) => {
    dojahDebugLog("onError:", message);
    setError(message ?? "Verification could not be completed. Please try again.");
  }, []);

  const onDojahClose = useCallback(() => {
    dojahDebugLog("onClose (widget closed without success)");
    setError(
      "Verification was closed before completion. Tap Start verification again when you’re ready to continue."
    );
  }, []);

  const startVerification = () => {
    setError(null);
    if (!email?.trim()) {
      router.replace("/signup/personal-details");
      return;
    }
    if (!isReady) {
      setError(
        "Dojah is not configured. Set NEXT_PUBLIC_DOJAH_WIDGET_ID (or DOJAH_WIDGET_ID with our next.config fallback) to your Easy Onboard widget id, then restart `next dev`."
      );
      return;
    }
    if (sdkLoadStatus === "loading") {
      setError(
        "Dojah’s script is still loading. Wait a second and try again — if this persists, hard-refresh the page or check that widget.dojah.io is not blocked."
      );
      return;
    }
    if (sdkLoadStatus === "error") {
      setError(
        sdkLoadMessage ??
          "Dojah failed to load. Check your network, disable blockers for widget.dojah.io, and refresh the page."
      );
      return;
    }
    const referenceId = buildReferenceId(email || "signup");
    lastOpenedReferenceRef.current = referenceId;
    const metadata = {
      flow: "stillplay_signup",
      email: email || undefined,
      cache_bust: `${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
    };
    dojahDebugLog("open() params", {
      widgetId,
      referenceId,
      collectInWidget: true,
      metadata,
    });
    const opened = dojahRef.current?.open({ referenceId, metadata }) ?? false;
    if (!opened) {
      setError(
        "Could not open Dojah from this page (launcher not ready). Refresh and try again, or open the browser console for [Dojah] logs."
      );
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
                  You&apos;ll enter name, ID, and liveness in <strong>Dojah&apos;s own screens</strong>{" "}
                  (we don&apos;t send your signup form into the widget). After KYC, continue with
                  selfie and registration. KYC does <strong>not</strong> log you in — use{" "}
                  <strong>Login</strong> after you register.
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

            {sdkLoadStatus === "loading" && (
              <Alert severity="info">
                Loading Dojah script (widget.dojah.io)… You can tap <strong>Start verification</strong> once
                this finishes.
              </Alert>
            )}

            {sdkLoadStatus === "error" && sdkLoadMessage && (
              <Alert severity="error">
                <strong>Dojah script error:</strong> {sdkLoadMessage}
              </Alert>
            )}

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {deviceGuard && deviceGuard.isNewDevice === false && (
              <Alert severity="info">
                This device is already registered with your fingerprint provider (
                {deviceGuard.country ?? "unknown country"}, device{" "}
                {deviceGuard.deviceId ? `${deviceGuard.deviceId.slice(0, 8)}…` : "—"}). If you
                completed Dojah KYC on this browser before, your verification may appear below.
              </Alert>
            )}

            {cachedDojahRef && (
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#F8FAFC" }}>
                <Typography fontWeight={700} gutterBottom>
                  Saved verification (this browser)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Reference: <code>{cachedDojahRef}</code>
                </Typography>
                {restoreLoading && (
                  <Typography variant="body2" color="text.secondary">
                    Loading details from Dojah…
                  </Typography>
                )}
                {restoreError && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    {restoreError} — run <strong>Start verification</strong> again, or ensure the API
                    gateway has <code>DOJAH_APP_ID</code> and <code>DOJAH_SECRET_KEY</code>.
                  </Alert>
                )}
                {restoredDojah != null && !restoreLoading && (
                  <>
                    {(() => {
                      const lines = summarizeDojahVerificationForUi(restoredDojah);
                      return lines.length > 0 ? (
                        <Stack spacing={0.5} sx={{ mb: 1 }}>
                          {lines.map((line, i) => (
                            <Typography key={`${i}-${line.slice(0, 24)}`} variant="body2">
                              {line}
                            </Typography>
                          ))}
                        </Stack>
                      ) : null;
                    })()}
                    <Box
                      component="pre"
                      sx={{
                        m: 0,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: "#fff",
                        fontSize: "0.7rem",
                        maxHeight: 200,
                        overflow: "auto",
                        border: "1px solid #E4E7EC",
                      }}
                    >
                      {JSON.stringify(restoredDojah, null, 2)}
                    </Box>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      sx={{ mt: 2, borderRadius: 999, textTransform: "none", fontWeight: 700 }}
                      onClick={continueWithRestoredKyc}
                    >
                      Continue with this verification
                    </Button>
                  </>
                )}
              </Paper>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={startVerification}
              disabled={!isReady}
              sx={{
                borderRadius: 999,
                py: 1.4,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Start verification
            </Button>

            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: -1 }}>
              Dojah SDK:{" "}
              {sdkLoadStatus === "loading"
                ? "loading…"
                : sdkLoadStatus === "ready"
                  ? "ready"
                  : "error — see message above"}
            </Typography>

            <DojahWebSdkButton
              ref={dojahRef}
              widgetId={widgetId}
              prefillFromParent={false}
              onSuccess={onDojahSuccess}
              onError={onDojahError}
              onClose={onDojahClose}
              onSdkStatus={onSdkStatus}
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
                quickstart
              </a>
              ,{" "}
              <a
                href="https://docs.dojah.io/sdks/javascript-library"
                target="_blank"
                rel="noopener noreferrer"
              >
                JS SDK (optional <code>user_data</code> / <code>gov_data</code>)
              </a>
              .
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </AuthScreenShell>
  );
}
