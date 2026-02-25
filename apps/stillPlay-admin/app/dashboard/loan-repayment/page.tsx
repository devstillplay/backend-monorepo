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
import { useAllRepayments, useAdminUsers } from "../../../lib/queries";
import type { LoanRepayment } from "../../../lib/api";

export default function LoanRepaymentPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: repaymentsData, isLoading, isError, error, refetch, isFetching } = useAllRepayments();
  const { data: users = [] } = useAdminUsers();
  const repayments = repaymentsData?.repayments ?? [];

  const userMap = useMemo(() => {
    const m = new Map<string, { name: string; picture?: string | null }>();
    users.forEach((u) => {
      const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || "—";
      m.set(u.id, { name, picture: u.picture ?? null });
    });
    return m;
  }, [users]);

  const filteredRepayments = useMemo(() => {
    if (!search.trim()) return repayments;
    const q = search.trim().toLowerCase();
    return repayments.filter((r: LoanRepayment) => {
      const u = userMap.get(r.userId);
      return (
        u?.name.toLowerCase().includes(q) ||
        r.amount.toString().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.loanId.toLowerCase().includes(q)
      );
    });
  }, [repayments, search, userMap]);

  const rowsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredRepayments.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const pageRows = filteredRepayments.slice(startIndex, startIndex + rowsPerPage);

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
              sx={{ marginBottom: 2, paddingTop: 2, paddingLeft: 2 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  REPAYMENT
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
              <Stack direction="row" spacing={4} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{
                    color: "#0b7b4c",
                    fontWeight: 600,
                    position: "relative",
                    paddingBottom: 0.5,
                  }}
                >
                  All repayments
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
                </Typography>
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
                gridTemplateColumns: "2fr 1fr 1fr",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box>Name</Box>
              <Box>Amount</Box>
              <Box>Time</Box>
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
                    Loading repayments...
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
                  {pageRows.map((r: LoanRepayment, index: number) => {
                    const user = userMap.get(r.userId);
                    const name = user?.name ?? "—";
                    const repaidAt = r.repaidAt
                      ? new Date(r.repaidAt).toLocaleString("en-NG", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "—";
                    return (
                      <Box
                        key={r.id}
                        sx={{
                          paddingY: 2,
                          paddingX: 3,
                          borderBottom:
                            index === pageRows.length - 1
                              ? "none"
                              : "1px solid #fff",
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr 1fr", md: "2fr 1fr 1fr" },
                          alignItems: "center",
                          gap: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            src={user?.picture || undefined}
                            sx={{ width: 36, height: 36 }}
                          >
                            {(name?.[0] ?? "?").toUpperCase()}
                          </Avatar>
                          <Typography variant="body2">{name}</Typography>
                        </Stack>
                        <Typography variant="body2">
                          NGN {Number(r.amount).toLocaleString()}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AccessTimeOutlinedIcon
                            sx={{ fontSize: 18, color: "#6b6b6b" }}
                          />
                          <Typography variant="body2">{repaidAt}</Typography>
                        </Stack>
                      </Box>
                    );
                  })}
                  {pageRows.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                      No repayments yet.
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
