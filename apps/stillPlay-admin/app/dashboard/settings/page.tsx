"use client";

import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PublicIcon from "@mui/icons-material/Public";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import MoneyIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Paper,
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
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { useAdminActivity, useAppSettings, useSetAppSetting } from "../../../lib/queries";
import { useAuthStore } from "../../../store/auth";

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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings?.loan_max_amount !== undefined) {
      setMaxAmount(settings.loan_max_amount);
    }
  }, [settings]);

  const handleSave = () => {
    const val = Number(maxAmount);
    if (!maxAmount || isNaN(val) || val <= 0) return;
    setAppSetting.mutate(
      { key: "loan_max_amount", value: String(val) },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      }
    );
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
          <Skeleton height={56} />
        ) : (
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
            helperText="Default is ₦5,000. Changes apply immediately for new loan requests."
            fullWidth
          />
        )}

        {setAppSetting.isError && (
          <Alert severity="error">
            {(setAppSetting.error as Error).message}
          </Alert>
        )}
        {saved && (
          <Alert severity="success">Maximum loan amount saved successfully.</Alert>
        )}

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={setAppSetting.isPending || !maxAmount}
          sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 600 }}
        >
          {setAppSetting.isPending ? "Saving..." : "Save"}
        </Button>
      </Stack>
    </Paper>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState(0);
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

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
        Settings
      </Typography>

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
      </Tabs>

      {tab === 0 && (
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

      {tab === 1 && <LoanSettingsTab />}
    </Box>
  );
}
