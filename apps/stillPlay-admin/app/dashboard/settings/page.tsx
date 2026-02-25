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
        <Tab label="Preferences" disabled />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              maxWidth: 560,
              width: "100%",
            }}
          >
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                <AccessTimeIcon sx={{ color: "primary.main", fontSize: { xs: 24, md: 28 } }} />
                <Box minWidth={0}>
                  <Typography variant="caption" color="text.secondary">
                    Last logged in
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                    {formatLoginTime(lastLoginAt)}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                <PublicIcon sx={{ color: "primary.main", fontSize: { xs: 24, md: 28 } }} />
                <Box minWidth={0}>
                  <Typography variant="caption" color="text.secondary">
                    IP address
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                    {lastLoginIp || "—"}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                <TouchAppIcon sx={{ color: "primary.main", fontSize: { xs: 24, md: 28 } }} />
                <Box minWidth={0}>
                  <Typography variant="caption" color="text.secondary">
                    Last action
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                    {lastAction || "—"}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>

          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
            Activity history
          </Typography>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflowX: "auto",
              maxWidth: "100%",
            }}
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
                      <TableCell sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" }, whiteSpace: "nowrap" }}>{formatActivityTime(row.createdAt)}</TableCell>
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
