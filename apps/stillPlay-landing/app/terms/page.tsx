"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function TermsPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Terms and Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Last updated: {new Date().toLocaleDateString("en-NG")}
        </Typography>

        <Stack spacing={4}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              By accessing or using the StillPlay mobile application and services,
              you agree to be bound by these Terms and Conditions. If you do not
              agree, do not use our services.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              2. Eligibility
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              You must be at least 18 years old and a resident of Nigeria to use
              StillPlay. You must provide accurate information during registration
              and verification.

            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              3. Loan Services
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              StillPlay provides short-term credit services. Loan amounts, interest
              rates, and repayment terms are disclosed at the time of application.
              You are responsible for repaying loans on time. Late or missed
              payments may result in fees and affect your eligibility for future
              loans.

            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              4. Verification
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              You must complete identity verification (NIN, selfie)
              before accessing loan services. We reserve the right to reject
              applications or suspend accounts if verification fails or if we
              suspect fraud.

            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              5. Prohibited Use
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              You may not use our services for any illegal purpose, to provide
              false information, or to circumvent our systems. We may suspend or
              terminate your account for violations.

            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              6. Intellectual Property
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              All content, features, and functionality of the StillPlay app are
              owned by us and protected by intellectual property laws. You may not
              copy, modify, or distribute our materials without permission.

            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              7. Limitation of Liability
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              StillPlay is provided &quot;as is&quot;. We do not guarantee uninterrupted
              access or error-free operation. To the fullest extent permitted by
              law, we are not liable for indirect, incidental, or consequential
              damages arising from your use of our services.

            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              8. Changes
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We may update these Terms from time to time. Continued use of our
              services after changes constitutes acceptance of the updated Terms.

            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              9. Contact
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              For questions about these Terms, contact us at support@stillplay.app
              or through the in-app chat support.

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
