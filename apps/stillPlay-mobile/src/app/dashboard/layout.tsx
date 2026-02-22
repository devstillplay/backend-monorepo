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
import type { ReactNode } from "react";

import MobileFrame from "@/components/MobileFrame";

const navigationItems = [
  { label: "Home", icon: <HomeIcon />, href: "/dashboard" },
  { label: "Explore", icon: <SportsSoccerIcon />, href: "/dashboard/explore" },
  { label: "Repayment", icon: <SendIcon />, href: "/dashboard/repayment" },
  { label: "Profile", icon: <PersonIcon />, href: "/dashboard/profile" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

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
