"use client";

import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import useAuthStore from "@/store/useAuthStore";
import { getProfile, listLoans, listUserRepayments } from "@/lib/api";
import {
  buildActivity,
  formatCurrency,
  formatDate,
  getDateSection,
  type ActivityItem,
  type ActivityStatus,
} from "@/lib/activity";

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

function groupByDateSection(items: ActivityItem[]): {
  section: string;
  items: ActivityItem[];
}[] {
  const map = new Map<string, ActivityItem[]>();
  for (const item of items) {
    const section = getDateSection(item.date);
    const list = map.get(section) ?? [];
    list.push(item);
    map.set(section, list);
  }
  const order = ["Today", "Yesterday", "This week", "Earlier"];
  return order
    .filter((s) => map.has(s))
    .map((section) => ({ section, items: map.get(section)! }));
}

export default function NotificationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const token = useAuthStore((s) => s.token);
  const storedUser = useAuthStore((s) => s.user);

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => getProfile(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const userId = profile?.id ?? storedUser?.id ?? "";

  const { data: loans, isLoading: loansLoading } = useQuery({
    queryKey: ["loans", userId],
    queryFn: () => listLoans(token!, userId),
    enabled: !!token && !!userId,
    staleTime: 60 * 1000,
  });

  const { data: repayments, isLoading: repaymentsLoading } = useQuery({
    queryKey: ["repayments", userId],
    queryFn: () => listUserRepayments(token!, userId),
    enabled: !!token && !!userId,
    staleTime: 60 * 1000,
  });

  const allActivity = useMemo(
    () => buildActivity(loans ?? [], repayments ?? []),
    [loans, repayments]
  );

  const filteredActivity = useMemo(() => {
    if (!search.trim()) return allActivity;
    const q = search.trim().toLowerCase();
    return allActivity.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.sublabel.toLowerCase().includes(q)
    );
  }, [allActivity, search]);

  const grouped = useMemo(
    () => groupByDateSection(filteredActivity),
    [filteredActivity]
  );

  const isLoading = loansLoading || repaymentsLoading;

  return (
    <Box
      className="screen-content"
      sx={{
        backgroundColor: "#FFFFFF",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        pb: "calc(72px + env(safe-area-inset-bottom))",
      }}
    >
      <Stack spacing={2} sx={{ p: 3, flex: 1, overflow: "hidden" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton aria-label="Back" onClick={() => router.back()}>
              <ArrowBackIcon />
            </IconButton>
            <Typography fontWeight={700} variant="h6">
              Notifications
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5}>
            <IconButton
              aria-label="More"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MoreVertIcon />
            </IconButton>
          </Stack>
        </Stack>

        <TextField
          placeholder="Search notifications"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#97a6a0" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f3f3f3",
              borderRadius: 2,
              "& fieldset": { border: "none" },
            },
          }}
        />

        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem
            onClick={() => {
              setSearch("");
              setAnchorEl(null);
            }}
          >
            Clear search
          </MenuItem>
        </Menu>

        <Box sx={{ flex: 1, overflowY: "auto", pb: 2 }}>
          {isLoading ? (
            <Stack spacing={2} sx={{ pt: 2 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Stack key={i} direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      backgroundColor: "#E8E8E8",
                    }}
                  />
                  <Box flex={1}>
                    <Box
                      sx={{
                        height: 16,
                        width: "70%",
                        backgroundColor: "#E8E8E8",
                        borderRadius: 1,
                        mb: 0.5,
                      }}
                    />
                    <Box
                      sx={{
                        height: 12,
                        width: "50%",
                        backgroundColor: "#E8E8E8",
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      height: 20,
                      width: 60,
                      backgroundColor: "#E8E8E8",
                      borderRadius: 1,
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          ) : grouped.length === 0 ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ py: 6, px: 3 }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#F5F5F5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NotificationsNoneIcon
                  sx={{ fontSize: 40, color: "#BDBDBD" }}
                />
              </Box>
              <Typography
                variant="body1"
                fontWeight={600}
                color="text.secondary"
                textAlign="center"
              >
                No notifications yet
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                {search.trim()
                  ? "Try a different search term"
                  : "Your loan and repayment activity will appear here"}
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={3}>
              {grouped.map((group) => (
                <Stack key={group.section} spacing={2}>
                  <Typography fontWeight={700} color="text.secondary">
                    {group.section}
                  </Typography>
                  <Stack spacing={0}>
                    {group.items.map((item) => {
                      const meta = STATUS_META[item.status];
                      return (
                        <Stack key={item.key} spacing={0}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            sx={{ py: 1.5 }}
                          >
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
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography fontWeight={600} variant="body2">
                                {item.label}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                {item.sublabel}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatDate(item.date)}
                              </Typography>
                            </Box>
                            <Typography
                              fontWeight={700}
                              variant="body2"
                              sx={{
                                color: meta.color,
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                              }}
                            >
                              {meta.amountPrefix}
                              {formatCurrency(item.amount)}
                            </Typography>
                          </Stack>
                          <Divider />
                        </Stack>
                      );
                    })}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
