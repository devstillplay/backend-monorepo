"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import MobileFrame from "@/components/MobileFrame";

export default function HomePage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MobileFrame>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="screen-content"
            style={{ minHeight: "100vh" }}
          >
            <Box
              component={motion.div}
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              sx={{
                position: "relative",
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage:
                  "linear-gradient(135deg, #f0b12a 0%, #0b7b4c 55%, #f0b12a 100%)",
                backgroundSize: "200% 200%"
              }}
            >
              <Box
                component={motion.img}
                src="/assets/svg/STILL PLAYLOGOWH.svg"
                alt="Still Play"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                sx={{ width: 180, height: "auto" }}
              />
            </Box>
          </motion.div>
        ) : (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="screen-content"
          >
            <Stack
              spacing={4}
              sx={{ minHeight: "100vh", p: 3 }}
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <Stack spacing={2} alignItems="center">
                <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                  <Box
                    component="img"
                    src="/assets/svg/splashLOGO.svg"
                    alt="Still Play logo"
                    sx={{ width: 180, maxWidth: "70%", height: "auto" }}
                  />
                </Box>
                <Stack spacing={1} alignItems="center" textAlign="center">
                  <Typography variant="h4" fontWeight={700}>
                    Welcome to StillPlay
                  </Typography>
                  <Typography color="text.secondary">
                    Access 1,000+ beautifully designed layouts, wireframes, and
                    assets. Paste.
                  </Typography>
                </Stack>
              </Stack>
              <Stack spacing={2} width="100%" maxWidth={320}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => router.push("/login")}
                >
                  Log in
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  sx={{ backgroundColor: "#FFF4D9", borderColor: "#FFF4D9" }}
                  onClick={() => router.push("/signup")}
                >
                  Sign up
                </Button>
              </Stack>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileFrame>
  );
}
