"use client";

import { Box, Drawer, IconButton, Stack, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactNode, Suspense, useEffect, useState } from "react";

/** Matches desktop sidebar width / min-height so SSR + client Suspense boundaries align (null fallback caused hydration mismatches). */
function SidebarSuspenseFallback() {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "block" },
        width: 260,
        height: "100vh",
        maxHeight: "100dvh",
        flexShrink: 0,
        overflow: "hidden",
        bgcolor: "#fafafa",
        borderRight: "1px solid #edf2ef",
      }}
    />
  );
}
import { usePathname, useRouter } from "next/navigation";

import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { recordActivity } from "../../lib/queries";
import { useAuthStore } from "../../store/auth";

const pathToAction: Record<string, string> = {
  "/dashboard": "Viewed Dashboard",
  "/dashboard/providers": "Viewed Providers",
  "/dashboard/disbursement": "Viewed Disbursement",
  "/dashboard/staff": "Viewed Staff",
  "/dashboard/loan-request": "Viewed Loan Request",
  "/dashboard/loan-repayment": "Viewed Loan Repayment",
  "/dashboard/support": "Viewed Support",
  "/dashboard/survey": "Viewed Survey",
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

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        display: { xs: "flex", md: "grid" },
        flexDirection: { xs: "column", md: "unset" },
        minHeight: { xs: "100dvh", md: "unset" },
        height: { md: "100dvh" },
        maxHeight: { md: "100dvh" },
        overflow: { md: "hidden" },
        gridTemplateColumns: { md: "260px 1fr" },
        gridTemplateRows: { md: "minmax(0, 1fr)" },
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
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
          height: { md: "100%" },
          overflow: { xs: "visible", md: "hidden" },
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
            paddingY: 1.5,
            borderBottom: "1px solid #edf2ef",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Dashboard
          </Typography>
          <IconButton onClick={() => setIsMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Stack>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: { xs: "visible", md: "auto" },
            WebkitOverflowScrolling: "touch",
            padding: { xs: 2, md: 3 },
          }}
        >
          {children}
        </Box>
      </Stack>

      <Drawer
        open={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
        PaperProps={{ sx: { width: 260 } }}
      >
        <Suspense
          fallback={
            <Box sx={{ width: "100%", minHeight: 200, bgcolor: "#fafafa" }} />
          }
        >
          <DashboardSidebar onNavigate={() => setIsMobileOpen(false)} />
        </Suspense>
      </Drawer>
    </Box>
  );
}
