"use client";

import { Box, Drawer, IconButton, Stack, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { getQueryClient } from "../../lib/queryClient";
import { recordActivity } from "../../lib/queries";
import { useAuthStore } from "../../store/auth";
import { QueryClientProvider } from "@tanstack/react-query";

/** Matches desktop sidebar width / min-height so SSR + client Suspense boundaries align. */
function SidebarSuspenseFallback() {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "block" },
        width: 260,
        height: "100%",
        flexShrink: 0,
        overflow: "hidden",
        bgcolor: "#fafafa",
        borderRight: "1px solid #edf2ef",
      }}
    />
  );
}

const pathToAction: Record<string, string> = {
  "/dashboard": "Viewed Dashboard",
  "/dashboard/providers": "Viewed Providers",
  "/dashboard/disbursement": "Viewed Disbursement",
  "/dashboard/staff": "Viewed Staff",
  "/dashboard/loan-request": "Viewed Loan Request",
  "/dashboard/loan-repayment": "Viewed Loan Repayment",
  "/dashboard/support": "Viewed Support",
  "/dashboard/survey": "Viewed Survey",
  "/dashboard/blog": "Viewed Blog",
  "/dashboard/marketing": "Viewed Marketing",
  "/dashboard/settings": "Viewed Settings",
};

type DashboardLayoutClientProps = {
  children: ReactNode;
};

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useAuthStore((state) => state.status);
  const token = useAuthStore((state) => state.token);
  const setLastAction = useAuthStore((state) => state.setLastAction);
  const lastLoginIp = useAuthStore((state) => state.lastLoginIp);
  const hasRehydrated = useAuthStore((state) => state._hasRehydrated);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const action = pathToAction[pathname ?? ""];
    if (action) {
      setLastAction(action);
      recordActivity({ action, ip: lastLoginIp ?? undefined });
    }
  }, [pathname, setLastAction, lastLoginIp]);

  useEffect(() => {
    if (!hasRehydrated) return;
    if (status !== "authenticated" || !token) {
      router.replace("/");
    }
  }, [router, status, token, hasRehydrated]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!useAuthStore.getState()._hasRehydrated) {
        useAuthStore.getState().setRehydrated();
      }
    }, 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
    <Box
      sx={{
        backgroundColor: "#fff",
        display: { xs: "flex", md: "grid" },
        flexDirection: { xs: "column", md: "unset" },
        height: "100dvh",
        maxHeight: "100dvh",
        overflow: "hidden",
        gridTemplateColumns: { md: "260px minmax(0, 1fr)" },
        gridTemplateRows: { md: "minmax(0, 1fr)" },
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
          borderRight: "1px solid #edf2ef",
        }}
      >
        <Suspense fallback={<SidebarSuspenseFallback />}>
          <DashboardSidebar />
        </Suspense>
      </Box>

      <Stack
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            display: { xs: "flex", md: "none" },
            flexShrink: 0,
            paddingX: 2,
            paddingY: 1.25,
            borderBottom: "1px solid #edf2ef",
            bgcolor: "#fff",
            zIndex: 2,
          }}
        >
          <Box
            component="img"
            src="/assets/svg/STILL PLAYLOGOBL.svg"
            alt="Still Play"
            sx={{ height: 28, width: "auto" }}
          />
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ display: { xs: "none", sm: "block" } }}>
              Menu
            </Typography>
            <IconButton onClick={() => setIsMobileOpen(true)} aria-label="Open menu" edge="end">
              <MenuIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
            padding: { xs: 1.5, sm: 2, md: 3 },
          }}
        >
          {children}
        </Box>
      </Stack>

      <Drawer
        open={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
        PaperProps={{
          sx: {
            width: "min(300px, 88vw)",
            height: "100%",
            maxHeight: "100dvh",
            overflow: "hidden",
          },
        }}
      >
        <Suspense fallback={<Box sx={{ width: "100%", minHeight: 200, bgcolor: "#fafafa" }} />}>
          <DashboardSidebar onNavigate={() => setIsMobileOpen(false)} />
        </Suspense>
      </Drawer>
    </Box>
    </QueryClientProvider>
  );
}
