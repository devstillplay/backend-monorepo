"use client";

import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import BoltIcon from "@mui/icons-material/Bolt";
import SecurityIcon from "@mui/icons-material/Security";
import BarChartIcon from "@mui/icons-material/BarChart";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";

import { PARTNERSHIP_EMAIL } from "../../lib/config";

const BETTING_PLATFORM_BENEFITS = [
  {
    title: "Increased Wallet Activity",
    icon: TrendingUpIcon,
    desc: "More users funding their wallets means more betting activity on your platform.",
  },
  {
    title: "Higher User Retention",
    icon: GroupAddIcon,
    desc: "Users stay engaged even when they're low on personal funds.",
  },
  {
    title: "Seamless Integration",
    icon: BoltIcon,
    desc: "Easy API integration that works with your existing wallet system.",
  },
  {
    title: "Secure & Compliant",
    icon: SecurityIcon,
    desc: "Built with security and regulatory compliance in mind.",
  },
  {
    title: "Revenue Opportunities",
    icon: BarChartIcon,
    desc: "New revenue streams from increased platform activity.",
  },
  {
    title: "No Risk to Platform",
    icon: LockIcon,
    desc: "Still Play manages all credit risk and collections.",
  },
];

const HOW_IT_WORKS_PLATFORMS = [
  { step: 1, title: "API Integration", desc: "Simple API integration with your wallet system." },
  { step: 2, title: "User Access", desc: "Users access Still Play credit directly from your platform." },
  { step: 3, title: "Instant Credit", desc: "Credit delivered directly into user betting wallets." },
];

const OPPORTUNITY_ITEMS = [
  "Access to $9Bn+ active borrowers in Nigeria",
  "High-frequency loan transaction volume with daily turnover",
  "Reach an underserved market segment with consistent income",
  "Transparent risk management and performance tracking",
];

const WHAT_WE_PROVIDE = [
  "Complete credit infrastructure and user management",
  "Real-time dashboard with performance analytics",
  "Collection and recovery systems",
  "Regulatory compliance and reporting",
];

const PARTNER_TYPES = ["Betting Platform", "Financial Institution", "Other"];

export default function PartnersPage() {
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [partnerType, setPartnerType] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Wire to backend API
    setWaitlistSubmitted(true);
  };
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* Main Heading */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#fff" }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, textAlign: "center", mb: 1, color: "#1a1a1a" }}>
            Partner With Still Play
          </Typography>
          <Typography variant="h6" sx={{ textAlign: "center", color: "#4a4a4a", fontWeight: 400 }}>
            Join us in powering Nigeria&apos;s betting credit ecosystem.
          </Typography>
        </Container>
      </Box>

      {/* For Betting Platforms */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg">
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "#1a1a1a" }}>
            For Betting Platforms
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: "#4a4a4a", maxWidth: 720 }}>
            Integrate Still Play into your platform and unlock new opportunities for greater user engagement.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 8 }}>
            {BETTING_PLATFORM_BENEFITS.map((item) => {
              const Icon = item.icon;
              return (
                <Grid item xs={12} sm={6} md={4} key={item.title}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "#f8f9fa",
                      border: "1px solid rgba(0,0,0,0.08)",
                      height: "100%",
                    }}
                  >
                    <Box sx={{ color: "#0b7b4c", mb: 1.5 }}>
                      <Icon sx={{ fontSize: 36 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#1a1a1a" }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#4a4a4a", lineHeight: 1.6 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: "#1a1a1a" }}>
            How It Works for Platforms
          </Typography>
          <Grid container spacing={4}>
            {HOW_IT_WORKS_PLATFORMS.map((item) => (
              <Grid item xs={12} md={4} key={item.step}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: "#FFC107",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {item.step}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#1a1a1a" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4a4a4a" }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* For Financial Institutions */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#f5f5f5" }}>
        <Container maxWidth="lg">
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "#1a1a1a" }}>
            For Financial Institutions
          </Typography>
          <Typography variant="body1" sx={{ mb: 6, color: "#4a4a4a", maxWidth: 720 }}>
            Join us as a liquidity partner and tap into Nigeria&apos;s massive lending economy.
          </Typography>

          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#1a1a1a" }}>
                The Opportunity
              </Typography>
              <Stack spacing={1.5}>
                {OPPORTUNITY_ITEMS.map((item) => (
                  <Box key={item} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#0b7b4c",
                        mt: 1,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body1" sx={{ color: "#4a4a4a", lineHeight: 1.6 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#1a1a1a" }}>
                What We Provide
              </Typography>
              <Stack spacing={1.5}>
                {WHAT_WE_PROVIDE.map((item) => (
                  <Box key={item} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#FFC107",
                        mt: 1,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body1" sx={{ color: "#4a4a4a", lineHeight: 1.6 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>

          {/* CTA Box */}
          <Box
            sx={{
              mt: 8,
              p: 4,
              borderRadius: 2,
              bgcolor: "#0b7b4c",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "white" }}>
              Interested in Becoming a Liquidity Partner?
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "rgba(255,255,255,0.95)" }}>
              Join our network of financial institutions serving the lending economy
            </Typography>
            <Button
              component="a"
              href={`mailto:${PARTNERSHIP_EMAIL}`}
              sx={{
                textTransform: "none",
                bgcolor: "white",
                color: "#0b7b4c",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                border: "2px solid white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)", color: "#0a6b3a" },
              }}
            >
              Contact Our Partnership Team
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Join Financial Partner Waitlist */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#fff" }}>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 1, color: "#1a1a1a" }}>
            Join Financial Partner Waitlist
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 6, color: "#4a4a4a" }}>
            Be among the first financial institutions to partner with Still Play
          </Typography>

          {waitlistSubmitted ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>
                Thanks for your interest!
              </Typography>
              <Typography variant="body2" sx={{ color: "#4a4a4a" }}>
                Our partnership team will be in touch soon.
              </Typography>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleWaitlistSubmit}
              sx={{
                p: 4,
                borderRadius: 2,
                border: "1px solid rgba(0,0,0,0.12)",
                bgcolor: "white",
              }}
            >
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Contact Name"
                  placeholder="Enter your name"
                  value={waitlistName}
                  onChange={(e) => setWaitlistName(e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fafafa",
                      "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fafafa",
                      "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Business Name"
                  placeholder="Enter your business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fafafa",
                      "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                    },
                  }}
                />
                <FormControl
                  fullWidth
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fafafa",
                      "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                    },
                  }}
                >
                  <InputLabel>Partner Type</InputLabel>
                  <Select
                    value={partnerType}
                    label="Partner Type"
                    onChange={(e) => setPartnerType(e.target.value)}
                    displayEmpty
                    renderValue={(v) => v || "SELECT PARTNER TYPE"}
                  >
                    <MenuItem value="" disabled>
                      SELECT PARTNER TYPE
                    </MenuItem>
                    {PARTNER_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  sx={{
                    textTransform: "none",
                    bgcolor: "#FFC107",
                    color: "#fff",
                    py: 1.5,
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#e6ac00" },
                  }}
                >
                  Submit Partnership Inquiry
                </Button>
              </Stack>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}
