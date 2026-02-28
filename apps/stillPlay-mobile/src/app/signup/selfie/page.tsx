"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CollectionsIcon from "@mui/icons-material/Collections";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import MobileFrame from "@/components/MobileFrame";
import { uploadImage } from "@/lib/api";
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

const tips = [
  "Ensure good lighting around you.",
  "Look straight into the camera.",
  "Remove sunglasses or hat.",
];

export default function SelfiePage() {
  const router = useRouter();
  const { setPicture, email } = useSignupStore();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = (file: File) => {
    setError(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
    e.target.value = "";
  };

  const handleContinue = async () => {
    setError(null);

    if (!selectedFile) {
      // Skip selfie — navigate without picture
      setPicture(null);
      router.push("/signup/national-identity");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadImage(selectedFile, { folder: "selfies" });
      setPicture(result.secureUrl ?? result.url);
      router.push("/signup/national-identity");
    } catch (err) {
      setError((err as Error).message ?? "Upload failed. You can skip and continue.");
    } finally {
      setUploading(false);
    }
  };

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
                Take a selfie
              </Typography>
            </Stack>
            <StepIndicator current={2} total={3} />
          </Box>

          <Box sx={{ height: 1, backgroundColor: "#E4E7EC", mt: 2 }} />

          <Stack spacing={3} sx={{ px: 3, pt: 3, pb: 4, alignItems: "center" }}>
            {/* Avatar preview */}
            <Box
              sx={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                border: "3px solid",
                borderColor: preview ? "primary.main" : "#F5B000",
                backgroundColor: preview ? "transparent" : "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {preview ? (
                <>
                  <Box
                    component="img"
                    src={preview}
                    alt="Selfie preview"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      bgcolor: "white",
                      borderRadius: "50%",
                      lineHeight: 0,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  </Box>
                </>
              ) : (
                <CameraAltIcon sx={{ fontSize: 52, color: "#B8B8B8" }} />
              )}
            </Box>

            {/* Tips */}
            <Box sx={{ width: "100%" }}>
              {tips.map((tip) => (
                <Stack
                  key={tip}
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#F5B000",
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {tip}
                  </Typography>
                </Stack>
              ))}
            </Box>

            {error && (
              <Alert severity="error" sx={{ width: "100%" }}>
                {error}
              </Alert>
            )}

            {/* Hidden file inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="user"
              style={{ display: "none" }}
              onChange={handleInputChange}
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleInputChange}
            />

            {/* Action buttons */}
            <Stack spacing={1.5} sx={{ width: "100%" }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<CameraAltIcon />}
                onClick={() => cameraInputRef.current?.click()}
                disabled={uploading}
                sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
              >
                Open camera
              </Button>

              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<CollectionsIcon />}
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploading}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "#F5B000",
                  color: "#1D2939",
                  "&:hover": { borderColor: "#d49a00", backgroundColor: "#FFF9E6" },
                }}
              >
                From gallery
              </Button>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleContinue}
                disabled={uploading}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  mt: 1,
                }}
              >
                {uploading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={18} color="inherit" />
                    <span>Uploading…</span>
                  </Stack>
                ) : preview ? (
                  "Continue"
                ) : (
                  "Skip for now"
                )}
              </Button>
            </Stack>

            {!preview && (
              <Typography variant="caption" color="text.secondary" textAlign="center">
                The selfie is optional but helps verify your identity faster.
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>
    </MobileFrame>
  );
}
