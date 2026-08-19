"use client";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import SendIcon from "@mui/icons-material/Send";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

const DISBURSEMENT_MODE_KEY = "disbursement_mode";

function getDisbursementMode(): "dev" | "live" {
  if (typeof window === "undefined") return "dev";
  return (localStorage.getItem(DISBURSEMENT_MODE_KEY) as "dev" | "live") || "dev";
}

function setDisbursementMode(mode: "dev" | "live") {
  localStorage.setItem(DISBURSEMENT_MODE_KEY, mode);
}
import { motion } from "framer-motion";

import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import {
  useProvidersForDisbursement,
  useDisbursement,
  useCompanyBalance,
} from "../../../lib/queries";
function formatMoney(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function DisbursementPage() {
  const [search, setSearch] = useState("");
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mode, setMode] = useState<"dev" | "live">(() => getDisbursementMode());

  const isDevMode = mode === "dev";

  const handleModeChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const newMode = checked ? "dev" : "live";
    setMode(newMode);
    setDisbursementMode(newMode);
  };

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProvidersForDisbursement();
  const disbursementMutation = useDisbursement();
  const { data: companyBalance } = useCompanyBalance();

  const providers = data?.providers ?? [];

  const filtered = useMemo(() => {
    if (!search.trim()) return providers;
    const q = search.trim().toLowerCase();
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.providerNumber ?? "").toLowerCase().includes(q) ||
        (p.email ?? "").toLowerCase().includes(q)
    );
  }, [providers, search]);

  const withBalance = useMemo(
    () => filtered.filter((p) => (p.balance ?? 0) > 0),
    [filtered]
  );
  const allForDisplay = filtered;

  const selected = useMemo(() => {
    return withBalance.filter((p) => {
      const amt = parseFloat(amounts[p.id] ?? "0");
      return amt > 0 && amt <= (p.balance ?? 0);
    });
  }, [withBalance, amounts]);

  const totalToPay = useMemo(() => {
    return selected.reduce((sum, p) => sum + (parseFloat(amounts[p.id] ?? "0") || 0), 0);
  }, [selected, amounts]);

  const setAmount = (providerId: string, value: string) => {
    setAmounts((prev) => ({ ...prev, [providerId]: value }));
  };

  const handlePay = () => {
    if (selected.length === 0) return;
    const transfers = selected.map((p) => ({
      providerId: p.id,
      amount: parseFloat(amounts[p.id] ?? "0"),
    }));
    disbursementMutation.mutate(
      { transfers, currency: "NGN", simulate: isDevMode },
      {
        onSuccess: () => {
          setAmounts({});
          setConfirmOpen(false);
        },
      }
    );
  };

  const incompleteBank = withBalance.filter((p) => !p.hasBankDetails);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0}}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <DashboardHeader search={search} onSearchChange={setSearch} />

      <Box
        sx={{
          background: "#ffffff",
          borderRadius: { xs: 2, md: 2 },
          padding: { xs: 1.5, md: 3.5 },
          paddingBottom: { xs: 3, md: 4 },
          marginTop: { xs: 1, md: 3 },
          minHeight: { xs: "auto", md: "calc(100vh - 220px)" },
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack spacing={2}>
          <Box
            sx={{
              borderRadius: 3,
              padding: 2,
              backgroundColor: "#f3f3f3",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1}
              sx={{ marginBottom: 2, paddingTop: 2, paddingLeft: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                DISBURSEMENT
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Tooltip
                  title={
                    isDevMode
                      ? "Dev mode: Simulates success without calling BudPay. Deductions apply locally."
                      : "Live mode: Real BudPay transfers. Real money will be sent."
                  }
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isDevMode}
                        onChange={handleModeChange}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={600} sx={{ color: isDevMode ? "#b45309" : "#0b7b4c" }}>
                        {isDevMode ? "Dev" : "Live"}
                      </Typography>
                    }
                  />
                </Tooltip>
                <IconButton
                  size="small"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  aria-label="Refresh"
                >
                  <RefreshIcon />
                </IconButton>
              </Stack>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, px: 2 }}>
              Pay providers via BudPay bulk transfer. Select providers and enter amounts to disburse.
              Amounts are deducted from company balance and from each provider&apos;s amount owed.
            </Typography>

            {companyBalance != null && (
              <Box sx={{ mx: 2, mb: 2, p: 1.5, borderRadius: 2, bgcolor: "#e8f5ef" }}>
                <Typography variant="caption" color="text.secondary">
                  Company balance available
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ color: "#0b7b4c" }}>
                  {formatMoney(companyBalance.balance ?? 0)}
                </Typography>
              </Box>
            )}

            {incompleteBank.length > 0 && (
              <Alert
                severity="warning"
                icon={<WarningAmberIcon />}
                sx={{ mx: 2, mb: 2 }}
              >
                {incompleteBank.length} provider(s) with balance have incomplete bank details
                (account number, bank name, bank code). Update them in the Providers section to enable payouts.
              </Alert>
            )}

            {disbursementMutation.isError && (
              <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
                {(disbursementMutation.error as Error).message}
              </Alert>
            )}

            {disbursementMutation.isSuccess && (
              <Alert
                severity="success"
                icon={<CheckCircleOutlineIcon />}
                sx={{ mx: 2, mb: 2 }}
              >
                {isDevMode
                  ? "Dev mode: Disbursement simulated successfully. Deductions applied locally."
                  : "Disbursement queued successfully. Transfers are being processed by BudPay."}
              </Alert>
            )}

            {/* Table header */}
            <Box
              sx={{
                fontSize: 12,
                color: "text.secondary",
                marginBottom: 1,
                backgroundColor: "#fff",
                borderRadius: 999,
                paddingY: 1.2,
                paddingX: 3,
                display: { xs: "none", md: "grid" },
                gridTemplateColumns: { md: "1.5fr 1fr 1fr 1fr 1.2fr" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box>Provider</Box>
              <Box>Balance owed</Box>
              <Box>Total paid</Box>
              <Box>Amount to pay</Box>
              <Box />
            </Box>

            <Box sx={{ marginTop: 1 }}>
              {isLoading ? (
                <Stack alignItems="center" py={4}>
                  <CircularProgress sx={{ color: "#0b7b4c" }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Loading providers...
                  </Typography>
                </Stack>
              ) : isError ? (
                <Stack alignItems="center" py={4} spacing={2}>
                  <Typography color="error">{(error as Error).message}</Typography>
                  <Button variant="outlined" onClick={() => refetch()} size="small">
                    Retry
                  </Button>
                </Stack>
              ) : allForDisplay.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                  No providers yet.
                </Typography>
              ) : (
                <Stack spacing={0}>
                  {allForDisplay.map((p) => {
                    const canPay = p.hasBankDetails;
                    const balance = p.balance ?? 0;
                    const totalPaid = p.totalPaid ?? 0;
                    const amtStr = amounts[p.id] ?? "";
                    const amt = parseFloat(amtStr) || 0;
                    const valid = amt > 0 && amt <= balance;

                    return (
                      <Box
                        key={p.id}
                        sx={{
                          paddingY: 2,
                          paddingX: { xs: 2, md: 3 },
                          borderBottom: "1px solid #f3f3f3",
                          display: { xs: "flex", md: "grid" },
                          flexDirection: { xs: "column", md: "unset" },
                          gridTemplateColumns: { md: "1.5fr 1fr 1fr 1fr 1.2fr" },
                          alignItems: "center",
                          gap: { xs: 1, md: 1 },
                          backgroundColor: "#ffffff",
                          borderRadius: 1,
                          opacity: canPay ? 1 : 0.7,
                          "&:hover": { backgroundColor: "#fafafa" },
                        }}
                      >
                        <Stack spacing={0.2}>
                          <Typography variant="body2" fontWeight={600}>
                            {p.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {p.providerNumber} · {p.bankName ?? "—"} {p.accountNumber ?? ""}
                          </Typography>
                          {!canPay && (
                            <Typography variant="caption" color="warning.main">
                              Incomplete bank details
                            </Typography>
                          )}
                        </Stack>

                        <Typography variant="body2" fontWeight={600} sx={{ color: "#0b7b4c" }}>
                          {formatMoney(balance)}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {formatMoney(totalPaid)}
                        </Typography>

                        <TextField
                          size="small"
                          type="number"
                          placeholder="0"
                          value={amtStr}
                          onChange={(e) => setAmount(p.id, e.target.value)}
                          disabled={!canPay}
                          inputProps={{
                            min: 0,
                            max: balance,
                            step: 0.01,
                          }}
                          sx={{ maxWidth: 160 }}
                          helperText={
                            amt > balance ? "Exceeds balance" : ""
                          }
                          error={amt > balance}
                        />

                        <Box />
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>

            {selected.length > 0 && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: 3, px: 2, py: 2, backgroundColor: "#e8f5e9", borderRadius: 2 }}
              >
                <Typography variant="body1" fontWeight={700}>
                  {selected.length} provider(s) · Total: {formatMoney(totalToPay)}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={
                    disbursementMutation.isPending ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <SendIcon />
                    )
                  }
                  onClick={() => setConfirmOpen(true)}
                  disabled={disbursementMutation.isPending}
                  sx={{ backgroundColor: isDevMode ? "#b45309" : "#0b7b4c" }}
                >
                  {disbursementMutation.isPending
                    ? "Processing..."
                    : isDevMode
                      ? "Simulate pay (Dev)"
                      : "Pay via BudPay (Live)"}
                </Button>
              </Stack>
            )}
          </Box>
        </Stack>
      </Box>

      {/* Confirm dialog */}
      {confirmOpen && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
          }}
          onClick={() => !disbursementMutation.isPending && setConfirmOpen(false)}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              padding: 3,
              maxWidth: 400,
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {isDevMode ? "Confirm simulated disbursement (Dev)" : "Confirm disbursement"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {isDevMode ? (
                <>
                  Simulate paying {selected.length} provider(s) a total of {formatMoney(totalToPay)}.
                  No real BudPay transfer. Deductions will apply to company balance and provider owed amounts. Continue?
                </>
              ) : (
                <>
                  You are about to pay {selected.length} provider(s) a total of {formatMoney(totalToPay)}
                  via BudPay. Real money will be sent. This will deduct from their balance. Continue?
                </>
              )}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button onClick={() => setConfirmOpen(false)} disabled={disbursementMutation.isPending}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handlePay}
                disabled={disbursementMutation.isPending}
                sx={{ backgroundColor: "#0b7b4c" }}
              >
                {disbursementMutation.isPending ? "Processing..." : "Confirm"}
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
