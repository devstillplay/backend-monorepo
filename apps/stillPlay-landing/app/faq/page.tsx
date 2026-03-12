"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { COMPANY_LEGAL_NAME, RC_NUMBER, SUPPORT_EMAIL } from "../../lib/config";

const FAQ_ITEMS = [
  {
    question: "What is Still Play?",
    answer: `Still Play is a Fintech platform that provides instant betting credit to verified sports users, delivered directly into their betting wallets through secure integrations with licensed betting operators. Still Play is a product owned and operated by ${COMPANY_LEGAL_NAME} (RC ${RC_NUMBER}).`,
  },
  {
    question: "How do I receive funds?",
    answer:
      "Credit is delivered directly into your betting wallet through our integration with licensed betting platforms. Once approved, funds are available instantly for use on your preferred betting platform.",
  },
  {
    question: "Can I withdraw to my bank?",
    answer:
      "Still Play provides betting credit for use within betting wallets. Withdrawal options depend on your betting platform's policies. Repayments can be made through wallet deposits, our web app, or partner locations.",
  },
  {
    question: "How much credit can I access?",
    answer:
      "Credit limits are determined by your eligibility profile, repayment history, and platform guidelines. Limits may increase with consistent responsible usage and on-time repayments.",
  },
  {
    question: "How do repayments work?",
    answer:
      "Repayments can be made through wallet deposits, our web app, or betting shop partner locations. You'll see repayment terms, including fees and schedules, before accepting any credit.",
  },
  {
    question: "Does using Still Play affect my credit profile?",
    answer:
      "Responsible usage and timely repayments can contribute to building your financial reputation. Still Play is designed to help users demonstrate creditworthiness through structured credit access.",
  },
  {
    question: "Is Still Play available now?",
    answer:
      "Still Play is currently in launch preparation. Join our waitlist to receive priority access when we go live. Early users get faster credit eligibility review and early feature access.",
  },
  {
    question: "Is Still Play safe?",
    answer:
      "Yes. Still Play uses industry-standard security protocols, encrypted transactions, and a privacy-first approach to protect your data. We integrate only with licensed betting operators and regulated financial partners.",
  },
  {
    question: "Who operates Still Play?",
    answer: `Still Play is developed and operated by ${COMPANY_LEGAL_NAME}, a registered Nigerian company (RC ${RC_NUMBER}) committed to building financial infrastructure for underserved markets.`,
  },
];

export default function FAQPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* FAQ Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#fff" }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, textAlign: "center", mb: 1, color: "#1a1a1a" }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 6, color: "#4a4a4a" }}>
            Everything you need to know about Still Play
          </Typography>

          <Box sx={{ "& .MuiAccordion-root": { boxShadow: "none", "&:before": { display: "none" } } }}>
            {FAQ_ITEMS.map((item, index) => (
              <Accordion
                key={item.question}
                defaultExpanded={index === 0}
                sx={{
                  mb: 1.5,
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "#f8f9fa",
                  border: "1px solid rgba(0,0,0,0.08)",
                  "&.Mui-expanded": { margin: 0, marginBottom: 1.5 },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#4a4a4a" }} />}
                  sx={{
                    "& .MuiAccordionSummary-content": { my: 2 },
                    "&.Mui-expanded": { minHeight: 48 },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2, px: 3 }}>
                  <Typography variant="body2" sx={{ color: "#4a4a4a", lineHeight: 1.7 }}>
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#f5f5f5" }}>
        <Container maxWidth="sm">
          <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center", mb: 1, color: "#1a1a1a" }}>
            Still have questions?
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 3, color: "#4a4a4a" }}>
            Get in touch with our support team.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              component="a"
              href={`mailto:${SUPPORT_EMAIL}`}
              sx={{
                textTransform: "none",
                bgcolor: "#FFC107",
                color: "#1a1a1a",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": { bgcolor: "#e6ac00" },
              }}
            >
              Contact Support
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
