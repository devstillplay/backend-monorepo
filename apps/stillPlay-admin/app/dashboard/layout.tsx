"use client";

import { Box, Drawer, IconButton, Stack, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { recordActivity } from "../../lib/queries";
import { useAuthStore } from "../../store/auth";

const pathToAction: Record<string, string> = {
  "/dashboard": "Viewed Dashboard",
  "/dashboard/providers": "Viewed Providers",
  "/dashboard/staff": "Viewed Staff",
  "/dashboard/loan-request": "Viewed Loan Request",
  "/dashboard/loan-repayment": "Viewed Loan Repayment",
  "/dashboard/support": "Viewed Support",
  "/dashboard/settings": "Viewed Settings",
};

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
        minHeight: "100vh",
        backgroundColor: "#fff",
        display: { xs: "flex", md: "grid" },
        flexDirection: { xs: "column", md: "unset" },
        gridTemplateColumns: { md: "260px 1fr" },
      }}
    >
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <DashboardSidebar />
      </Box>

      <Stack sx={{ flex: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            display: { xs: "flex", md: "none" },
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

        <Box sx={{ padding: { xs: 2, md: 3 }, flex: 1 }}>{children}</Box>
      </Stack>

      <Drawer
        open={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
        PaperProps={{ sx: { width: 260 } }}
      >
        <DashboardSidebar onNavigate={() => setIsMobileOpen(false)} />
      </Drawer>
    </Box>
  );
}
