"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import MobileFrame from "@/components/MobileFrame";
import { registerUser, uploadImage } from "@/lib/api";
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

export default function NationalIdentityPage() {
  const router = useRouter();

  const { firstName, lastName, nin, email, password, picture, setNinSlip, reset: resetSignup } =
    useSignupStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [registered, setRegistered] = useState(false);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      // Upload NIN slip if provided (non-blocking — skip on failure)
      let ninSlipUrl: string | null = null;
      if (selectedFile) {
        try {
          const result = await uploadImage(selectedFile, { folder: "nin-slips" });
          ninSlipUrl = result.secureUrl ?? result.url;
          setNinSlip(ninSlipUrl);
        } catch {
          // Non-fatal — register without ninSlip
        }
      }

      return registerUser({
        firstName,
        lastName,
        nin,
        email,
        password,
        picture: picture ?? undefined,
        ninSlip: ninSlipUrl ?? undefined,
      });
    },
    onSuccess: () => {
      resetSignup(); // clear sensitive data from memory
      setRegistered(true);
    },
  });

  const canSubmit = !!firstName && !!lastName && !!nin && !!email && !!password;

  // ── Success screen ─────────────────────────────────────────────────────────
  if (registered) {
    return (
      <MobileFrame>
        <Box className="screen-content" sx={{ overflow: "auto" }}>
          <Stack
            spacing={3}
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: "100%", px: 4, textAlign: "center" }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#E8F5EF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HowToRegIcon sx={{ fontSize: 44, color: "primary.main" }} />
            </Box>
            <Stack spacing={1}>
              <Typography variant="h5" fontWeight={800}>
                Registration complete!
              </Typography>
              <Typography color="text.secondary">
                Your account has been created. An admin will review and
                activate it — you&apos;ll be able to log in once verified.
              </Typography>
            </Stack>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => router.replace("/login")}
              sx={{ borderRadius: 999, py: 1.4, textTransform: "none", fontWeight: 700 }}
            >
              Go to login
            </Button>
          </Stack>
        </Box>
      </MobileFrame>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <MobileFrame>
      <Box className="screen-content" sx={{ overflow: "auto" }}>
        <Stack spacing={0} sx={{ minHeight: "100%" }}>
          {/* Header */}
          <Box sx={{ px: 3, pt: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <IconButton onClick={() => router.back()} size="small">
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" fontWeight={700}>
                Upload NIN slip
              </Typography>
            </Stack>
            <StepIndicator current={3} total={3} />
          </Box>

          <Box sx={{ height: 1, backgroundColor: "#E4E7EC", mt: 2 }} />

          <Stack spacing={3} sx={{ px: 3, pt: 3, pb: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Optionally upload your NIN slip — you can add it later from your
              profile if you prefer.
            </Typography>

            {/* Preview / placeholder */}
            <Box
              sx={{
                width: "100%",
                borderRadius: 3,
                border: "2px dashed",
                borderColor: preview ? "primary.main" : "#F5B000",
                backgroundColor: preview ? "transparent" : "#FFFBF0",
                overflow: "hidden",
                minHeight: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <>
                  <Box
                    component="img"
                    src={preview}
                    alt="NIN slip preview"
                    sx={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "white",
                      borderRadius: "50%",
                      lineHeight: 0,
                      boxShadow: 1,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 22, color: "primary.main" }} />
                  </Box>
                </>
              ) : (
                <Stack alignItems="center" spacing={1} sx={{ py: 4 }}>
                  <PermIdentityIcon sx={{ fontSize: 56, color: "#D1B857" }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Tap to select NIN slip
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    JPG, PNG — max 5 MB
                  </Typography>
                </Stack>
              )}
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileSelected}
            />

            {preview && (
              <Button
                variant="outlined"
                size="medium"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  borderColor: "#F5B000",
                  color: "#1D2939",
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { borderColor: "#d49a00", backgroundColor: "#FFF9E6" },
                }}
              >
                Change image
              </Button>
            )}

            {!canSubmit && (
              <Alert severity="warning">
                Personal details are missing. Please go back and fill in your information.
              </Alert>
            )}

            {submitMutation.isError && (
              <Alert severity="error">
                {(submitMutation.error as Error).message}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={!canSubmit || submitMutation.isPending}
              onClick={() => submitMutation.mutate()}
              sx={{ borderRadius: 999, py: 1.4, textTransform: "none", fontWeight: 700 }}
            >
              {submitMutation.isPending ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={18} color="inherit" />
                  <span>Creating account…</span>
                </Stack>
              ) : (
                "Create account"
              )}
            </Button>

            {!preview && (
              <Typography variant="caption" color="text.secondary" textAlign="center">
                The NIN slip is optional. You can skip it and register now.
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>
    </MobileFrame>
  );
}
