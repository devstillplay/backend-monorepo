"use client";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import AuthShell from "../../components/AuthShell";
import { requestCode } from "../../lib/api";
import { useAuthStore } from "../../store/auth";

const OTP_EXPIRY_MS = 10 * 60 * 1000;

export default function RegisterPage() {
  const router = useRouter();
  const setPendingOtp = useAuthStore((state) => state.setPendingOtp);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nin, setNin] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      requestCode({
        type: "register",
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        nin: nin.trim(),
      }),
    onSuccess: () => {
      const displayName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || email.split("@")[0];
      setPendingOtp(email.trim(), Date.now() + OTP_EXPIRY_MS, displayName);
      router.push("/otp?flow=register");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <AuthShell>
      <Stack spacing={3} sx={{ width: "100%", alignItems: "center" }}>
        <Typography variant="h4" sx={{ color: "#4a4a4a" }}>
          Create New Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <Stack spacing={2} sx={{ width: "100%" }}>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                First name
              </Typography>
              <TextField
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                fullWidth
                sx={inputSx}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Last name
              </Typography>
              <TextField
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                fullWidth
                sx={inputSx}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Email address
              </Typography>
              <TextField
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                fullWidth
                sx={inputSx}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                NIN
              </Typography>
              <TextField
                placeholder="National ID"
                value={nin}
                onChange={(e) => setNin(e.target.value)}
                required
                fullWidth
                sx={inputSx}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Password
              </Typography>
              <TextField
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((p) => !p)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
              />
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
              disabled={mutation.isPending}
              sx={{ backgroundColor: "#0b7b4c" }}
            >
              {mutation.isPending ? "Sending code..." : "Sign up"}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ textAlign: "center" }}>
          Already have an account? <Link href="/">Log in</Link>
        </Typography>
      </Stack>
    </AuthShell>
  );
}

const inputSx = {
  "& input": { textAlign: "left" },
  "& input::placeholder": { textAlign: "left" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f2f2f2",
    borderRadius: 999,
    "& fieldset": { border: "none" },
    "&:hover fieldset": { border: "none" },
    "&.Mui-focused fieldset": { border: "none" },
  },
};
