"use client";

import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Link from "next/link";

import { openTawkChat } from "./TawkToWidget";
import {
  COMPANY_NAME,
  RC_NUMBER,
  COMPANY_ADDRESS,
  PARTNERSHIP_EMAIL,
  SUPPORT_EMAIL,
} from "../lib/config";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        bgcolor: "#f5f5f5",
        color: "#1a1a1a",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left: Logo + Company info */}
          <Grid item xs={12} md={4}>
            <Box
              component={Link}
              href="/"
              sx={{ display: "inline-block", mb: 2, textDecoration: "none" }}
            >
              <Box
                component="img"
                src="/assets/svg/STILL PLAYLOGOBL.svg"
                alt="Still Play"
                sx={{ height: 36, width: "auto" }}
              />
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="body2" sx={{ color: "#1a1a1a" }}>
                {COMPANY_NAME}
              </Typography>
              <Typography variant="body2" sx={{ color: "#4a4a4a" }}>
                RC: {RC_NUMBER}
              </Typography>
              <Typography variant="body2" sx={{ color: "#4a4a4a" }}>
                {COMPANY_ADDRESS}
              </Typography>
            </Stack>
          </Grid>
          {/* Middle: Navigation */}
          <Grid item xs={12} md={4}>
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", color: "#1a1a1a", display: "block", mb: 1.5 }}>
              Navigation
            </Typography>
            <Stack spacing={0.5}>
              <Button component={Link} href="/#home" color="inherit" size="small" sx={{ justifyContent: "flex-start", textTransform: "none", color: "#4a4a4a" }}>
                Home
              </Button>
              <Button component={Link} href="/about" color="inherit" size="small" sx={{ justifyContent: "flex-start", textTransform: "none", color: "#4a4a4a" }}>
                About
              </Button>
              <Button component={Link} href="/partners" color="inherit" size="small" sx={{ justifyContent: "flex-start", textTransform: "none", color: "#4a4a4a" }}>
                Partners
              </Button>
              <Button component={Link} href="/blog" color="inherit" size="small" sx={{ justifyContent: "flex-start", textTransform: "none", color: "#4a4a4a" }}>
                Blog
              </Button>
              <Button component={Link} href="/faq" color="inherit" size="small" sx={{ justifyContent: "flex-start", textTransform: "none", color: "#4a4a4a" }}>
                FAQ
              </Button>
                <Button component={Link} href="/privacy" color="inherit" size="small" sx={{ justifyContent: "flex-start", textTransform: "none", color: "#4a4a4a" }}>
                Privacy
              </Button>
              <Button component={Link} href="/terms" color="inherit" size="small" sx={{ justifyContent: "flex-start", textTransform: "none", color: "#4a4a4a" }}>
                Legal
              </Button>
            </Stack>
          </Grid>
          {/* Right: Contact */}
          <Grid item xs={12} md={4}>
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", color: "#1a1a1a", display: "block", mb: 1.5 }}>
              Contact
            </Typography>
            <Stack spacing={0.5}>
              <Box component="a" href={`mailto:${PARTNERSHIP_EMAIL}`} sx={{ color: "#4a4a4a", textDecoration: "none", fontSize: 14 }}>
                {PARTNERSHIP_EMAIL}
              </Box>
              <Box component="a" href={`mailto:${SUPPORT_EMAIL}`} sx={{ color: "#4a4a4a", textDecoration: "none", fontSize: 14 }}>
                {SUPPORT_EMAIL}
              </Box>
            </Stack>
          </Grid>
        </Grid>
        <Box
          sx={{
            borderTop: "1px solid rgba(0,0,0,0.12)",
            mt: 4,
            pt: 4,
            position: "relative",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ textAlign: "center", color: "#4a4a4a" }}>
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </Typography>
          <Box
            component="button"
            type="button"
            onClick={() => openTawkChat()}
            aria-label="Chat with support"
            sx={{
              border: "none",
              cursor: "pointer",
              position: { xs: "static", sm: "absolute" },
              right: { sm: 0 },
              bottom: { sm: 0 },
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "#1a1a1a",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              flexShrink: 0,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            <HelpOutlineIcon sx={{ fontSize: 20 }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
