"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Privacy Policy
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Last updated: {new Date().toLocaleDateString("en-NG")}
        </Typography>

        <Stack spacing={4}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              1. Introduction
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              StillPlay (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our mobile application and
              related services.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              2. Information We Collect
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We may collect the following types of information:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 3 }}>
              <li>Personal identification information (name, email, phone number)</li>
              <li>National Identification Number (NIN) for verification</li>
              <li>Selfie and identity documents for verification</li>
              <li>Financial information related to loans and repayments</li>
              <li>Device information and usage data</li>
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              3. How We Use Your Information
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We use your information to:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 3 }}>
              <li>Verify your identity and process loan applications</li>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related communications</li>
              <li>Send you notifications about your account and loans</li>
              <li>Respond to your support requests</li>
              <li>Comply with legal obligations</li>
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              4. Data Security
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access, alteration,
              disclosure, or destruction.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              5. Data Sharing
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We do not sell your personal information. We may share your data with
              trusted third parties who assist us in operating our services (e.g.,
              payment processors, identity verification providers) and when required
              by law.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              6. Your Rights
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              You have the right to access, correct, or delete your personal data.
              You may also withdraw consent where applicable. Contact us to exercise
              these rights.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              7. Contact Us
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              If you have questions about this Privacy Policy, please contact us at
              support@stillplay.app or through the in-app chat support.
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 6 }}>
          <Button variant="contained" component={Link} href="/">
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
