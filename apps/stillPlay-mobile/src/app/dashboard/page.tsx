"use client";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LockIcon from "@mui/icons-material/Lock";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

import useAuthStore from "@/store/useAuthStore";
import { getProfile, getWallet, listLoans, listUserRepayments } from "@/lib/api";
import {
  buildActivity,
  formatCurrency,
  formatDate,
} from "@/lib/activity";
import type { ActivityItem, ActivityStatus } from "@/lib/activity";

const STATUS_META: Record<
  ActivityStatus,
  { icon: React.ReactNode; bg: string; color: string; amountPrefix: string }
> = {
  pending: {
    icon: <HourglassEmptyIcon sx={{ fontSize: 20 }} />,
    bg: "#FFF8E1",
    color: "#F59E0B",
    amountPrefix: "",
  },
  approved: {
    icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
    bg: "#E8F5EF",
    color: "#22C55E",
    amountPrefix: "+",
  },
  disbursed: {
    icon: <TrendingUpIcon sx={{ fontSize: 20 }} />,
    bg: "#E8F5EF",
    color: "#22C55E",
    amountPrefix: "+",
  },
  repaid: {
    icon: <SendIcon sx={{ fontSize: 20 }} />,
    bg: "#EDE9FE",
    color: "#7C3AED",
    amountPrefix: "-",
  },
  rejected: {
    icon: <CancelIcon sx={{ fontSize: 20 }} />,
    bg: "#FEE2E2",
    color: "#EF4444",
    amountPrefix: "",
  },
  repayment: {
    icon: <TrendingDownIcon sx={{ fontSize: 20 }} />,
    bg: "#FEE2E2",
    color: "#EF4444",
    amountPrefix: "-",
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const token = useAuthStore((s) => s.token);
  const storedUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // Fetch full profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const p = await getProfile(token!);
      // Sync full profile back into the store
      setUser({
        id: p.id,
        email: p.email,
        role: p.role,
        firstName: p.firstName,
        lastName: p.lastName,
        picture: p.picture ?? null,
        verified: p.verified,
        userNumber: p.userNumber,
        createdAt: p.createdAt,
      });
      return p;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const userId = profile?.id ?? storedUser?.id ?? "";

  // Fetch wallet
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ["wallet", userId],
    queryFn: () => getWallet(token!, userId),
    enabled: !!token && !!userId,
    staleTime: 60 * 1000,
  });

  // Fetch loans
  const { data: loans, isLoading: loansLoading } = useQuery({
    queryKey: ["loans", userId],
    queryFn: () => listLoans(token!, userId),
    enabled: !!token && !!userId,
    staleTime: 60 * 1000,
  });

  // Fetch repayment transactions
  const { data: repayments, isLoading: repaymentsLoading } = useQuery({
    queryKey: ["repayments", userId],
    queryFn: () => listUserRepayments(token!, userId),
    enabled: !!token && !!userId,
    staleTime: 60 * 1000,
  });

  const firstName = profile?.firstName ?? storedUser?.firstName ?? null;
  const displayName = firstName ?? storedUser?.email?.split("@")[0] ?? "there";
  const avatarSrc = profile?.picture ?? storedUser?.picture ?? undefined;

  const activityLoading = loansLoading || repaymentsLoading;
  const allActivity = buildActivity(loans ?? [], repayments ?? []);
  const recentActivity = isExpanded ? allActivity : allActivity.slice(0, 12);

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        pb: "calc(72px + env(safe-area-inset-bottom) + 160px)",
        overflow: "hidden",
        backgroundColor: "#F5F5F5",
      }}
    >
      <Stack spacing={3} sx={{ p: 3 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {profileLoading ? (
            <Skeleton variant="circular" width={40} height={40} />
          ) : (
            <Avatar
              src={avatarSrc}
              alt={displayName}
              sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
            >
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <IconButton
            aria-label="Notifications"
            onClick={() => router.push("/dashboard/notifications")}
            sx={{
              border: "1px solid #E8E8E8",
              borderRadius: 2,
              width: 40,
              height: 40,
            }}
          >
            <NotificationsNoneIcon />
          </IconButton>
        </Stack>

        {/* Greeting + Balance */}
        <Box>
          {profileLoading ? (
            <Skeleton width={160} height={28} />
          ) : (
            <Typography variant="h6" fontWeight={700}>
              Welcome back,{" "}
              <Box component="span" color="primary.main">
                {displayName}
              </Box>{" "}
              👋
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Available balance
          </Typography>
          {walletLoading ? (
            <Skeleton width={180} height={48} />
          ) : (
            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
              {wallet ? formatCurrency(wallet.balance) : "₦0.00"}
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push("/dashboard/loan")}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              py: 1.2,
            }}
          >
            Get a Loan
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              py: 1.2,
            }}
          >
            Place a bet
          </Button>
        </Stack>

        {/* Lock savings promo */}
        <Paper
          elevation={0}
          sx={{ borderRadius: 3, p: 2, backgroundColor: "#F8FAFC" }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: "#E8F5EF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LockIcon sx={{ color: "#22C55E" }} />
            </Box>
            <Box>
              <Typography fontWeight={600}>Create a lock savings</Typography>
              <Typography color="text.secondary" variant="body2">
                Earn up to 15% in bitcoin when you lock funds.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>

      {/* Recent Activity panel */}
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          position: "fixed",
          left: 0,
          right: 0,
          bottom: "calc(72px + env(safe-area-inset-bottom))",
          px: 3,
          pt: 2.5,
          pb: 3,
          height: isExpanded ? "70vh" : "36vh",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          zIndex: 0,
          transition: "height 220ms ease",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography fontWeight={600}>Recent Activity</Typography>
          <Button
            variant="text"
            onClick={() => setIsExpanded((prev) => !prev)}
            sx={{
              minWidth: 0,
              px: 0,
              color: "warning.main",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {isExpanded ? "See Less" : "See More"}
          </Button>
        </Stack>

        <Stack spacing={2} sx={{ overflowY: "auto", pr: 0.5, height: "calc(100% - 48px)" }}>
          {activityLoading ? (
            [1, 2, 3].map((i) => (
              <Stack key={i} direction="row" alignItems="center" spacing={2}>
                <Skeleton variant="circular" width={44} height={44} />
                <Box flex={1}>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </Box>
                <Skeleton width={60} />
              </Stack>
            ))
          ) : recentActivity.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <Typography color="text.secondary" variant="body2">
                No activity yet
              </Typography>
            </Stack>
          ) : (
            recentActivity.map((item) => {
              const meta = STATUS_META[item.status];
              return (
                <Stack
                  key={item.key}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        backgroundColor: meta.bg,
                        color: meta.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {meta.icon}
                    </Box>
                    <Box>
                      <Typography fontWeight={600} variant="body2">
                        {item.label}
                      </Typography>
                      <Typography color="text.secondary" variant="caption" display="block">
                        {item.sublabel}
                      </Typography>
                      <Typography color="text.secondary" variant="caption">
                        {formatDate(item.date)}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography
                    fontWeight={700}
                    variant="body2"
                    sx={{ color: meta.color, whiteSpace: "nowrap", ml: 1 }}
                  >
                    {meta.amountPrefix}{formatCurrency(item.amount)}
                  </Typography>
                </Stack>
              );
            })
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
