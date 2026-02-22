import { Box, Stack, Typography } from "@mui/material";

export default function RepaymentPage() {
  return (
    <Box sx={{ flex: 1 }}>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Repayment
        </Typography>
        <Typography color="text.secondary">
          Review repayments, schedules, and recent transfers.
        </Typography>
      </Stack>
    </Box>
  );
}
