"use client";

import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Fab,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CircularProgress } from "@mui/material";

import MobileFrame from "@/components/MobileFrame";
import { openTawkChat } from "@/components/TawkToWidget";
import { DESKTOP_MAIN_MAX_WIDTH } from "@/lib/desktopLayout";
import useAuthStore from "@/store/useAuthStore";
import { isTokenExpired } from "@/lib/api";

const navigationItems = [
  { label: "Home", icon: <HomeIcon />, href: "/dashboard" },
  { label: "Explore", icon: <SportsSoccerIcon />, href: "/dashboard/explore" },
  { label: "Repayment", icon: <SendIcon />, href: "/dashboard/repayment" },
  { label: "Profile", icon: <PersonIcon />, href: "/dashboard/profile" },
] as const;

/** Match nested routes (e.g. /dashboard/loan) to the correct tab. */
function getNavSelection(pathname: string): string {
  const sorted = [...navigationItems].sort(
    (a, b) => b.href.length - a.href.length
  );
  for (const item of sorted) {
    if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
      return item.href;
    }
  }
  return "/dashboard";
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() ?? "/dashboard";

  const status = useAuthStore((s) => s.status);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const reset = useAuthStore((s) => s.reset);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tokenExpired = isTokenExpired(token);
  const isInvalid =
    status !== "authenticated" || !token || !user?.id || tokenExpired;
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

  const selectedHref = useMemo(() => getNavSelection(pathname), [pathname]);
  const sidebarUserLabel = useMemo(() => {
    if (!user) return "";
    const first = user.firstName?.trim();
    const last = user.lastName?.trim();
    if (first && last) return `${first} ${last}`;
    if (first) return first;
    if (last) return last;
    return user.email?.split("@")[0] ?? "Account";
  }, [user]);

  const handleLogout = () => {
    reset();
    router.replace("/");
  };

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
      <Box
        className="screen-content"
        sx={{
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
          bgcolor: { xs: "background.paper", md: "grey.50" },
        }}
      >
        {/* Desktop sidebar */}
        <Paper
          component="nav"
          elevation={0}
          square
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            width: 260,
            flexShrink: 0,
            borderRight: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            py: 2,
            minHeight: "100vh",
          }}
        >
          <Box sx={{ px: 2.5, pb: 2, pt: 0.5 }}>
            <Box
              component={Link}
              href="/dashboard"
              sx={{
                display: "block",
                lineHeight: 0,
                mb: 1,
                "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 4, borderRadius: 1 },
              }}
            >
              <Box
                component="img"
                src="/assets/svg/STILL PLAYLOGOBL.svg"
                alt="Still Play"
                sx={{ width: "100%", maxWidth: 200, height: "auto", display: "block" }}
              />
            </Box>
            <Typography variant="body2" fontWeight={600} color="text.primary" noWrap title={sidebarUserLabel}>
              {sidebarUserLabel}
            </Typography>
          </Box>
          <List
            disablePadding
            sx={{ flex: 1, minHeight: 0, overflow: "auto", px: 1 }}
          >
            {navigationItems.map((item) => {
              const selected = selectedHref === item.href;
              return (
                <ListItemButton
                  key={item.href}
                  component={Link}
                  href={item.href}
                  selected={selected}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": { bgcolor: "primary.dark" },
                      "& .MuiListItemIcon-root": { color: "inherit" },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 44,
                      color: selected ? "inherit" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: selected ? 700 : 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>

          <Box
            sx={{
              flexShrink: 0,
              px: 1,
              pt: 1,
              pb: 2,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                color: "error.main",
                "&:hover": { bgcolor: "error.50" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 44, color: "error.main" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Log out"
                primaryTypographyProps={{ fontWeight: 600, fontSize: "0.95rem" }}
              />
            </ListItemButton>
          </Box>
        </Paper>

        {/* Main column: scrollable content + mobile bottom bar */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            minHeight: 0,
            maxWidth: { md: "calc(100vw - 260px)" },
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              minHeight: 0,
              WebkitOverflowScrolling: "touch",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: { md: DESKTOP_MAIN_MAX_WIDTH },
                mx: "auto",
                px: { xs: 2, sm: 2.5, md: 4 },
                py: { xs: 2, md: 3 },
                minHeight: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {children}
            </Box>
          </Box>

          <Paper
            elevation={8}
            sx={{
              display: { xs: "block", md: "none" },
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              position: "relative",
              zIndex: 2,
              flexShrink: 0,
            }}
          >
            <BottomNavigation
              showLabels={false}
              value={selectedHref}
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
      </Box>

      <Fab
        color="primary"
        aria-label="Chat with support"
        onClick={() => openTawkChat()}
        sx={{
          position: "fixed",
          zIndex: (theme) => theme.zIndex.speedDial,
          right: { xs: 20, md: 28 },
          bottom: {
            xs: "calc(72px + env(safe-area-inset-bottom, 0px) + 16px)",
            md: "calc(24px + env(safe-area-inset-bottom, 0px))",
          },
          boxShadow: 6,
        }}
      >
        <ChatBubbleIcon />
      </Fab>
    </MobileFrame>
  );
}
