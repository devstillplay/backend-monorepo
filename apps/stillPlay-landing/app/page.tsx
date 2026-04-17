"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import LockIcon from "@mui/icons-material/Lock";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SavingsIcon from "@mui/icons-material/Savings";
import BoltIcon from "@mui/icons-material/Bolt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import {
  COMPANY_NAME,
  RC_NUMBER,
  PARTNERSHIP_EMAIL,
} from "../lib/config";
import { joinWaitlist } from "../lib/waitlist";

const SECURITY_ITEMS = [
  {
    title: "Secure Infrastructure",
    subtitle: "Industry-standard security protocols",
  },
  {
    title: "Encrypted Transactions",
    subtitle: "All data is encrypted and protected",
  },
  {
    title: "Responsible Credit Access",
    subtitle: "Structured and controlled credit facility",
  },
  {
    title: "Protected User Data",
    subtitle: "Privacy-first approach to data",
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Start from your betting platform",
    desc: "Access Still Play directly from your preferred betting app",
  },
  {
    step: 2,
    title: "Request betting credit",
    desc: "Based on your eligibility profile and history",
  },
  {
    step: 3,
    title: "Funds delivered instantly",
    desc: "Credit is delivered directly into your betting wallet",
  },
  {
    step: 4,
    title: "Flexible repayment",
    desc: "Repay through wallet deposits, web app, or betting shops",
  },
];

const WHY_BETTORS = [
  {
    title: "Protect Your Life Funds",
    desc: "Still Play helps bettors avoid using essential money like rent or savings.",
    icon: SavingsIcon,
  },
  {
    title: "Never Miss a Strategic Opportunity",
    desc: "Instant credit when opportunities appear.",
    icon: BoltIcon,
  },
  {
    title: "Transparent Credit Access",
    desc: "Users see repayment terms before accepting funding.",
    icon: VisibilityIcon,
  },
  {
    title: "Build Your Financial Identity",
    desc: "Responsible usage contributes to building a financial reputation.",
    icon: TrendingUpIcon,
  },
];

const OPPORTUNITY_STATS = [
  { value: "65M+", label: "Active sports bettors in Nigeria" },
  { value: "25M+", label: "Employed bettors with regular income" },
  { value: "₦3,000", label: "Average daily betting activity" },
];

const FINANCIAL_PASSPORT = [
  {
    title: "Transition from Cash to Credit",
    desc: "Build a verified financial profile through consistent usage and repayment behavior.",
  },
  {
    title: "Winning Streak Effect",
    desc: "Demonstrate financial discipline that matters to banks and lenders.",
  },
  {
    title: "Proving Income Augmentation",
    desc: "Show reliability and creditworthiness through your betting activity.",
  },
];

const BETTING_PLATFORMS = [
  { label: "SportyBet", src: "/assets/png/sportyBet.png", link: "https://www.sportybet.com" },
  { label: "BetKing", src: "/assets/png/betKing.png", link: "https://www.betking.com" },
  { label: "Bet9ja", src: "/assets/png/bet9ja.png", link: "https://www.bet9ja.com" },
  { label: "NairaBet", src: "/assets/png/nairaBet.png", link: "https://www.nairabet.com" },
];

const COMING_SOON_STREAMING = [
  {
    label: "Netflix",
    src: "/assets/brands/netflix.svg",
    logoSx: {
      width: "min(94%, 300px)",
      height: "auto",
      maxHeight: { xs: 76, sm: 92 },
      objectFit: "contain",
    },
  },
  {
    label: "Spotify",
    src: "/assets/brands/spotify.svg",
    logoSx: {
      width: "auto",
      height: "auto",
      maxWidth: "82%",
      maxHeight: { xs: 112, sm: 140 },
      objectFit: "contain",
    },
  },
] as const;

const PARTNER_BENEFITS = [
  {
    title: "Massive Market Opportunity",
    desc: "Access millions of active bettors in Nigeria's growing betting economy.",
    icon: PeopleIcon,
  },
  {
    title: "High Transaction Frequency",
    desc: "Benefit from daily betting activities and consistent credit turnover.",
    icon: LocalAtmIcon,
  },
  {
    title: "Transparent Performance Dashboard",
    desc: "Real-time insights and analytics on credit performance and recovery.",
    icon: DashboardIcon,
  },
];

