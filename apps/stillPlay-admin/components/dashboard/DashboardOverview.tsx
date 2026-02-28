"use client";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import Link from "next/link";

import {
  useAdminUsers,
  useAllLoans,
  useAllRepayments,
  useProviders,
} from "../../lib/queries";
import { useAuthStore } from "../../store/auth";

const COLORS = ["#0b7b4c", "#f59e0b", "#ef4444", "#22c55e", "#7c3aed"];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

type DashboardOverviewProps = {
  onNavigateToUsers?: () => void;
};

export default function DashboardOverview({ onNavigateToUsers }: DashboardOverviewProps) {
  const token = useAuthStore((s) => s.token);
  const { data: users = [], isLoading: usersLoading } = useAdminUsers();
  const { data: loansData, isLoading: loansLoading } = useAllLoans();
  const { data: repaymentsData, isLoading: repaymentsLoading } = useAllRepayments();
  const { data: providersList = [] } = useProviders();

  const loans = loansData?.loans ?? [];
  const repayments = repaymentsData?.repayments ?? [];
  const providers = Array.isArray(providersList) ? providersList : [];

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const verifiedUsers = users.filter((u) => u.verified).length;
    const pendingVerification = users.filter((u) => !u.verified).length;
    const suspendedUsers = users.filter((u) => u.suspended).length;

    const pendingLoans = loans.filter((l) => l.status === "PENDING").length;
    const approvedLoans = loans.filter((l) => l.status === "APPROVED").length;
    const disbursedLoans = loans.filter((l) => l.status === "DISBURSED").length;
    const repaidLoans = loans.filter((l) => l.status === "REPAID").length;
    const rejectedLoans = loans.filter((l) => l.status === "REJECTED").length;

    const totalDisbursed = loans
      .filter((l) => ["APPROVED", "DISBURSED", "REPAID"].includes(l.status))
      .reduce((s, l) => s + l.amount, 0);
    const totalRepaid = repayments.reduce((s, r) => s + r.amount, 0);
    const totalOutstanding = totalDisbursed - totalRepaid;
    const repaymentRate =
      totalDisbursed > 0 ? (totalRepaid / totalDisbursed) * 100 : 0;

    return {
      totalUsers,
      verifiedUsers,
      pendingVerification,
      suspendedUsers,
      verifiedPct: totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0,
      pendingLoans,
      approvedLoans,
      disbursedLoans,
      repaidLoans,
      rejectedLoans,
      totalDisbursed,
      totalRepaid,
      totalOutstanding,
      repaymentRate,
      totalProviders: providers.length,
    };
  }, [users, loans, repayments, providers]);

  const loanStatusData = useMemo(
    () => [
      { name: "Pending", value: stats.pendingLoans, color: COLORS[1] },
      { name: "Approved", value: stats.approvedLoans, color: COLORS[0] },
      { name: "Disbursed", value: stats.disbursedLoans, color: COLORS[3] },
      { name: "Repaid", value: stats.repaidLoans, color: COLORS[4] },
      { name: "Rejected", value: stats.rejectedLoans, color: COLORS[2] },
    ].filter((d) => d.value > 0),
    [stats]
  );

  const userStatusData = useMemo(
    () => [
      { name: "Verified", value: stats.verifiedUsers, color: COLORS[0] },
      { name: "Pending", value: stats.pendingVerification, color: COLORS[1] },
      { name: "Suspended", value: stats.suspendedUsers, color: COLORS[2] },
    ].filter((d) => d.value > 0),
    [stats]
  );

  const financeBarData = useMemo(
    () => [
      { name: "Disbursed", amount: stats.totalDisbursed, fill: "#0b7b4c" },
      { name: "Repaid", amount: stats.totalRepaid, fill: "#22c55e" },
      { name: "Outstanding", amount: stats.totalOutstanding, fill: "#f59e0b" },
    ],
    [stats]
  );

  const isLoading = usersLoading || loansLoading || repaymentsLoading;

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
        <CircularProgress sx={{ color: "#0b7b4c" }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Dashboard Overview
      </Typography>

      {/* Stat cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: "#E8F5EF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PeopleAltOutlinedIcon sx={{ color: "#0b7b4c", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Users
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {stats.totalUsers}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats.verifiedPct.toFixed(0)}% verified
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: "#FFF8E1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RequestQuoteOutlinedIcon
                    sx={{ color: "#f59e0b", fontSize: 24 }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Pending Loans
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {stats.pendingLoans}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Awaiting approval
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: "#E8F5EF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingUpIcon sx={{ color: "#0b7b4c", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Disbursed
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {formatCurrency(stats.totalDisbursed)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats.repaymentRate.toFixed(0)}% repaid
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: "#EDE9FE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccountBalanceOutlinedIcon
                    sx={{ color: "#7c3aed", fontSize: 24 }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Providers
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {stats.totalProviders}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Funding partners
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts row */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Loan Status
              </Typography>
              {loanStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={loanStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {loanStatusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No loan data yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                User Status
              </Typography>
              {userStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={userStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {userStatusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No user data yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Finance Overview (₦)
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={financeBarData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick links */}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Quick Actions
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mt: 1 }}>
            <Box
              component={onNavigateToUsers ? "button" : Link}
              href={onNavigateToUsers ? undefined : "/dashboard"}
              onClick={onNavigateToUsers}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: "#e8f5ef",
                color: "#0b7b4c",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                border: "none",
                textDecoration: "none",
                "&:hover": { bgcolor: "#d4edda" },
              }}
            >
              Manage Users
            </Box>
            <Link href="/dashboard/loan-request" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: "#fff8e1",
                  color: "#f59e0b",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#ffecb3" },
                }}
              >
                Loan Requests
                {stats.pendingLoans > 0 && (
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      bgcolor: "#ef4444",
                      color: "#fff",
                      fontSize: 12,
                    }}
                  >
                    {stats.pendingLoans}
                  </Box>
                )}
              </Box>
            </Link>
            <Link href="/dashboard/loan-repayment" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: "#ede9fe",
                  color: "#7c3aed",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#ddd6fe" },
                }}
              >
                Loan Repayments
              </Box>
            </Link>
            <Link href="/dashboard/providers" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: "#f3f3f3",
                  color: "#374151",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#e5e7eb" },
                }}
              >
                Providers
              </Box>
            </Link>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
