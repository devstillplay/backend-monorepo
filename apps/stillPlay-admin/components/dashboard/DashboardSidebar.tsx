"use client";

import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import {
  Badge,
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  Avatar,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { uploadImage } from "../../lib/api";
import { useAllLoans, useUpdateAdminUser } from "../../lib/queries";
import { useAuthStore } from "../../store/auth";
import { useUserStore } from "../../store/user";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: <DashboardOutlinedIcon /> },
  { label: "Users", href: "/dashboard?tab=users", icon: <PeopleAltOutlinedIcon /> },
  {
    label: "Providers",
    href: "/dashboard/providers",
    icon: <AccountBalanceOutlinedIcon />,
  },
  {
    label: "Staff",
    href: "/dashboard/staff",
    icon: <BadgeOutlinedIcon />,
  },
  {
    label: "Loan Request",
    href: "/dashboard/loan-request",
    icon: <RequestQuoteOutlinedIcon />,
  },
  {
    label: "Loan Repayment",
    href: "/dashboard/loan-repayment",
    icon: <PaymentsOutlinedIcon />,
  },
  {
    label: "Support",
    href: "/dashboard/support",
    icon: <SupportAgentOutlinedIcon />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <SettingsOutlinedIcon />,
  },
];

type DashboardSidebarProps = {
  onNavigate?: () => void;
};

export default function DashboardSidebar({
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [successSnackOpen, setSuccessSnackOpen] = useState(false);
  const [errorSnackOpen, setErrorSnackOpen] = useState(false);
  const [errorSnackMessage, setErrorSnackMessage] = useState("");
  const reset = useAuthStore((state) => state.reset);
  const token = useAuthStore((state) => state.token);
  const fullName = useAuthStore((state) => state.fullName);
  const authUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const resetUser = useUserStore((state) => state.reset);
  const updateUserMutation = useUpdateAdminUser();
  const { data: loansData } = useAllLoans();
  const pendingLoanCount =
    loansData?.loans?.filter((l) => l.status === "PENDING").length ?? 0;

  const displayName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`.trim()
      : profile?.firstName ?? profile?.email ?? fullName ?? "Admin";

  const roleLabel =
    profile?.role ?? authUser?.role
      ? String(profile?.role ?? authUser?.role).trim()
      : "Admin";

  const email = profile?.email ?? authUser?.email ?? "";
  const profilePicture = profile?.picture ?? authUser?.picture ?? null;
  const currentUserId = profile?.id ?? authUser?.id;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!currentUserId || !token) {
      setErrorSnackMessage("Cannot update photo: session or user id missing. Try logging in again.");
      setErrorSnackOpen(true);
      e.target.value = "";
      return;
    }
    setUploadingPhoto(true);
    try {
      const result = await uploadImage(file, {
        folder: "stillplay/avatars",
        token,
      });
      updateUserMutation.mutate(
        { id: currentUserId, payload: { picture: result.secureUrl } },
        {
          onSuccess: () => {
            const url = result.secureUrl;
            if (profile) setProfile({ ...profile, picture: url });
            if (authUser) setUser({ ...authUser, picture: url });
            setSuccessSnackOpen(true);
          },
          onSettled: () => setUploadingPhoto(false),
        }
      );
    } catch (err) {
      console.error(err);
      setUploadingPhoto(false);
      setErrorSnackMessage(err instanceof Error ? err.message : "Upload failed");
      setErrorSnackOpen(true);
    } finally {
      e.target.value = "";
    }
  };

  const handleLogout = () => {
    reset();
    resetUser();
    router.push("/");
  };

  return (
    <Stack
      component={motion.aside}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      sx={{
        padding: { xs: 2, md: 3 },
        height: "100%",
        minHeight: "100vh",
        justifyContent: "space-between",
      }}
    >
      <Stack spacing={3}>
        <Box
          component="img"
          src="/assets/svg/STILL PLAYLOGOBL.svg"
          alt="Still Play"
          sx={{ width: 140, height: "auto", marginX: "auto" }}
        />
        <Box sx={{ textAlign: "center" }}>
          <input
            id="sidebar-avatar-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            aria-label="Upload profile photo"
            disabled={uploadingPhoto || updateUserMutation.isPending}
            onChange={handlePhotoChange}
          />
          <Box
            component="label"
            htmlFor="sidebar-avatar-upload"
            sx={{
              position: "relative",
              display: "inline-block",
              margin: "0 auto 8px",
              cursor: currentUserId ? "pointer" : "default",
            }}
          >
            <Avatar
              src={profilePicture ?? undefined}
              sx={{
                width: 76,
                height: 76,
                border: "2px solid #0b7b4c",
                opacity: uploadingPhoto || updateUserMutation.isPending ? 0.7 : 1,
              }}
            >
              {(displayName?.[0] ?? "?").toUpperCase()}
            </Avatar>
            {(uploadingPhoto || updateUserMutation.isPending) && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  bgcolor: "rgba(0,0,0,0.4)",
                  pointerEvents: "none",
                }}
              >
                <CircularProgress size={32} sx={{ color: "white" }} />
              </Box>
            )}
          </Box>
          <Typography variant="subtitle2">
            {displayName.toUpperCase()}
          </Typography>
          {email ? (
            <Typography variant="caption" color="text.secondary" display="block">
              {email}
            </Typography>
          ) : null}
          <Typography variant="caption" color="primary">
            {roleLabel.toUpperCase()}
          </Typography>
        </Box>
        <Divider sx={{ opacity: 0.5 }} />
        <Stack spacing={1}>
          {navItems.map((item) => {
            const isOverview = item.href === "/dashboard" && !item.href.includes("?");
            const isUsers = item.href.includes("tab=users");
            const isActive = isOverview
              ? pathname === "/dashboard" && tab !== "users"
              : isUsers
                ? pathname === "/dashboard" && tab === "users"
                : pathname === item.href.split("?")[0];
            const showBadge =
              item.href === "/dashboard/loan-request" && pendingLoanCount > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: "none" }}
              >
                <Button
                  fullWidth
                  variant="text"
                  startIcon={
                    showBadge ? (
                      <Badge
                        badgeContent={pendingLoanCount}
                        color="error"
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: 11,
                            fontWeight: 700,
                            minWidth: 18,
                            height: 18,
                          },
                        }}
                      >
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )
                  }
                  onClick={onNavigate}
                  sx={{
                    justifyContent: "flex-start",
                    color: isActive ? "#f59e0b" : "text.primary",
                    backgroundColor: isActive ? "#f3f3f3" : "transparent",
                    borderRadius: 999,
                    paddingY: 1,
                    paddingX: 2,
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </Stack>
        <Link href="/dashboard/staff" style={{ textDecoration: "none" }}>
          <Button variant="contained" size="small" fullWidth onClick={onNavigate}>
            Create Admin Account
          </Button>
        </Link>
      </Stack>

      <Stack spacing={2}>
        <Divider sx={{ opacity: 0.5 }} />
        <Button
          variant="text"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ justifyContent: "flex-start" }}
        >
          Log out
        </Button>
      </Stack>

      <Snackbar
        open={successSnackOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessSnackOpen(false)}
        message="Profile photo updated successfully"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: { bgcolor: "success.main", color: "success.contrastText" },
        }}
      />
      <Snackbar
        open={errorSnackOpen}
        autoHideDuration={6000}
        onClose={() => setErrorSnackOpen(false)}
        message={errorSnackMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: { bgcolor: "error.main", color: "error.contrastText" },
        }}
      />
    </Stack>
  );
}
