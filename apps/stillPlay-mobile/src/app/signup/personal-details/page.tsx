"use client";

import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

import MobileFrame from "@/components/MobileFrame";

const fields = [
  { label: "Full name", name: "fullName" },
  { label: "NIN", name: "nin" },
  { label: "Email address", name: "email" },
  { label: "Password", name: "password", type: "password" }
];

export default function PersonalDetailsPage() {
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
                Enter personal details
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ height: 1, backgroundColor: "#E4E7EC" }} />

          <Stack spacing={4} sx={{ px: 3, mt: 2 }}>
            {fields.map((field) => (
              <TextField
                key={field.name}
                label={field.label}
                type={field.type ?? "text"}
                fullWidth
                placeholder="#34ASHWQA"
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                    "& fieldset": {
                      borderColor: "#F5B000",
                      borderWidth: 2
                    },
                    "&:hover fieldset": {
                      borderColor: "#F5B000"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#F5B000"
                    }
                  }
                }}
              />
            ))}
          </Stack>

          <Box sx={{ px: 3, mt: "auto" }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => router.push("/signup/selfie")}
            >
              Continue
            </Button>
          </Box>
        </Stack>
      </Box>
    </MobileFrame>
  );
}
