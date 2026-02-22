"use client";

import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

import MobileFrame from "@/components/MobileFrame";

export default function NationalIdentityPage() {
  const router = useRouter();

  return (
    <MobileFrame>
      <Box className="screen-content" sx={{ pb: 6 }}>
        <Stack spacing={4} sx={{ height: "100%" }}>
          <Box sx={{ px: 3, pt: 3 }}>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                onClick={() => router.push("/signup/selfie")}
                sx={{ zIndex: 1 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  pointerEvents: "none",
                }}
              >
                Upload NIN Slip
              </Typography>
            </Box>
          </Box>
          <Box sx={{ height: 1, backgroundColor: "#E4E7EC" }} />

          <Stack spacing={3} alignItems="center" sx={{ px: 3 }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 320,
                borderRadius: 2,
                backgroundColor: "#F3F4F6",
                py: 6,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src="/assets/svg/sample.svg"
                alt="Sample ID"
                sx={{ width: "80%", height: "auto" }}
              />
            </Box>
            <Typography
              color="text.secondary"
              align="center"
              sx={{ maxWidth: 280 }}
            >
              Please take a clear and centered picture of you ID and make sure
              the whole ID is captured.
            </Typography>
          </Stack>

          <Box sx={{ px: 3, mt: "auto" }}>
            <Stack spacing={2}>
              <Button variant="contained" size="large" fullWidth>
                Take Photo
              </Button>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  backgroundColor: "#FFF4D9",
                  color: "#1D2939",
                  "&:hover": { backgroundColor: "#FFE8A8" },
                }}
              >
                From gallery
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </MobileFrame>
  );
}
