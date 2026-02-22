"use client";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoanRequestPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("500");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const numericAmount = Number(amount || 0);
  const repaymentAmount = numericAmount * 1.3;

  return (
    <Box
      className="screen-content"
      sx={{ backgroundColor: "#F5F5F5", flex: 1 }}
    >
      <Stack sx={{ p: 3, flex: 1 }} spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            aria-label="Back"
            onClick={() => router.back()}
            sx={{ borderRadius: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>
            Request a loan
          </Typography>
        </Stack>

        <Stack spacing={0.5} alignItems="center">
          <Typography fontWeight={700}>Enter Amount</Typography>
          <Typography variant="body2" color="text.secondary">
            Your loan limit is N5,000
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 1.5,
            border: "1px solid #2DAF63",
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Request amount
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <TextField
                variant="standard"
                value={amount}
                onChange={(event) => {
                  const raw = event.target.value.replace(/[^0-9]/g, "");
                  setAmount(raw || "0");
                }}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">N</InputAdornment>
                  ),
                  sx: { fontSize: 20, fontWeight: 700 },
                }}
                inputProps={{ inputMode: "numeric" }}
              />
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              To Pay
            </Typography>
            <Typography fontWeight={700} fontSize={20}>
              N{repaymentAmount.toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        <Typography variant="body2" color="error.main" textAlign="center">
          Your loan limit is N5,000
        </Typography>

        <Box sx={{ mt: "auto" }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setIsConfirmOpen(true)}
            sx={{
              borderRadius: 999,
              py: 1.4,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Continue
          </Button>
        </Box>
      </Stack>

      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            px: 2,
            py: 1.5,
          },
        }}
      >
        <DialogContent>
          <Stack spacing={3} alignItems="center" sx={{ textAlign: "center" }}>
            <Typography variant="h6" fontWeight={700}>
              Confirm loan request
            </Typography>

            <Stack spacing={2} sx={{ width: "100%" }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography color="text.secondary">Amount</Typography>
                <Typography fontWeight={600}>
                  N{numericAmount.toFixed(2)}
                </Typography>
              </Stack>
              <Divider />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography color="text.secondary">To pay</Typography>
                <Typography fontWeight={600}>
                  N{repaymentAmount.toFixed(2)}
                </Typography>
              </Stack>
              <Divider />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography color="text.secondary">Duration</Typography>
                <Typography fontWeight={600}>5days</Typography>
              </Stack>
            </Stack>

            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setIsConfirmOpen(false);
                router.push("/dashboard/loan/success");
              }}
              sx={{
                borderRadius: 999,
                py: 1.4,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Confirm
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
