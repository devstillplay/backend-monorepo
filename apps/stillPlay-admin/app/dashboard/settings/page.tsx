"use client";

import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PublicIcon from "@mui/icons-material/Public";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import MoneyIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentsIcon from "@mui/icons-material/Payments";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Skeleton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { useAdminActivity, useAppSettings, useSetAppSetting } from "../../../lib/queries";
import { isCustomerSupportRole, useAuthStore } from "../../../store/auth";
import { useUserStore } from "../../../store/user";

function formatLoginTime(ts: number | null): string {
  if (ts == null) return "—";
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatActivityTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function LoanSettingsTab() {
  const { data: settings, isLoading } = useAppSettings();
  const setAppSetting = useSetAppSetting();
  const [maxAmount, setMaxAmount] = useState("");
  const [interestPercent, setInterestPercent] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings?.loan_max_amount !== undefined) {
      setMaxAmount(settings.loan_max_amount);
    }
    if (settings?.loan_interest_percent !== undefined) {
      setInterestPercent(settings.loan_interest_percent);
    } else if (settings && settings.loan_interest_percent === undefined) {
      setInterestPercent("30");
    }
  }, [settings]);

  const handleSave = async () => {
    const val = Number(maxAmount);
    const pct = Number(interestPercent);
    if (!maxAmount || isNaN(val) || val <= 0) return;
    if (interestPercent === "" || isNaN(pct) || pct < 0 || pct >= 100) return;
    try {
      await setAppSetting.mutateAsync({ key: "loan_max_amount", value: String(val) });
      await setAppSetting.mutateAsync({
        key: "loan_interest_percent",
        value: String(pct),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      /* error surfaced via setAppSetting.isError */
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, maxWidth: 480, width: "100%" }}
    >
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <MoneyIcon sx={{ color: "primary.main", fontSize: 28 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Maximum loan amount
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sets the highest amount a user can request in a single loan.
            </Typography>
          </Box>
        </Stack>

        {isLoading ? (
          <>
            <Skeleton height={56} />
            <Skeleton height={56} />
          </>
        ) : (
          <>
            <TextField
              label="Max loan amount (₦)"
              value={maxAmount}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setMaxAmount(raw);
                setSaved(false);
              }}
              type="text"
              inputProps={{ inputMode: "numeric" }}
              InputProps={{
                startAdornment: <InputAdornment position="start">₦</InputAdornment>,
              }}
              helperText="Default is ₦5,000. Per-user credit limit still applies."
              fullWidth
            />
            <TextField
              label="Upfront interest (%)"
              value={interestPercent}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9.]/g, "");
                setInterestPercent(raw);
                setSaved(false);
              }}
              type="text"
              inputProps={{ inputMode: "decimal" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              helperText="Withheld from requested principal before the wallet is credited (default 30). Must be under 100."
              fullWidth
            />
          </>
        )}


        {setAppSetting.isError && (
          <Alert severity="error">
            {(setAppSetting.error as Error).message}
          </Alert>
        )}
        {saved && (
          <Alert severity="success">Loan settings saved successfully.</Alert>
        )}

        <Button
          variant="contained"
          onClick={() => void handleSave()}
          disabled={
            setAppSetting.isPending ||
            !maxAmount ||
            interestPercent === "" ||
            Number(interestPercent) < 0 ||
            Number(interestPercent) >= 100
          }
          sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 600 }}
        >
          {setAppSetting.isPending ? "Saving..." : "Save"}
        </Button>
      </Stack>
    </Paper>
  );
}

const PAYMENT_GATEWAYS = [
  { id: "budpay", label: "BudPay" },
  { id: "flutterwave", label: "Flutterwave" },
  { id: "paystack", label: "Paystack" },
] as const;

type GatewayId = (typeof PAYMENT_GATEWAYS)[number]["id"];

/**
 * UI for choosing repayment checkout provider + fallbacks (BudPay / Flutterwave / Paystack).
 * Persist + mobile/API routing will follow — no integration calls from this screen yet.
 */
