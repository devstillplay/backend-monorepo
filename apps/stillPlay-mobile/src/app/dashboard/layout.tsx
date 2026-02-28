"use client";

import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { CircularProgress } from "@mui/material";

import MobileFrame from "@/components/MobileFrame";
import useAuthStore from "@/store/useAuthStore";
import { isTokenExpired } from "@/lib/api";

const navigationItems = [
  { label: "Home", icon: <HomeIcon />, href: "/dashboard" },
  { label: "Explore", icon: <SportsSoccerIcon />, href: "/dashboard/explore" },
  { label: "Repayment", icon: <SendIcon />, href: "/dashboard/repayment" },
  { label: "Profile", icon: <PersonIcon />, href: "/dashboard/profile" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const status = useAuthStore((s) => s.status);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const reset = useAuthStore((s) => s.reset);

  // Use a local mounted flag instead of Zustand's _hasRehydrated.
  // This ensures server and client both render `false` on the first pass
  // (no React hydration mismatch). By the time the useEffect fires,
  // Zustand has already synced from localStorage (sync storage), so
  // auth state is ready to evaluate.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tokenExpired = isTokenExpired(token);
  const isInvalid =
    status !== "authenticated" || !token || !user?.id || tokenExpired;
  // Registered but not yet verified by an admin
  const isPendingVerification = !isInvalid && user?.verified === false;

  useEffect(() => {
    if (!isMounted) return;
    if (isInvalid) {
      reset();
      router.replace("/login");
    } else if (isPendingVerification) {
      router.replace("/pending-verification");
    }
  }, [isMounted, isInvalid, isPendingVerification, reset, router]);

  if (!isMounted || isInvalid || isPendingVerification) {
    return (
      <MobileFrame>
        <Box
          className="screen-content"
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <CircularProgress color="primary" />
        </Box>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <Box className="screen-content" sx={{ overflow: "hidden" }}>
        <Box
          sx={{
            flex: 1,
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {children}
        </Box>

        <Paper
          elevation={8}
          sx={{
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            position: "relative",
            zIndex: 2,
          }}
        >
          <BottomNavigation
            showLabels={false}
            value={pathname ?? "/dashboard"}
            onChange={(_, newValue) => {
              if (typeof newValue === "string" && newValue !== pathname) {
                router.push(newValue);
              }
            }}
            sx={{
              height: 72,
              "& .MuiBottomNavigationAction-root": {
                minWidth: 0,
                paddingY: 1.5,
              },
              "& .MuiSvgIcon-root": {
                fontSize: 30,
              },
            }}
          >
            {navigationItems.map((item) => (
              <BottomNavigationAction
                key={item.href}
                value={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </BottomNavigation>
        </Paper>
      </Box>
    </MobileFrame>
  );
}
