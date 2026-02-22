"use client";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";

import MobileFrame from "@/components/MobileFrame";
import useAuthStore from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    login();
    router.push("/dashboard");
  };

  return (
    <MobileFrame>
      <Box className="screen-content" sx={{ p: 3 }}>
        <Stack spacing={3} sx={{ height: "100%" }}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              Welcome back
            </Typography>
            <Typography color="text.secondary">
              Your football space is waiting for you.
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <TextField
              label="Email address"
              placeholder="you@example.com"
              fullWidth
              type="email"
            />
            <TextField label="Password" fullWidth type="password" />
            <Typography
              component={Link}
              href="/signup"
              sx={{
                alignSelf: "flex-end",
                color: "primary.main",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Forgot password?
            </Typography>
          </Stack>

          <Box flex={1} />

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleLogin}
          >
            Log in to Still Play
          </Button>
        </Stack>
      </Box>
    </MobileFrame>
  );
}
