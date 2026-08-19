"use client";

import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
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
import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import { useWaitlist } from "../../../lib/queries";
import type { WaitlistEntry } from "../../../lib/api";

const TAB_WAITLIST = "waitlist";
const TAB_FINANCIAL = "financial";
const TAB_FORMS = "forms";

function isBettorEntry(row: WaitlistEntry) {
  return row.source === "landing";
}

function isFinancialEntry(row: WaitlistEntry) {
  return (
    row.source === "financial" ||
    (row.source === "partners" && row.partnerType === "Financial Institution")
  );
}

function isOtherPartnerEntry(row: WaitlistEntry) {
  return (
    row.source === "partners" &&
    row.partnerType != null &&
    row.partnerType !== "Financial Institution"
  );
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function SurveyPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const rawTab = mounted ? searchParams.get("tab") : null;
  const tab =
    rawTab === TAB_FORMS
      ? TAB_FORMS
      : rawTab === TAB_FINANCIAL
        ? TAB_FINANCIAL
        : TAB_WAITLIST;

  const [search, setSearch] = useState("");

  const { data: entries = [], isLoading, isError, error, refetch, isFetching } =
    useWaitlist();

  const sorted = useMemo(
    () =>
      [...entries].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [entries]
  );

  const forTab = useMemo(() => {
    if (tab === TAB_WAITLIST) return sorted.filter(isBettorEntry);
    if (tab === TAB_FINANCIAL) return sorted.filter(isFinancialEntry);
    return sorted.filter(isOtherPartnerEntry);
  }, [sorted, tab]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return forTab;
    return forTab.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        (r.businessName?.toLowerCase().includes(q) ?? false) ||
        (r.partnerType?.toLowerCase().includes(q) ?? false)
    );
  }, [forTab, search]);

  const emptyMessage =
    tab === TAB_WAITLIST
      ? "No bettor waitlist entries yet."
      : tab === TAB_FINANCIAL
        ? "No financial or liquidity partner signups yet."
        : "No other partner inquiries yet. Betting platform and other types from the partners page appear here.";

  return (
    <Box>
      <DashboardHeader search={search} onSearchChange={setSearch} />

      <Tabs
        value={tab}
        onChange={(_, v) => {
          router.replace(`/dashboard/survey?tab=${v}`);
        }}
        sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Waitlist" value={TAB_WAITLIST} />
        <Tab label="Financial partners" value={TAB_FINANCIAL} />
        <Tab label="Partner inquiries" value={TAB_FORMS} />
      </Tabs>

      <Box>
        <StackRow>
          <Typography variant="body2" color="text.secondary">
            {filtered.length} record{filtered.length === 1 ? "" : "s"}
            {search.trim() && filtered.length !== forTab.length
              ? ` (filtered from ${forTab.length})`
              : ""}
          </Typography>
          <Button
            size="small"
            startIcon={
              isFetching ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <RefreshIcon />
              )
            }
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Refresh
          </Button>
        </StackRow>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">
            {error instanceof Error ? error.message : "Failed to load survey data"}
          </Typography>
        ) : tab === TAB_FORMS && forTab.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 3 }}>
            {emptyMessage}
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ mt: 2, overflowX: "auto", maxWidth: "100%" }}
          >
            <Table size="small" sx={{ minWidth: 640 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Business</TableCell>
                  <TableCell>Partner type</TableCell>
                  <TableCell align="right">Signed up</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography color="text.secondary" sx={{ py: 2 }}>
                        {forTab.length === 0
                          ? emptyMessage
                          : "No entries match your search."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.fullName}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {row.source}
                      </TableCell>
                      <TableCell>{row.businessName ?? "—"}</TableCell>
                      <TableCell>{row.partnerType ?? "—"}</TableCell>
                      <TableCell align="right">
                        {formatWhen(row.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}

function StackRow({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      {children}
    </Box>
  );
}

export default function SurveyPage() {
  return (
    <Suspense fallback={null}>
      <SurveyPageInner />
    </Suspense>
  );
}
