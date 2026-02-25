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
import { useAllLoans, useAdminUsers, useApproveLoan, useRejectLoan } from "../../../lib/queries";
import type { Loan } from "../../../lib/api";

function statusColor(status: string): string {
  switch (status) {
    case "REPAID":
      return "#22c55e";
    case "REJECTED":
      return "#ef4444";
    case "PENDING":
    case "APPROVED":
    case "DISBURSED":
    default:
      return "#f59e0b";
  }
}

export default function LoanRequestPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "PENDING" | "APPROVED" | "REJECTED" | "DISBURSED" | "REPAID">("all");

  const { data: loansData, isLoading, isError, error, refetch, isFetching } = useAllLoans();
  const { data: users = [] } = useAdminUsers();
  const approveMutation = useApproveLoan();
  const rejectMutation = useRejectLoan();
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
                  LOAN REQUEST
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
                gridTemplateColumns: "1.2fr 1.6fr 1fr 1fr 1fr 1.2fr",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box>Offline code</Box>
              <Box>Name</Box>
              <Box>Amount</Box>
              <Box>Time</Box>
              <Box>Status</Box>
              <Box>Actions</Box>
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
                    const createdAt = loan.createdAt
                      ? new Date(loan.createdAt).toLocaleTimeString("en-NG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—";
                    const isPending = loan.status === "PENDING";
                    const approving = approveMutation.isPending && approveMutation.variables === loan.id;
                    const rejecting = rejectMutation.isPending && rejectMutation.variables === loan.id;
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
                          gridTemplateColumns: { xs: "1fr 1fr", md: "1.2fr 1.6fr 1fr 1fr 1fr 1.2fr" },
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
                        <Box sx={{ gridColumn: { xs: "1", md: "auto" } }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "block", md: "none" } }}>Amount</Typography>
                          <Typography variant="body2">
                            NGN {Number(loan.amount).toLocaleString()}
                          </Typography>
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
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ gridColumn: { xs: "1 / -1", md: "auto" } }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            disabled={!isPending || approving || rejecting}
                            onClick={() => approveMutation.mutate(loan.id)}
                            sx={{
                              backgroundColor: "#22c55e",
                              "&:hover": { backgroundColor: "#16a34a" },
                            }}
                          >
                            {approving ? "..." : "Accept"}
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            disabled={!isPending || approving || rejecting}
                            onClick={() => rejectMutation.mutate(loan.id)}
                          >
                            {rejecting ? "..." : "Reject"}
                          </Button>
                        </Stack>
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
