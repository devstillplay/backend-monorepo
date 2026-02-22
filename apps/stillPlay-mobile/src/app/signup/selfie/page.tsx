"use client";

import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useRouter } from "next/navigation";

import MobileFrame from "@/components/MobileFrame";

const tips = [
  {
    icon: <LightbulbIcon />,
    text: "Ensure good lighting around you."
  },
  {
    icon: <EmojiEmotionsIcon />,
    text: "Look straight into the camera."
  }
];

export default function SelfiePage() {
  const router = useRouter();

  return (
    <MobileFrame>
      <Box className="screen-content" sx={{ pb: 6 }}>
        <Stack spacing={4} sx={{ height: "100%" }}>
          <Box sx={{ px: 3, pt: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton onClick={() => router.back()}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" fontWeight={600}>
                Take a selfie
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ height: 1, backgroundColor: "#E4E7EC" }} />

          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "2px solid #F5B000",
              backgroundColor: "#F3F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              mt: 1
            }}
          >
            <CameraAltIcon sx={{ fontSize: 48, color: "#B8B8B8" }} />
          </Box>

          <Stack spacing={3} sx={{ px: 6 }}>
            {tips.map((tip) => (
              <Stack key={tip.text} direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#FFF4D9",
                    color: "#F5B000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {tip.icon}
                </Box>
                <Typography color="text.secondary">{tip.text}</Typography>
              </Stack>
            ))}
          </Stack>

          <Box sx={{ px: 3, mt: "auto" }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => router.push("/signup/national-identity")}
            >
              Open Camera
            </Button>
          </Box>
        </Stack>
      </Box>
    </MobileFrame>
  );
}
