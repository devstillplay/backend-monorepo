"use client";

import { Box, Button, Container, Stack } from "@mui/material";
import Link from "next/link";

import { PARTNERSHIP_EMAIL } from "../lib/config";

export default function Header() {
  return (
    <Box
      component="header"
      sx={{
        py: 2,
        px: 2,
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: "#fff",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Box
            component={Link}
            href="/"
            sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          >
            <Box
              component="img"
              src="/assets/svg/STILL PLAYLOGOBL.svg"
              alt="Still Play"
              sx={{ height: 36, width: "auto" }}
            />
          </Box>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, justifyContent: "center" }}>
            <Button component={Link} href="/#home" color="inherit" sx={{ textTransform: "none", fontWeight: 500, color: "#4a4a4a" }}>
              Home
            </Button>
            <Button component={Link} href="/about" color="inherit" sx={{ textTransform: "none", fontWeight: 500, color: "#4a4a4a" }}>
              About
            </Button>
            <Button component={Link} href="/partners" color="inherit" sx={{ textTransform: "none", fontWeight: 500, color: "#4a4a4a" }}>
              Partners
            </Button>
            <Button component={Link} href="/faq" color="inherit" sx={{ textTransform: "none", fontWeight: 500, color: "#4a4a4a" }}>
              FAQ
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              component={Link}
              href="/#waitlist"
              variant="contained"
              size="medium"
              sx={{
                textTransform: "none",
                backgroundColor: "#FFC107",
                color: "#fff",
                px: 3,
                py: 1.25,
                borderRadius: 2,
                "&:hover": { backgroundColor: "#e6ac00" },
              }}
            >
              Join Waitlist
            </Button>
            <Button
              component="a"
              href={`mailto:${PARTNERSHIP_EMAIL}`}
              variant="outlined"
              size="medium"
              sx={{
                textTransform: "none",
                borderColor: "#0b7b4c",
                color: "#0b7b4c",
                px: 3,
                py: 1.25,
                borderRadius: 2,
                "&:hover": { borderColor: "#0a6b3a", backgroundColor: "rgba(11,123,76,0.04)" },
              }}
            >
              Become Partner
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
