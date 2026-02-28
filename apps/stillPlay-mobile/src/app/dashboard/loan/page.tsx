"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import useAuthStore from "@/store/useAuthStore";
import { getLoanEligibility, requestLoan } from "@/lib/api";

const INTEREST_RATE = 0.3; // 30%

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(n);
}

function statusColor(status: string): "warning" | "info" | "error" | "success" {
  if (status === "PENDING") return "warning";
  if (status === "APPROVED") return "info";
  if (status === "DISBURSED") return "error";
  return "success";
}

export default function LoanRequestPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const userId = user?.id ?? "";

  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // ── Eligibility ────────────────────────────────────────────────────────────
  const {
    data: eligibility,
    isLoading: eligibilityLoading,
    error: eligibilityError,
  } = useQuery({
    queryKey: ["loan-eligibility", userId],
    queryFn: () => getLoanEligibility(token!, userId),
    enabled: !!token && !!userId,
    staleTime: 30 * 1000,
  });

  const maxAmount = eligibility?.availableAmount ?? 0;
  const numericAmount = Math.min(Number(amount || 0), maxAmount);
  const repaymentAmount = numericAmount * (1 + INTEREST_RATE);

  const amountError =
    amount && Number(amount) > maxAmount
      ? `Maximum you can borrow is ${formatCurrency(maxAmount)}`
      : Number(amount) < 0
        ? "Amount must be positive"
        : null;

  const canSubmit =
    !!eligibility?.canRequest &&
    numericAmount > 0 &&
    numericAmount <= maxAmount &&
    !amountError;

  // ── Request mutation ───────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: () =>
      requestLoan(token!, {
        userId,
        amount: numericAmount,
        purpose: purpose.trim() || undefined,
      }),
    onSuccess: () => {
      setIsConfirmOpen(false);
      router.push("/dashboard/loan/success");
    },
  });

  // ── Loading state ──────────────────────────────────────────────────────────
  if (eligibilityLoading) {
    return (
      <Box className="screen-content" sx={{ backgroundColor: "#F5F5F5", p: 3 }}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton onClick={() => router.back()} sx={{ borderRadius: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700}>Request a loan</Typography>
          </Stack>
          <Skeleton height={120} sx={{ borderRadius: 2 }} />
          <Skeleton height={80} sx={{ borderRadius: 2 }} />
          <Skeleton height={56} sx={{ borderRadius: 2 }} />
        </Stack>
      </Box>
    );
  }

  // ── Blocked state ──────────────────────────────────────────────────────────
  if (!eligibilityLoading && eligibility && !eligibility.canRequest) {
    const loan = eligibility.activeLoan;
    return (
      <Box className="screen-content" sx={{ backgroundColor: "#F5F5F5" }}>
        <Stack sx={{ p: 3 }} spacing={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton onClick={() => router.back()} sx={{ borderRadius: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700}>Request a loan</Typography>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              p: 3,
              border: "1.5px solid #FFCDD2",
              backgroundColor: "#FFF5F5",
              textAlign: "center",
            }}
          >
            <BlockIcon sx={{ fontSize: 48, color: "error.main", mb: 1 }} />
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Loan not available
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {eligibility.reason}
            </Typography>
          </Paper>

          {loan && (
            <Paper elevation={0} sx={{ borderRadius: 3, p: 2.5, border: "1px solid #E0E0E0" }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                Current loan
              </Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    label={loan.status}
                    size="small"
                    color={statusColor(loan.status)}
                    sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                  />
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Loan amount</Typography>
                  <Typography variant="body2" fontWeight={600}>{formatCurrency(loan.amount)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Amount repaid</Typography>
                  <Typography variant="body2" fontWeight={600} color="success.main">
                    {formatCurrency(loan.amountRepaid)}
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Outstanding balance</Typography>
                  <Typography variant="body2" fontWeight={700} color="error.main">
                    {formatCurrency(loan.remaining)}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={() => router.push("/dashboard/repayment")}
            sx={{ borderRadius: 999, py: 1.4, textTransform: "none", fontWeight: 700 }}
          >
            Make a repayment
          </Button>
        </Stack>
      </Box>
    );
  }

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <Box className="screen-content" sx={{ backgroundColor: "#F5F5F5" }}>
      <Stack sx={{ p: 3 }} spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={() => router.back()} sx={{ borderRadius: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>Request a loan</Typography>
        </Stack>

        {/* Eligibility banner */}
        {eligibility && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              p: 2,
              backgroundColor: "#E8F5EF",
              border: "1px solid #C8E6C9",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <CheckCircleOutlineIcon sx={{ color: "success.main", mt: 0.2 }} />
              <Box>
                <Typography variant="body2" fontWeight={700} color="success.dark">
                  You are eligible
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {eligibility.reason ??
                    `You can borrow up to ${formatCurrency(eligibility.availableAmount)}`}
                </Typography>
                {eligibility.activeLoan && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                    Outstanding balance: {formatCurrency(eligibility.activeLoan.remaining)}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Paper>
        )}

        {eligibilityError && (
          <Alert severity="warning" icon={<InfoOutlinedIcon />}>
            Could not load eligibility. Using default limit of ₦5,000.
          </Alert>
        )}

        <Stack spacing={0.5} alignItems="center">
          <Typography fontWeight={700}>Enter Amount</Typography>
          <Typography variant="body2" color="text.secondary">
            Your loan limit is {formatCurrency(maxAmount || 5000)}
          </Typography>
        </Stack>

        {/* Amount input */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: `1.5px solid ${amountError ? "#F44336" : "#2DAF63"}`,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">Request amount</Typography>
            <TextField
              variant="standard"
              value={amount}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setAmount(raw);
              }}
              slotProps={{
                input: {
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">₦</InputAdornment>
                  ),
                  sx: { fontSize: 22, fontWeight: 700 },
                },
                htmlInput: { inputMode: "numeric" },
              }}
              fullWidth
              error={!!amountError}
            />
            {amountError && (
              <Typography variant="caption" color="error.main" sx={{ mt: 0.5 }}>
                {amountError}
              </Typography>
            )}
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">To pay back (30% interest)</Typography>
            <Typography fontWeight={700} fontSize={18}>
              {formatCurrency(repaymentAmount)}
            </Typography>
          </Box>
        </Paper>

        {/* Purpose (optional) */}
        <TextField
          label="Purpose (optional)"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="e.g. Medical, School fees, Business"
          fullWidth
          multiline
          rows={2}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
          }}
        />

        <Box sx={{ mt: "auto" }}>
          <Button
            fullWidth
            variant="contained"
            disabled={!canSubmit}
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

      {/* Confirmation dialog */}
      <Dialog
        open={isConfirmOpen}
        onClose={() => !mutation.isPending && setIsConfirmOpen(false)}
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, px: 2, py: 1.5 } }}
      >
        <DialogContent>
          <Stack spacing={3} alignItems="center" sx={{ textAlign: "center" }}>
            <Typography variant="h6" fontWeight={700}>Confirm loan request</Typography>

            <Stack spacing={1.5} sx={{ width: "100%" }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Amount</Typography>
                <Typography fontWeight={600}>{formatCurrency(numericAmount)}</Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Interest (30%)</Typography>
                <Typography fontWeight={600}>{formatCurrency(numericAmount * INTEREST_RATE)}</Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Total to pay</Typography>
                <Typography fontWeight={700} color="error.main">{formatCurrency(repaymentAmount)}</Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Duration</Typography>
                <Typography fontWeight={600}>5 days</Typography>
              </Stack>
              {purpose.trim() && (
                <>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography color="text.secondary">Purpose</Typography>
                    <Typography fontWeight={600} sx={{ maxWidth: "60%", textAlign: "right" }}>
                      {purpose.trim()}
                    </Typography>
                  </Stack>
                </>
              )}
            </Stack>

            {mutation.isError && (
              <Alert severity="error" sx={{ width: "100%" }}>
                {(mutation.error as Error).message}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate()}
              sx={{
                borderRadius: 999,
                py: 1.4,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              {mutation.isPending ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={18} color="inherit" />
                  <span>Submitting...</span>
                </Stack>
              ) : (
                "Confirm"
              )}
            </Button>

            <Button
              fullWidth
              variant="text"
              disabled={mutation.isPending}
              onClick={() => setIsConfirmOpen(false)}
              sx={{ textTransform: "none", color: "text.secondary" }}
            >
              Cancel
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