function RepaymentSettingsTab() {
  const { data: settings, isLoading } = useAppSettings();
  const setAppSetting = useSetAppSetting();
  const [primaryGateway, setPrimaryGateway] = useState<GatewayId>("budpay");
  const [fallback1, setFallback1] = useState<string>("paystack");
  const [fallback2, setFallback2] = useState<string>("flutterwave");
  const [failoverNote, setFailoverNote] = useState("");
  const [saved, setSaved] = useState(false);

  const backupOptions = [
    { id: "", label: "None" },
    ...PAYMENT_GATEWAYS.map((g) => ({ id: g.id, label: g.label })),
  ];

  useEffect(() => {
    if (!settings) return;
    const rawPrimary = settings.repayment_primary_gateway;
    const rawFallback1 = settings.repayment_gateway_fallback_1;
    const rawFallback2 = settings.repayment_gateway_fallback_2;
    const rawNote = settings.repayment_gateway_failover_note;

    const isGatewayId = (value: string): value is GatewayId =>
      PAYMENT_GATEWAYS.some((g) => g.id === value);

    setPrimaryGateway(isGatewayId(rawPrimary) ? rawPrimary : "budpay");
    setFallback1(typeof rawFallback1 === "string" ? rawFallback1 : "paystack");
    setFallback2(typeof rawFallback2 === "string" ? rawFallback2 : "flutterwave");
    setFailoverNote(typeof rawNote === "string" ? rawNote : "");
  }, [settings]);

  const handleSave = async () => {
    try {
      await setAppSetting.mutateAsync({
        key: "repayment_primary_gateway",
        value: primaryGateway,
      });
      await setAppSetting.mutateAsync({
        key: "repayment_gateway_fallback_1",
        value: fallback1,
      });
      await setAppSetting.mutateAsync({
        key: "repayment_gateway_fallback_2",
        value: fallback2,
      });
      await setAppSetting.mutateAsync({
        key: "repayment_gateway_failover_note",
        value: failoverNote.trim(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // surfaced by setAppSetting.error
    }
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 560, width: "100%" }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="flex-start" spacing={2}>
            <PaymentsIcon sx={{ color: "primary.main", fontSize: 28, mt: 0.25 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Repayment payment gateways
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Choose which provider handles customer repayments first, and which to try next if the
                primary is unavailable (liquidity, downtime, or API errors). Reduces dependence on a single
                integration.
              </Typography>
            </Box>
          </Stack>

          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Primary gateway is used by the customer repayment page immediately after save.
            Flutterwave is currently marked pending in customer checkout.
          </Alert>

          <FormControl fullWidth>
            <InputLabel id="primary-gateway-label">Primary gateway</InputLabel>
            <Select
              labelId="primary-gateway-label"
              label="Primary gateway"
              value={primaryGateway}
              onChange={(e: SelectChangeEvent) => {
                setPrimaryGateway(e.target.value as GatewayId);
                setSaved(false);
              }}
            >
              {PAYMENT_GATEWAYS.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
            Fallback order (optional)
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: -2 }}>
            Suggested order when staff or automation switches away from the primary — e.g. BudPay issues →
            Paystack → Flutterwave.
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="fallback-1-label">First backup</InputLabel>
            <Select
              labelId="fallback-1-label"
              label="First backup"
              value={fallback1}
              onChange={(e: SelectChangeEvent) => {
                setFallback1(e.target.value);
                setSaved(false);
              }}
            >
              {backupOptions.map((opt) => (
                <MenuItem key={opt.id || "none"} value={opt.id}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="fallback-2-label">Second backup</InputLabel>
            <Select
              labelId="fallback-2-label"
              label="Second backup"
              value={fallback2}
              onChange={(e: SelectChangeEvent) => {
                setFallback2(e.target.value);
                setSaved(false);
              }}
            >
              {backupOptions.map((opt) => (
                <MenuItem key={opt.id || "none-2"} value={opt.id}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Ops notes (optional)"
            value={failoverNote}
            onChange={(e) => {
              setFailoverNote(e.target.value);
              setSaved(false);
            }}
            placeholder="e.g. Last switch: 12 Apr — BudPay settlement delay"
            multiline
            minRows={2}
            fullWidth
          />
          {isLoading ? <Skeleton height={36} /> : null}
          {setAppSetting.isError ? (
            <Alert severity="error">{(setAppSetting.error as Error).message}</Alert>
          ) : null}
          {saved ? (
            <Alert severity="success">
              Payment gateway settings saved successfully.
            </Alert>
          ) : null}
        </Stack>
      </Paper>

      <Tooltip title="Saves gateway preference used by customer repayment checkout.">
        <span>
          <Button
            variant="contained"
            onClick={() => void handleSave()}
            disabled={setAppSetting.isPending}
            sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 600 }}
          >
            {setAppSetting.isPending ? "Saving..." : "Save gateway preferences"}
          </Button>
        </span>
      </Tooltip>
    </Stack>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState(0);
  const authUser = useAuthStore((s) => s.user);
  const profile = useUserStore((s) => s.profile);
  const hideLoanConfiguration = isCustomerSupportRole(
    profile?.role ?? authUser?.role
  );
  const lastLoginAt = useAuthStore((s) => s.lastLoginAt);
  const lastLoginIp = useAuthStore((s) => s.lastLoginIp);
  const lastAction = useAuthStore((s) => s.lastAction);
  const setLastLoginIp = useAuthStore((s) => s.setLastLoginIp);
  const { data: activityData, isLoading } = useAdminActivity(50);
  const activities = activityData?.activities ?? [];

  const fetchIp = useCallback(() => {
    if (typeof window === "undefined") return;
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data: { ip?: string }) => {
        if (data?.ip) setLastLoginIp(data.ip);
      })
      .catch(() => {});
  }, [setLastLoginIp]);

  useEffect(() => {
    if (!lastLoginIp) fetchIp();
  }, [lastLoginIp, fetchIp]);

  useEffect(() => {
    if (hideLoanConfiguration && tab !== 0) setTab(0);
  }, [hideLoanConfiguration, tab]);

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
        Settings
      </Typography>

      {!hideLoanConfiguration ? (
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mb: 3,
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
            "& .MuiTabs-flexContainer": { flexWrap: "wrap" },
          }}
        >
          <Tab label="Activity" />
          <Tab label="Loan Settings" />
          <Tab label="Payment gateways" />
        </Tabs>
      ) : null}

      {(hideLoanConfiguration || tab === 0) && (
        <Box>
          <Paper
            variant="outlined"
            sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, maxWidth: 560, width: "100%", mb: 4 }}
          >
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                <AccessTimeIcon sx={{ color: "primary.main", fontSize: { xs: 24, md: 28 } }} />
                <Box minWidth={0}>
                  <Typography variant="caption" color="text.secondary">Last logged in</Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                    {formatLoginTime(lastLoginAt)}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                <PublicIcon sx={{ color: "primary.main", fontSize: { xs: 24, md: 28 } }} />
                <Box minWidth={0}>
                  <Typography variant="caption" color="text.secondary">IP address</Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                    {lastLoginIp || "—"}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                <TouchAppIcon sx={{ color: "primary.main", fontSize: { xs: 24, md: 28 } }} />
                <Box minWidth={0}>
                  <Typography variant="caption" color="text.secondary">Last action</Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                    {lastAction || "—"}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>

          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Activity history
          </Typography>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ borderRadius: 2, overflowX: "auto", maxWidth: "100%" }}
          >
            <Table size="small" sx={{ minWidth: 320 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", md: "0.875rem" } }}>Activity ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", md: "0.875rem" } }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", md: "0.875rem" } }}>IP</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", md: "0.875rem" } }}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Loading...</TableCell>
                  </TableRow>
                ) : activities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: "text.secondary" }}>
                      No activity recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  activities.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        sx={{
                          fontFamily: "monospace",
                          fontSize: { xs: "0.7rem", md: "0.8rem" },
                          maxWidth: { xs: 80, md: "none" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={row.id}
                      >
                        {row.id}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>{row.action}</TableCell>
                      <TableCell sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>{row.ip ?? "—"}</TableCell>
                      <TableCell sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" }, whiteSpace: "nowrap" }}>
                        {formatActivityTime(row.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {!hideLoanConfiguration && tab === 1 ? <LoanSettingsTab /> : null}
      {!hideLoanConfiguration && tab === 2 ? <RepaymentSettingsTab /> : null}
    </Box>
  );
}
