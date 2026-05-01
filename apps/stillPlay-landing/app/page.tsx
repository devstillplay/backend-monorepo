"use client";

import {
  Alert,
  Box,
  Button,
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
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import {
  COMPANY_NAME,
  MOBILE_APP_URL,
  PARTNERSHIP_EMAIL,
} from "../lib/config";
import { joinWaitlist } from "../lib/waitlist";

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

const BETTING_PLATFORMS = [
  { label: "SportyBet", src: "/assets/png/sportyBet.png", link: "https://www.sportybet.com" },
  { label: "BetKing", src: "/assets/png/betKing.png", link: "https://www.betking.com" },
  { label: "Bet9ja", src: "/assets/png/bet9ja.png", link: "https://www.bet9ja.com" },
  { label: "NairaBet", src: "/assets/png/nairaBet.png", link: "https://www.nairabet.com" },
];

const USER_SOCIAL_PROOF = [
  { metric: "4.8/5", label: "Average beta satisfaction score" },
  { metric: "< 2 mins", label: "Average credit request completion time" },
  { metric: "90%+", label: "Users say flow is clear and easy to use" },
];

const PARTNER_SOCIAL_PROOF = [
  "Built to plug into existing betting platform journeys with API-first integrations.",
  "Risk and repayment visibility designed for finance and liquidity stakeholders.",
  "Transparent performance monitoring for operational and investment teams.",
];

const LANDING_FAQ_ITEMS = [
  {
    question: "What is Still Play?",
    answer:
      "Still Play is a prediction-market credit platform that helps verified users access short-term betting credit in a transparent flow.",
  },
  {
    question: "How quickly can I get started?",
    answer:
      "You can join the waitlist in under a minute. Early users get priority onboarding once access opens.",
  },
  {
    question: "Is there a live product demo?",
    answer:
      "Yes. Use the demo button in the navigation or hero section to preview the product experience.",
  },
  {
    question: "How do partnerships work?",
    answer:
      "We work with betting operators and financial/liquidity partners through structured integrations and onboarding.",
  },
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
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);

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

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError(null);
    setNewsletterSubmitting(true);
    try {
      await joinWaitlist({
        fullName: "Newsletter subscriber",
        email: newsletterEmail.trim(),
        source: "landing",
      });
      setNewsletterSubmitted(true);
    } catch (err) {
      setNewsletterError(
        err instanceof Error ? err.message : "Could not subscribe right now."
      );
    } finally {
      setNewsletterSubmitting(false);
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

      {/* Social proof for users */}
      <Box component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: "#f5f8f7" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 2, color: "#1a1a1a", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            Trusted by early users
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", maxWidth: 640, mx: "auto", mb: 5, color: "#4a4a4a" }}>
            Social proof for bettors and retail users looking for clear, fast access and confidence in every request.
          </Typography>
          <Grid container spacing={3}>
            {USER_SOCIAL_PROOF.map((item) => (
              <Grid item xs={12} sm={4} key={item.label}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "white",
                    border: "1px solid rgba(0,0,0,0.08)",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ color: "#0b7b4c", fontWeight: 800, mb: 0.75 }}>
                    {item.metric}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4a4a4a" }}>{item.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How it works (with sign-up CTA) */}
      <Box id="how-it-works" component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 2, color: "#1a1a1a", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            How it works
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 6, color: "#4a4a4a" }}>
            A simple path from discovery to responsible credit use.
          </Typography>
          <Grid container spacing={4}>
            {HOW_IT_WORKS.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.step}>
                <Box sx={{ textAlign: "center" }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "#FFC107", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.5rem", mx: "auto", mb: 2 }}>
                    {item.step}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#1a1a1a" }}>{item.title}</Typography>
                  <Typography variant="body2" sx={{ color: "#4a4a4a" }}>{item.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Button
              component={Link}
              href="#waitlist"
              variant="contained"
              sx={{
                textTransform: "none",
                bgcolor: "#FFC107",
                color: "#fff",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                "&:hover": { bgcolor: "#e6ac00" },
              }}
            >
              Start with early access
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Product in use / demo section */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 1, color: "#1a1a1a", fontSize: { xs: "1.35rem", sm: "1.5rem", md: "2rem" } }}>
            See Still Play in action
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 6, color: "#4a4a4a" }}>
            Explore the live flow before you join.
          </Typography>
          <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 4 }, borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)", bgcolor: "#f8faf9" }}>
            <Typography variant="body1" sx={{ textAlign: "center", color: "#4a4a4a", mb: 3 }}>
              Preview the user journey from request to settlement and understand the value before signing up.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button component="a" href={MOBILE_APP_URL} target="_blank" rel="noopener noreferrer" variant="outlined" sx={{ textTransform: "none", borderColor: "#0b7b4c", color: "#0b7b4c", px: 4, py: 1.2, borderRadius: 2 }}>
                Open Demo
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Social proof for partners */}
      <Box component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: "#0b7b4c" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 2, color: "white", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            Trusted for partnerships
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", maxWidth: 680, mx: "auto", mb: 6, color: "rgba(255,255,255,0.9)" }}>
            Social proof for operators, finance teams, and institutional partners evaluating market-fit and operational quality.
          </Typography>
          <Grid container spacing={3}>
            {PARTNER_SOCIAL_PROOF.map((item) => (
              <Grid item xs={12} md={4} key={item}>
                <Box sx={{ p: 3, borderRadius: 2, bgcolor: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)", height: "100%" }}>
                  <Typography variant="body2" sx={{ color: "white" }}>{item}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Partners section */}
      <Box id="partners" component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 2, color: "#1a1a1a", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            Partners
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", maxWidth: 640, mx: "auto", mb: 6, color: "#4a4a4a" }}>
            We partner with betting operators and financial institutions to deliver responsible access at scale.
          </Typography>
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
            {BETTING_PLATFORMS.map((platform) => (
              <Grid item xs={12} sm={6} md={3} key={platform.label}>
                <Box component="a" href={platform.link} target="_blank" rel="noopener noreferrer" sx={{ display: "block", aspectRatio: "16/10", borderRadius: 2, overflow: "hidden", bgcolor: "white", textDecoration: "none", border: "1px solid rgba(0,0,0,0.08)", "&:hover": { opacity: 0.95 } }}>
                  <Box component="img" src={platform.src} alt={platform.label} sx={{ width: "100%", height: "100%", objectFit: "contain", p: 1.5 }} />
                </Box>
              </Grid>
            ))}
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

      {/* FAQ section */}
      <Box id="faq-preview" component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: "#f8f9fa" }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 2, color: "#1a1a1a", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            Frequently asked questions
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 5, color: "#4a4a4a" }}>
            Clear answers for new users and potential partners.
          </Typography>
          <Stack spacing={2}>
            {LANDING_FAQ_ITEMS.map((item) => (
              <Box key={item.question} sx={{ p: 2.5, borderRadius: 2, bgcolor: "white", border: "1px solid rgba(0,0,0,0.08)" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1a1a1a", mb: 0.75 }}>
                  {item.question}
                </Typography>
                <Typography variant="body2" sx={{ color: "#4a4a4a" }}>{item.answer}</Typography>
              </Box>
            ))}
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button component={Link} href="/faq" sx={{ textTransform: "none", color: "#0b7b4c", fontWeight: 600 }}>
              Read full FAQ
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Newsletter section */}
      <Box component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: "#FFC107" }}>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 1, color: "#1a1a1a", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            Stay in the loop
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 4, color: "#4a4a4a" }}>
            Get product updates, launch news, and conversion-focused content.
          </Typography>
          {newsletterSubmitted ? (
            <Typography variant="body1" sx={{ textAlign: "center", color: "#1a1a1a" }}>
              You&apos;re subscribed. We&apos;ll send updates soon.
            </Typography>
          ) : (
            <Box component="form" onSubmit={handleNewsletterSubmit} sx={{ p: 3, borderRadius: 2, bgcolor: "white", border: "1px solid rgba(0,0,0,0.12)" }}>
              <Stack spacing={2}>
                {newsletterError ? <Alert severity="error" onClose={() => setNewsletterError(null)}>{newsletterError}</Alert> : null}
                <TextField fullWidth required type="email" label="Email address" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} />
                <Button type="submit" disabled={newsletterSubmitting} sx={{ textTransform: "none", bgcolor: "#0b7b4c", color: "#fff", py: 1.25, fontWeight: 600, "&:hover": { bgcolor: "#0a6b3a" } }}>
                  {newsletterSubmitting ? <CircularProgress size={22} color="inherit" /> : "Subscribe"}
                </Button>
              </Stack>
            </Box>
          )}
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

