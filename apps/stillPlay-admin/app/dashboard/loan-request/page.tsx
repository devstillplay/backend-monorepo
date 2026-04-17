"use client";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import { useAllLoans, useAdminUsers } from "../../../lib/queries";
import type { Loan } from "../../../lib/api";

function statusColor(status: string): string {
  switch (status) {
    case "REPAID":
      return "#22c55e";
    case "REJECTED":
      return "#ef4444";
    case "PENDING":
      return "#f59e0b";
    case "APPROVED":
    case "DISBURSED":
      return "#0b7b4c";
    default:
      return "#6b7280";
  }
}

export default function LoanRequestPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "PENDING" | "APPROVED" | "REJECTED" | "DISBURSED" | "REPAID">("all");

  const { data: loansData, isLoading, isError, error, refetch, isFetching } = useAllLoans();
  const { data: users = [] } = useAdminUsers();
  const loans = loansData?.loans ?? [];

  const userMap = useMemo(() => {
    const m = new Map<string, { name: string; code: string; picture?: string | null }>();
    users.forEach((u) => {
      const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || "—";
      m.set(u.id, { name, code: u.userNumber ?? u.id.slice(-6), picture: u.picture ?? null });
    });
    return m;
  }, [users]);

  const filteredLoans = useMemo(() => {
    let list = loans;
    if (statusFilter !== "all") {
      list = list.filter((l) => l.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((l) => {
        const u = userMap.get(l.userId);
        return (
          u?.name.toLowerCase().includes(q) ||
          u?.code.toLowerCase().includes(q) ||
          l.amount.toString().includes(q) ||
          l.id.toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [loans, statusFilter, search, userMap]);

  const rowsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredLoans.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const pageRows = filteredLoans.slice(startIndex, startIndex + rowsPerPage);

  return (
    <Box>
      <DashboardHeader search={search} onSearchChange={setSearch} />
      <Box
        sx={{
          background: "#ffffff",
          borderRadius: { xs: 0, md: 4 },
          padding: { xs: 2, md: 3.5 },
          paddingBottom: { xs: 3, md: 4 },
          marginTop: { xs: 2, md: 3 },
          marginX: { xs: -2, md: 0 },
          minHeight: "calc(100vh - 220px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack sx={{ marginTop: "auto" }} spacing={2}>
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
              spacing={2}
              sx={{ marginBottom: 2, paddingTop: 2, paddingLeft: { xs: 1, md: 2 } }}
            >
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.25rem" } }}>
                  LOANS
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  aria-label="Refresh"
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
                Requests within a user&apos;s limit are granted automatically. Interest is withheld upfront from the
                principal; the net amount is credited to the user&apos;s wallet (see Repay / Withheld / Credited).
                Legacy <strong>PENDING</strong> rows may still appear from older data.
              </Typography>
              <Stack direction="row" spacing={{ xs: 1, md: 4 }} alignItems="center" flexWrap="wrap" sx={{ gap: { xs: 0.5, md: 0 } }}>
                {(["all", "PENDING", "APPROVED", "REJECTED", "DISBURSED", "REPAID"] as const).map((s) => (
                  <Typography
                    key={s}
                    variant="body2"
                    onClick={() => setStatusFilter(s)}
                    sx={{
                      cursor: "pointer",
                      color: statusFilter === s ? "#0b7b4c" : "text.secondary",
                      fontWeight: statusFilter === s ? 600 : 400,
                      position: "relative",
                      paddingBottom: 0.5,
                    }}
                  >
                    {s === "all" ? "All request" : s}
                    {statusFilter === s && (
                      <Box
                        component="span"
                        sx={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: 2,
                          backgroundColor: "#0b7b4c",
                          borderRadius: 999,
                        }}
                      />
                    )}
                  </Typography>
                ))}
              </Stack>
            </Stack>

            <Box
              sx={{
                fontSize: 12,
                color: "text.secondary",
                marginBottom: 2,
                backgroundColor: "#fff",
                borderRadius: 999,
                paddingY: 1.2,
                paddingX: 3,
                display: { xs: "none", md: "grid" },
                gridTemplateColumns: "1.1fr 1.4fr 0.95fr 0.95fr 0.95fr 0.85fr 0.9fr",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box>Offline code</Box>
              <Box>Name</Box>
              <Box>Repay</Box>
              <Box>Withheld</Box>
              <Box>Credited</Box>
              <Box>Time</Box>
              <Box>Status</Box>
            </Box>

            <Box
              sx={{
                marginTop: 1,
                maxHeight: { xs: 420, sm: "none" },
                overflowY: { xs: "auto", sm: "visible" },
              }}
            >
              {isLoading ? (
                <Stack alignItems="center" py={4}>
                  <CircularProgress sx={{ color: "#0b7b4c" }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Loading loans...
                  </Typography>
                </Stack>
              ) : isError ? (
                <Stack alignItems="center" py={4} spacing={2}>
                  <Typography color="error">{(error as Error).message}</Typography>
                  <Button variant="outlined" onClick={() => refetch()} size="small">
                    Retry
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={0}>
                  {pageRows.map((loan: Loan, index: number) => {
                    const user = userMap.get(loan.userId);
                    const name = user?.name ?? "—";
                    const code = user?.code ?? loan.userId.slice(-6);
                    const repay = Number(loan.amount);
                    const withheld =
                      loan.interestWithheld != null && !Number.isNaN(loan.interestWithheld)
                        ? Number(loan.interestWithheld)
                        : null;
                    const credited =
                      loan.netDisbursed != null && !Number.isNaN(loan.netDisbursed)
                        ? Number(loan.netDisbursed)
                        : repay;
                    const createdAt = loan.createdAt
                      ? new Date(loan.createdAt).toLocaleTimeString("en-NG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—";
                    return (
                      <Box
                        key={loan.id}
                        sx={{
                          paddingY: { xs: 1.5, md: 2 },
                          paddingX: { xs: 2, md: 3 },
                          borderBottom:
                            index === pageRows.length - 1
                              ? "none"
                              : "1px solid #fff",
                          backgroundColor: index === 0 ? "#ffffff" : "transparent",
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr 1fr",
                            md: "1.1fr 1.4fr 0.95fr 0.95fr 0.95fr 0.85fr 0.9fr",
                          },
                          alignItems: "center",
                          gap: { xs: 1, md: 1 },
                          borderRadius: 1,
                        }}
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "block", md: "none" } }}>Code</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            #{code}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "block", md: "none" } }}>Name</Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar
                              src={user?.picture || undefined}
                              sx={{ width: 32, height: 32 }}
                            >
                              {(name?.[0] ?? "?").toUpperCase()}
                            </Avatar>
                            <Typography variant="body2">{name}</Typography>
                          </Stack>
                        </Box>
                        <Box sx={{ gridColumn: { xs: "1 / -1", md: "auto" } }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "block", md: "none" } }}>Repay / Withheld / Credited</Typography>
                          <Typography variant="body2" sx={{ display: { xs: "block", md: "none" } }}>
                            Repay NGN {repay.toLocaleString()}
                            {withheld != null ? ` · Withheld NGN ${withheld.toLocaleString()}` : ""}
                            {` · Credited NGN ${credited.toLocaleString()}`}
                          </Typography>
                          <Typography variant="body2" sx={{ display: { xs: "none", md: "block" } }}>
                            NGN {repay.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: { xs: "none", md: "block" } }}>
                          <Typography variant="body2">
                            {withheld != null ? `NGN ${withheld.toLocaleString()}` : "—"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: { xs: "none", md: "block" } }}>
                          <Typography variant="body2">NGN {credited.toLocaleString()}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "block", md: "none" } }}>Time</Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <AccessTimeOutlinedIcon
                              sx={{ fontSize: 18, color: "#6b6b6b" }}
                            />
                            <Typography variant="body2">{createdAt}</Typography>
                          </Stack>
                        </Box>
                        <Box sx={{ gridColumn: { xs: "2", md: "auto" } }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "block", md: "none" } }}>Status</Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                backgroundColor: statusColor(loan.status),
                              }}
                            />
                            <Typography variant="body2">{loan.status}</Typography>
                          </Stack>
                        </Box>
                      </Box>
                    );
                  })}
                  {pageRows.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                      No loans match the filter.
                    </Typography>
                  )}
                </Stack>
              )}
            </Box>
            <Stack alignItems="center" sx={{ marginTop: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
