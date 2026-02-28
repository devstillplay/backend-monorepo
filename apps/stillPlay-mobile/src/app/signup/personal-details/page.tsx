"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

import MobileFrame from "@/components/MobileFrame";
import { useSignupStore } from "@/store/useSignupStore";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    "& fieldset": { borderColor: "#F5B000", borderWidth: 2 },
    "&:hover fieldset": { borderColor: "#F5B000" },
    "&.Mui-focused fieldset": { borderColor: "#F5B000" },
  },
};

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

export default function PersonalDetailsPage() {
  const router = useRouter();
  const { setPersonalDetails } = useSignupStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nin, setNin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    setError(null);
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!nin.trim() || nin.trim().length < 11) {
      setError("Please enter a valid 11-digit NIN.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setPersonalDetails({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nin: nin.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    router.push("/signup/selfie");
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
                Personal details
              </Typography>
            </Stack>
            <StepIndicator current={1} total={3} />
          </Box>

          <Box sx={{ height: 1, backgroundColor: "#E4E7EC", mt: 2 }} />

          {/* Form */}
          <Stack spacing={2.5} sx={{ px: 3, pt: 3, pb: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Fill in your personal information exactly as it appears on your ID.
            </Typography>

            <Stack direction="row" spacing={1.5}>
              <Stack spacing={0.5} flex={1}>
                <Typography variant="body2" fontWeight={600}>
                  First name
                </Typography>
                <TextField
                  placeholder="Amara"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                  size="small"
                  sx={fieldSx}
                />
              </Stack>
              <Stack spacing={0.5} flex={1}>
                <Typography variant="body2" fontWeight={600}>
                  Last name
                </Typography>
                <TextField
                  placeholder="Okonkwo"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                  size="small"
                  sx={fieldSx}
                />
              </Stack>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="body2" fontWeight={600}>
                NIN (National Identification Number)
              </Typography>
              <TextField
                placeholder="12345678901"
                value={nin}
                onChange={(e) => setNin(e.target.value.replace(/\D/g, "").slice(0, 11))}
                fullWidth
                size="small"
                inputProps={{ maxLength: 11, inputMode: "numeric" }}
                helperText={`${nin.length}/11 digits`}
                sx={fieldSx}
              />
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="body2" fontWeight={600}>
                Email address
              </Typography>
              <TextField
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                fullWidth
                size="small"
                sx={fieldSx}
              />
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="body2" fontWeight={600}>
                Password
              </Typography>
              <TextField
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword((p) => !p)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={fieldSx}
              />
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="body2" fontWeight={600}>
                Confirm password
              </Typography>
              <TextField
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirm ? "text" : "password"}
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowConfirm((p) => !p)}
                          edge="end"
                        >
                          {showConfirm ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={fieldSx}
              />
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleContinue}
              sx={{ mt: 1, borderRadius: 999, py: 1.4, fontWeight: 700, textTransform: "none" }}
            >
              Continue
            </Button>
          </Stack>
        </Stack>
      </Box>
    </MobileFrame>
  );
}