const EARLY_ACCESS_ITEMS = [
  "Priority access after Still Play launches",
  "Timely credit/Bet availability when Still Play launches",
  "Early feature access",
];

/** Optional — maps to admin Survey columns Business / Partner type for bettor waitlist */
const LANDING_WAITLIST_PARTNER_TYPES = [
  "Individual bettor",
  "Betting syndicate / group",
  "Affiliate or promoter",
  "Other",
] as const;

const FINANCIAL_PARTNER_TYPES = [
  "Financial Institution",
  "Bank",
  "Fund / asset manager",
  "Microfinance",
  "Other liquidity partner",
] as const;

export default function LandingPage() {
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistBusiness, setWaitlistBusiness] = useState("");
  const [waitlistPartnerType, setWaitlistPartnerType] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistError(null);
    setWaitlistSubmitting(true);
    try {
      await joinWaitlist({
        fullName: waitlistName.trim(),
        email: waitlistEmail.trim(),
        source: "landing",
        ...(waitlistBusiness.trim()
          ? { businessName: waitlistBusiness.trim() }
          : {}),
        ...(waitlistPartnerType.trim()
          ? { partnerType: waitlistPartnerType.trim() }
          : {}),
      });
      setWaitlistSubmitted(true);
    } catch (err) {
      setWaitlistError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setWaitlistSubmitting(false);
    }
  };

  const [financialName, setFinancialName] = useState("");
  const [financialEmail, setFinancialEmail] = useState("");
  const [financialBusiness, setFinancialBusiness] = useState("");
  const [financialPartnerType, setFinancialPartnerType] = useState(
    FINANCIAL_PARTNER_TYPES[0] as string
  );
  const [financialSubmitted, setFinancialSubmitted] = useState(false);
  const [financialSubmitting, setFinancialSubmitting] = useState(false);
  const [financialError, setFinancialError] = useState<string | null>(null);

  const handleFinancialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFinancialError(null);
    setFinancialSubmitting(true);
    try {
      await joinWaitlist({
        fullName: financialName.trim(),
        email: financialEmail.trim(),
        source: "financial",
        businessName: financialBusiness.trim(),
        partnerType: financialPartnerType.trim(),
      });
      setFinancialSubmitted(true);
    } catch (err) {
      setFinancialError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setFinancialSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Hero */}
      <Box
        id="home"
        component={motion.section}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          py: { xs: 6, md: 10 },
          backgroundColor: "#fff",
          minHeight: { md: "85vh" },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={3} alignItems="flex-start" textAlign="left">
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    color: "#2d2d2d",
                    fontWeight: 700,
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.5rem" },
                    lineHeight: 1.2,
                  }}
                >
                  <Box component="span" sx={{ display: "block", fontWeight: 800 }}>
                    Sure Odds,
                  </Box>
                  <Box
                    component="span"
                    sx={{ display: "block", fontWeight: 800, mt: { xs: 0.25, sm: 0.5 } }}
                  >
                    No Funds?
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      display: "block",
                      color: "#0b7b4c",
                      fontWeight: 800,
                      mt: { xs: 0.75, sm: 1 },
                      letterSpacing: { md: "-0.02em" },
                    }}
                  >
                    Still Play
                  </Box>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#4a4a4a",
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                    lineHeight: 1.6,
                  }}
                >
                  Still Play provides instant betting credit to verified sports bettors, delivered directly into betting wallets through secure integrations with betting platforms.
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b6b6b" }}>
                  {COMPANY_NAME}
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: { xs: "100%", sm: "auto" } }}>
                  <Button
                    component={Link}
                    href="#waitlist"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#FFC107",
                      color: "#fff",
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      "&:hover": { backgroundColor: "#e6ac00" },
                    }}
                  >
                    Join Bettor Waitlist
                  </Button>
                  <Button
                    component={Link}
                    href="#financial-partner"
                    variant="outlined"
                    size="large"
                    fullWidth
                    sx={{
                      textTransform: "none",
                      borderColor: "#0b7b4c",
                      color: "#0b7b4c",
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      "&:hover": { borderColor: "#0a6b3a", backgroundColor: "rgba(11,123,76,0.04)" },
                    }}
                  >
                    Become Financial Partner
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: { xs: 280, md: 420 },
                }}
              >
                <Box
                  component="img"
                  src="/assets/splashLOGO.svg"
                  alt="Still Play"
                  sx={{
                    width: "100%",
                    maxWidth: { xs: 260, sm: 320, md: 380 },
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Built for Security and Trust */}
      <Box id="about" component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#f5f5f5" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 2, color: "#1a1a1a", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            Built for Security and Trust
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", maxWidth: 640, mx: "auto", mb: 6, color: "#4a4a4a" }}>
            Still Play integrates with licensed betting operators and regulated financial partners to ensure a secure and reliable ecosystem.
          </Typography>
          <Grid container spacing={3}>
            {SECURITY_ITEMS.map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={item.title}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "white",
                    border: "1px solid",
                    borderColor: "rgba(0,0,0,0.08)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Box sx={{ color: "#0b7b4c", mb: 2 }}>
                    {i === 0 && <SecurityIcon sx={{ fontSize: 48 }} />}
                    {i === 1 && <LockIcon sx={{ fontSize: 48 }} />}
                    {i === 2 && <AssignmentTurnedInIcon sx={{ fontSize: 48 }} />}
                    {i === 3 && <AdminPanelSettingsIcon sx={{ fontSize: 48 }} />}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: "#1a1a1a" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4a4a4a" }}>
                    {item.subtitle}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Typography variant="body2" sx={{ textAlign: "center", mt: 4, color: "#4a4a4a" }}>
            {COMPANY_NAME} (RC: {RC_NUMBER})
          </Typography>
        </Container>
      </Box>

      {/* How It Works */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 2, color: "#1a1a1a", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            How It Works
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 6, color: "#4a4a4a" }}>
            Simple, fast, and secure betting credit in four steps
          </Typography>
          <Grid container spacing={4}>
            {HOW_IT_WORKS.map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={item.step}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  sx={{ textAlign: "center" }}
                >
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

      {/* Why Bettors Use Still Play */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 6, color: "#1a1a1a", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            Why Bettors Use Still Play
          </Typography>
          <Grid container spacing={3}>
            {WHY_BETTORS.map((item) => {
              const Icon = item.icon;
              return (
                <Grid item xs={12} sm={6} md={3} key={item.title}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "white",
                      border: "1px solid",
                      borderColor: "rgba(0,0,0,0.08)",
                      height: "100%",
                    }}
                  >
                    <Box sx={{ color: "#0b7b4c", mb: 1.5 }}>
                      <Icon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#1a1a1a" }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#4a4a4a" }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* The Opportunity */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#000", color: "white" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 6, color: "white", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            The Opportunity
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {OPPORTUNITY_STATS.map((stat) => (
              <Grid item xs={12} sm={4} key={stat.label}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: "#FFC107", fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "white" }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* From Betting Discipline to Financial Passport */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 2, color: "#1a1a1a", fontSize: { xs: "1.35rem", sm: "1.5rem", md: "2rem" } }}>
            From Betting Discipline to Financial Passport
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 6, color: "#4a4a4a" }}>
            Favorable repayment history builds credibility for financial freedom
          </Typography>
          <Grid container spacing={4}>
            {FINANCIAL_PASSPORT.map((item) => (
              <Grid item xs={12} md={4} key={item.title}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "#f8f9fa",
                    border: "1px solid",
                    borderColor: "rgba(0,0,0,0.08)",
                    height: "100%",
                  }}
                >
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

      {/* Built for Betting Platforms */}
      <Box id="partners" component="section" sx={{ py: { xs: 8, md: 12 }, background: "linear-gradient(180deg, #0a6b3a 0%, #0b7b4c 50%, #0d8f5a 100%)" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 2, color: "white", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            Built for Betting Platforms
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", maxWidth: 640, mx: "auto", mb: 6, color: "rgba(255,255,255,0.95)" }}>
            Still Play integrates with licensed betting platforms through secure APIs, enabling users to access betting credit directly from betting platform interfaces.
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {BETTING_PLATFORMS.map((platform) => (
              <Grid item xs={12} sm={6} md={3} key={platform.label}>
                <Box
                  component="a"
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "block",
                    aspectRatio: "16/10",
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "white",
                    textDecoration: "none",
                    "&:hover": { opacity: 0.95 },
                  }}
                >
                  <Box
                    component="img"
                    src={platform.src}
                    alt={platform.label}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      p: 1.5,
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              mt: 8,
              pt: 6,
              borderTop: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                textAlign: "center",
                mb: 0.5,
                color: "white",
                letterSpacing: "0.02em",
              }}
            >
              Coming soon
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                maxWidth: 560,
                mx: "auto",
                mb: 4,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              Netflix, Spotify, and more streaming and entertainment partnerships.
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {COMING_SOON_STREAMING.map((brand) => (
                <Grid item xs={12} sm={6} md={4} key={brand.label}>
                  <Box sx={{ position: "relative", maxWidth: 360, mx: "auto" }}>
                    <Chip
                      label="Coming soon"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 1,
                        fontWeight: 600,
                        bgcolor: "rgba(255, 193, 7, 0.95)",
                        color: "#1a1a1a",
                        "& .MuiChip-label": { px: 1.25 },
                      }}
                    />
                    <Box
                      sx={{
                        aspectRatio: "16/10",
                        borderRadius: 2,
                        bgcolor: "rgba(255,255,255,0.96)",
                        border: "1px dashed rgba(255,255,255,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 2,
                        py: 2.5,
                        minHeight: { xs: 120, sm: 140 },
                      }}
                    >
                      <Box
                        component="img"
                        src={brand.src}
                        alt={brand.label}
                        sx={brand.logoSx}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: "center",
                        mt: 1.25,
                        color: "rgba(255,255,255,0.92)",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {brand.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Button
              component="a"
              href={`mailto:${PARTNERSHIP_EMAIL}`}
              sx={{
                textTransform: "none",
                bgcolor: "white",
                color: "#1a1a1a",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.5)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              }}
            >
              Partner With Still Play
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Powering the Betting Credit Ecosystem */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 1, color: "#1a1a1a", fontSize: { xs: "1.35rem", sm: "1.5rem", md: "2rem" } }}>
            Powering the Betting Credit Ecosystem
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 6, color: "#4a4a4a" }}>
            Opportunity for investors
          </Typography>
          <Grid container spacing={4}>
            {PARTNER_BENEFITS.map((item) => {
              const Icon = item.icon;
              return (
                <Grid item xs={12} md={4} key={item.title}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "#f8f9fa",
                      border: "1px solid",
                      borderColor: "rgba(0,0,0,0.08)",
                      height: "100%",
                    }}
                  >
                    <Box sx={{ color: "#1a1a1a", mb: 1.5 }}>
                      <Icon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#1a1a1a" }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#4a4a4a" }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              component={Link}
              href="#financial-partner"
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
              Become a Liquidity Partner
            </Button>
          </Box>

          <Box
            id="financial-partner"
            component="section"
            sx={{ mt: 8, pt: 6, borderTop: "1px solid", borderColor: "rgba(0,0,0,0.08)" }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, textAlign: "center", mb: 1, color: "#1a1a1a" }}
            >
              Financial and liquidity partnerships
            </Typography>
            <Typography
              variant="body2"
              sx={{ textAlign: "center", mb: 4, color: "#4a4a4a", maxWidth: 520, mx: "auto" }}
            >
              Register interest as a bank, fund, or liquidity partner. Our team will follow up with next steps.
            </Typography>
            {financialSubmitted ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>
                  Thank you
                </Typography>
                <Typography variant="body2" sx={{ color: "#4a4a4a" }}>
                  We&apos;ve received your details and will be in touch soon.
                </Typography>
              </Box>
            ) : (
              <Box
                component="form"
                onSubmit={handleFinancialSubmit}
                sx={{
                  maxWidth: 480,
                  mx: "auto",
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "rgba(0,0,0,0.12)",
                  bgcolor: "#fafafa",
                }}
              >
                <Stack spacing={2}>
                  {financialError ? (
                    <Alert severity="error" onClose={() => setFinancialError(null)}>
                      {financialError}
                    </Alert>
                  ) : null}
                  <TextField
                    fullWidth
                    required
                    label="Contact name"
                    value={financialName}
                    onChange={(e) => setFinancialName(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "white",
                        "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="Work email"
                    value={financialEmail}
                    onChange={(e) => setFinancialEmail(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "white",
                        "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    required
                    label="Institution or company name"
                    value={financialBusiness}
                    onChange={(e) => setFinancialBusiness(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "white",
                        "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                      },
                    }}
                  />
                  <FormControl
                    fullWidth
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "white",
                        "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                      },
                    }}
                  >
                    <InputLabel id="financial-partner-type-label">Partner type</InputLabel>
                    <Select
                      labelId="financial-partner-type-label"
                      label="Partner type"
                      value={financialPartnerType}
                      onChange={(e) => setFinancialPartnerType(e.target.value)}
                    >
                      {FINANCIAL_PARTNER_TYPES.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    type="submit"
                    disabled={financialSubmitting}
                    fullWidth
                    sx={{
                      textTransform: "none",
                      bgcolor: "#0b7b4c",
                      color: "#fff",
                      py: 1.25,
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#0a6b3a" },
                    }}
                  >
                    {financialSubmitting ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      "Submit interest"
                    )}
                  </Button>
                  <Typography variant="caption" sx={{ color: "#6b6b6b", textAlign: "center" }}>
                    Prefer email? Reach us at{" "}
                    <Box component="a" href={`mailto:${PARTNERSHIP_EMAIL}`} sx={{ color: "#0b7b4c" }}>
                      {PARTNERSHIP_EMAIL}
                    </Box>
                    .
                  </Typography>
                </Stack>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Early Access Advantage */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#FFC107" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 1, color: "#1a1a1a", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            Early Access Advantage
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 6, color: "#4a4a4a" }}>
            Users who join the waitlist early will receive.
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {EARLY_ACCESS_ITEMS.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "white",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: "#0b7b4c",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "#1a1a1a" }}>
                    {item}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              component={Link}
              href="#waitlist"
              sx={{
                textTransform: "none",
                color: "#1a1a1a",
                fontWeight: 600,
                "&:hover": { textDecoration: "underline", bgcolor: "transparent" },
              }}
            >
              Join the Waitlist
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Be Among the First to Access Still Play - Waitlist */}
      <Box id="waitlist" component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff" }}>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 1, color: "#1a1a1a", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            Be Among the First to Access Still Play
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 6, color: "#4a4a4a" }}>
            Early users get exclusive access when the platform launches.
          </Typography>
          {waitlistSubmitted ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>
                Thanks for joining!
              </Typography>
              <Typography variant="body2" sx={{ color: "#4a4a4a" }}>
                We&apos;ll notify you when Still Play launches.
              </Typography>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleWaitlistSubmit}
              sx={{
                p: 4,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "rgba(0,0,0,0.12)",
                bgcolor: "white",
              }}
            >
              <Stack spacing={2}>
                {waitlistError ? (
                  <Alert severity="error" onClose={() => setWaitlistError(null)}>
                    {waitlistError}
                  </Alert>
                ) : null}
                <TextField
                  fullWidth
                  label="Full Name"
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
                  label="Business or organization (optional)"
                  placeholder="Company, team, or group name"
                  value={waitlistBusiness}
                  onChange={(e) => setWaitlistBusiness(e.target.value)}
                  helperText="Leave blank if you are signing up only for yourself."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fafafa",
                      "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                    },
                  }}
                />
                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fafafa",
                      "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                    },
                  }}
                >
                  <InputLabel id="waitlist-partner-type-label">Partner type (optional)</InputLabel>
                  <Select
                    labelId="waitlist-partner-type-label"
                    label="Partner type (optional)"
                    value={waitlistPartnerType}
                    onChange={(e) => setWaitlistPartnerType(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>— Not applicable —</em>
                    </MenuItem>
                    {LANDING_WAITLIST_PARTNER_TYPES.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  disabled={waitlistSubmitting}
                  sx={{
                    textTransform: "none",
                    bgcolor: "#FFC107",
                    color: "#fff",
                    py: 1.5,
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#e6ac00" },
                  }}
                >
                  {waitlistSubmitting ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Join Waitlist"
                  )}
                </Button>
              </Stack>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}

