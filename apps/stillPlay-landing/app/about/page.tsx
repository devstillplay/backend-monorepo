"use client";

import { Box, Button, Container, Grid, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";

import { COMPANY_LEGAL_NAME, PARTNERSHIP_EMAIL, SUPPORT_EMAIL } from "../../lib/config";

const MISSION_VISION_PHILOSOPHY = [
  {
    title: "Our Mission",
    color: "#FFC107",
    desc: "Empower strategic bettors with financial tools that protect their investment, while enabling access to lucrative opportunities.",
  },
  {
    title: "Our Vision",
    color: "#0b7b4c",
    desc: "To become the leading financial infrastructure powering the betting economy, enabling access to financial mobility.",
  },
  {
    title: "Our Philosophy",
    color: "#1a1a1a",
    desc: "Betting strategy should never be overlooked. We believe in responsible betting, ensuring no one is left behind by irresponsible finance.",
  },
];

const VALUES = [
  {
    title: "Responsible Finance",
    color: "#FFC107",
    desc: "We promote structured credit access that protects users from over-extension while enabling quick fluidity.",
  },
  {
    title: "Transparency",
    color: "#0b7b4c",
    desc: "Users are informed of terms, fees, and repayment schedules before accepting any credit.",
  },
  {
    title: "Security First",
    color: "#1a1a1a",
    desc: "Prioritizes innovative encryption and security protocols to protect all user data and transactions.",
  },
  {
    title: "Financial Inclusion",
    color: "#FFC107",
    desc: "Aids everyone to overcome obstacles to financial mobility, no matter where they are.",
  },
];

export default function AboutPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* Main Title */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#fff" }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, textAlign: "center", mb: 1, color: "#1a1a1a" }}>
            About Still Play
          </Typography>
          <Typography variant="h6" sx={{ textAlign: "center", color: "#4a4a4a", fontWeight: 400 }}>
            Empowering strategic bettors with financial tools
          </Typography>
        </Container>
      </Box>

      {/* Mission, Vision, Philosophy */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#f5f5f5" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {MISSION_VISION_PHILOSOPHY.map((item) => (
              <Grid item xs={12} md={4} key={item.title}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "white",
                    border: "1px solid rgba(0,0,0,0.08)",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: item.color,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: "#1a1a1a" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4a4a4a", lineHeight: 1.6 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* The Story Behind Still Play */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#fff" }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 6, color: "#1a1a1a" }}>
            The Story Behind Still Play
          </Typography>
          <Stack spacing={3}>
            <Typography variant="body1" sx={{ color: "#4a4a4a", textAlign: "center", lineHeight: 1.8 }}>
              Still Play was born from a simple observation: strategic sports bettors often have the knowledge and discipline to succeed, but lack the liquidity to act when opportunities arise. Many turn to risky alternatives or miss out entirely.
            </Typography>
            <Typography variant="body1" sx={{ color: "#4a4a4a", textAlign: "center", lineHeight: 1.8 }}>
              We built Still Play to bridge that gap. Our platform provides instant betting credit to verified bettors, delivered directly into their betting wallets. We partner with licensed betting operators and regulated payment ecosystems to ensure every transaction is secure and compliant.
            </Typography>
            <Typography variant="body1" sx={{ color: "#4a4a4a", textAlign: "center", lineHeight: 1.8 }}>
              Through our integrations with leading betting platforms, users can access credit without leaving their preferred app. Repayment is flexible—through wallet deposits, our web app, or partner locations—so bettors stay in control of their finances.
            </Typography>
            <Typography variant="body1" sx={{ color: "#4a4a4a", textAlign: "center", lineHeight: 1.8 }}>
              We believe betting strategy should never be overlooked by irresponsible finance. Still Play is committed to responsible credit access, transparency, and building a financial infrastructure that empowers rather than exploits.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Our Values - 2 column layout */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#f5f5f5" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 6, color: "#1a1a1a" }}>
            Our Values
          </Typography>
          <Grid container spacing={3}>
            {VALUES.map((item) => (
              <Grid item xs={12} md={6} key={item.title}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    alignItems: "flex-start",
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "white",
                    border: "1px solid rgba(0,0,0,0.08)",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      minHeight: 48,
                      borderRadius: 1,
                      bgcolor: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: "#1a1a1a" }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#4a4a4a", lineHeight: 1.6 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Built by */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#0b7b4c", color: "white" }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 2, color: "white" }}>
            Built by {COMPANY_LEGAL_NAME}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 4, color: "rgba(255,255,255,0.95)", lineHeight: 1.7 }}>
            Still Play is developed and operated by {COMPANY_LEGAL_NAME}, a registered Nigerian company committed to building financial infrastructure for underserved markets.
          </Typography>
          <Box sx={{ maxWidth: 400, mx: "auto" }}>
            <TextField
              fullWidth
              placeholder="Enter your email"
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "white",
                  borderRadius: 3,
                  "& fieldset": { border: "none" },
                },
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Get in Touch */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#fff" }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 1, color: "#1a1a1a" }}>
            Get in Touch
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 4, color: "#4a4a4a" }}>
            Have questions about Still Play? We&apos;d love to hear from you.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" alignItems="center">
            <Button
              component="a"
              href={`mailto:${PARTNERSHIP_EMAIL}`}
              sx={{
                textTransform: "none",
                bgcolor: "#FFC107",
                color: "#fff",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": { bgcolor: "#e6ac00" },
              }}
            >
              {PARTNERSHIP_EMAIL}
            </Button>
            <Button
              component="a"
              href={`mailto:${SUPPORT_EMAIL}`}
              variant="outlined"
              sx={{
                textTransform: "none",
                borderColor: "#0b7b4c",
                color: "#0b7b4c",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": { borderColor: "#0a6b3a", bgcolor: "rgba(11,123,76,0.04)" },
              }}
            >
              {SUPPORT_EMAIL}
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
