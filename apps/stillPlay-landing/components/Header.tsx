"use client";

import { useState } from "react";
import { Box, Button, Container, Drawer, IconButton, Stack } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";

import { PARTNERSHIP_EMAIL } from "../lib/config";

const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/about" },
  { label: "Partners", href: "/partners" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const navContent = (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, justifyContent: "center" }}>
      {NAV_LINKS.map((link) => (
        <Button
          key={link.href}
          component={Link}
          href={link.href}
          color="inherit"
          sx={{ textTransform: "none", fontWeight: 500, color: "#4a4a4a" }}
          onClick={() => setMobileOpen(false)}
        >
          {link.label}
        </Button>
      ))}
    </Stack>
  );

  const ctaButtons = (
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
        onClick={() => setMobileOpen(false)}
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
  );

  return (
    <Box
      component="header"
      sx={{
        py: 2,
        px: 2,
        position: "sticky",
        top: 0,
        zIndex: 1100,
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
              sx={{ height: { xs: 28, md: 36 }, width: "auto" }}
            />
          </Box>

          {/* Desktop nav - hidden on mobile */}
          <Box sx={{ display: { xs: "none", md: "flex" }, flex: 1, justifyContent: "center" }}>
            {navContent}
          </Box>

          {/* Desktop CTA - hidden on mobile */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>{ctaButtons}</Box>

          {/* Mobile hamburger */}
          <IconButton
            aria-label="Open menu"
            onClick={handleDrawerToggle}
            sx={{
              display: { xs: "flex", md: "none" },
              color: "#1a1a1a",
            }}
          >
            <MenuIcon />
          </IconButton>
        </Stack>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: "min(320px, 100vw)",
            boxSizing: "border-box",
            pt: 2,
            px: 2,
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Box
            component={Link}
            href="/"
            onClick={handleDrawerToggle}
            sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          >
            <Box
              component="img"
              src="/assets/svg/STILL PLAYLOGOBL.svg"
              alt="Still Play"
              sx={{ height: 32, width: "auto" }}
            />
          </Box>
          <IconButton aria-label="Close menu" onClick={handleDrawerToggle} sx={{ color: "#1a1a1a" }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack spacing={1} component="nav">
          {NAV_LINKS.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              fullWidth
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                fontWeight: 500,
                color: "#1a1a1a",
                py: 1.5,
                fontSize: "1rem",
              }}
              onClick={handleDrawerToggle}
            >
              {link.label}
            </Button>
          ))}
        </Stack>
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Button
            component={Link}
            href="/#waitlist"
            variant="contained"
            fullWidth
            sx={{
              textTransform: "none",
              backgroundColor: "#FFC107",
              color: "#fff",
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              "&:hover": { backgroundColor: "#e6ac00" },
            }}
            onClick={handleDrawerToggle}
          >
            Join Waitlist
          </Button>
          <Button
            component="a"
            href={`mailto:${PARTNERSHIP_EMAIL}`}
            variant="outlined"
            fullWidth
            sx={{
              textTransform: "none",
              borderColor: "#0b7b4c",
              color: "#0b7b4c",
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              "&:hover": { borderColor: "#0a6b3a", backgroundColor: "rgba(11,123,76,0.04)" },
            }}
          >
            Become Partner
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
}
