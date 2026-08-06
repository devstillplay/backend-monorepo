"use client";

import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { uploadImage } from "../../lib/api";
import { useAdminUsers, useAllLoans, useUpdateAdminUser } from "../../lib/queries";
import { isCustomerSupportRole, useAuthStore } from "../../store/auth";
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
    label: "Disbursement",
    href: "/dashboard/disbursement",
    icon: <SendOutlinedIcon />,
  },
  {
    label: "Staff",
    href: "/dashboard/staff",
    icon: <BadgeOutlinedIcon />,
  },
  {
    label: "Loans",
    href: "/dashboard/loan-request",
    icon: <RequestQuoteOutlinedIcon />,
  },
  {
    label: "Loan Repayment",
    href: "/dashboard/loan-repayment",
    icon: <PaymentsOutlinedIcon />,
  },
  {
    label: "Survey",
    href: "/dashboard/survey?tab=waitlist",
    icon: <PollOutlinedIcon />,
  },
  {
    label: "Blog",
    href: "/dashboard/blog",
    icon: <ArticleOutlinedIcon />,
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
  /** Avoid SSR vs client mismatch: URL tab is only applied after mount. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tab = mounted ? searchParams.get("tab") : null;
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
  const { data: users = [] } = useAdminUsers();
  const { data: loansData } = useAllLoans();
  const pendingVerificationCount = useMemo(
    () => users.filter((u) => !(u.verified ?? false)).length,
    [users]
  );
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

  const hideAdminOnlyNav = isCustomerSupportRole(
    profile?.role ?? authUser?.role
  );
  const visibleNavItems = useMemo(
    () =>
      hideAdminOnlyNav
        ? navItems.filter(
            (item) =>
              item.href !== "/dashboard" &&
              item.href !== "/dashboard/providers" &&
              item.href !== "/dashboard/staff"
          )
        : navItems,
    [hideAdminOnlyNav]
  );

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
      initial={false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      sx={{
        padding: { xs: 2, md: 3 },
        height: "100vh",
        maxHeight: "100dvh",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack spacing={3} sx={{ flexShrink: 0 }}>
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
      </Stack>

      <Stack
        spacing={1}
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          py: 1,
        }}
      >
        {visibleNavItems.map((item) => {
          const isOverview = item.href === "/dashboard" && !item.href.includes("?");
          const isUsers = item.href.includes("tab=users");
          const hrefPath = item.href.split("?")[0];
          const isSurvey = hrefPath === "/dashboard/survey";
          const isActive = isOverview
            ? pathname === "/dashboard" && tab !== "users"
            : isUsers
              ? pathname === "/dashboard" && tab === "users"
              : isSurvey
                ? pathname === "/dashboard/survey"
                : pathname === hrefPath;
          const showLoanBadge =
            item.href === "/dashboard/loan-request" && pendingLoanCount > 0;
          const showUsersBadge =
            isUsers && pendingVerificationCount > 0;
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
                  showLoanBadge ? (
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
                  ) : showUsersBadge ? (
                    <Badge
                      badgeContent={pendingVerificationCount}
                      color="warning"
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
        {!hideAdminOnlyNav ? (
          <Link href="/dashboard/staff" style={{ textDecoration: "none" }}>
            <Button variant="contained" size="small" fullWidth onClick={onNavigate}>
              Create Admin Account
            </Button>
          </Link>
        ) : null}
      </Stack>

      <Stack spacing={2} sx={{ flexShrink: 0, pt: 2 }}>
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
