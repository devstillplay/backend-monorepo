"use client";

import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PublicIcon from "@mui/icons-material/Public";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import {
  Box,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { useAdminActivity } from "../../../lib/queries";
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
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
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
        }}
      >
        <Tab label="Activity" />
        <Tab label="Preferences" disabled />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              maxWidth: 560,
            }}
          >
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <AccessTimeIcon sx={{ color: "primary.main", fontSize: 28 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last logged in
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatLoginTime(lastLoginAt)}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <PublicIcon sx={{ color: "primary.main", fontSize: 28 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    IP address
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {lastLoginIp || "—"}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <TouchAppIcon sx={{ color: "primary.main", fontSize: 28 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last action
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {lastAction || "—"}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>

          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
            Activity history
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Activity ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>IP</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : activities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" color="text.secondary">
                      No activity recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  activities.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                        {row.id}
                      </TableCell>
                      <TableCell>{row.action}</TableCell>
                      <TableCell>{row.ip ?? "—"}</TableCell>
                      <TableCell>{formatActivityTime(row.createdAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}
