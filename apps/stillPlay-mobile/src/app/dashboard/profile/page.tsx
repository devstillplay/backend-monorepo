"use client";

import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import LogoutIcon from "@mui/icons-material/Logout";
import BadgeIcon from "@mui/icons-material/Badge";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { getProfile } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.reset);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const token = useAuthStore((state) => state.token);

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const p = await getProfile(token!);
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

  const ninSlip = profile?.ninSlip ?? null;
  const userNumber = profile?.userNumber ?? user?.userNumber ?? "—";
  const createdAt = profile?.createdAt ?? user?.createdAt;
  const onboardingDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Box sx={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          sx={{
            borderRadius: 3,
            p: 2.5,
            background:
              "linear-gradient(135deg, #C9A900 0%, #0F8B4C 52%, #C9A900 100%)",
            backgroundSize: "200% 200%",
            animation: "splashGradient 8s ease-in-out infinite",
          }}
        >
          <Stack spacing={5} alignItems="center" sx={{ position: "relative" }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                color: "#FFFFFF",
                alignSelf: "flex-start",
                marginBottom: 15,
              }}
            >
              Account
            </Typography>
            <Avatar
              src={user?.picture ?? "https://i.pravatar.cc/120?img=12"}
              sx={{
                width: 68,
                height: 68,
                border: "3px solid #FFFFFF",
                position: "absolute",
                top: 15,
                zIndex: 1,
              }}
            />
            <Box
              sx={{
                width: "100%",
                backgroundColor: "#FFFFFF",
                borderRadius: 2,
                px: 3,
                pt: 6,
                pb: 2,
                mt: 4,
              }}
            >
              <Stack spacing={0.5} alignItems="center">
                <Typography fontWeight={700}>
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.firstName ?? user?.email?.split("@")[0] ?? "User"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email ?? ""}
                </Typography>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" spacing={2}>
                <Box
                  sx={{
                    flex: 1,
                    p: 1,
                    backgroundColor: "#E6F1EB",
                    borderTopLeftRadius: 15,
                    borderBottomLeftRadius: 15,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Offline Key
                  </Typography>
                  <Typography fontWeight={700}>{userNumber}</Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    p: 1,
                    backgroundColor: "#E6F1EB",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: 15,
                    borderBottomRightRadius: 15,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Onboarding Date
                  </Typography>
                  <Typography fontWeight={700}>{onboardingDate}</Typography>
                </Box>
              </Stack>

              {ninSlip && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <BadgeIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                      <Typography variant="caption" fontWeight={700} color="text.secondary">
                        NIN SLIP
                      </Typography>
                    </Stack>
                    <Box
                      component="a"
                      href={ninSlip}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: "block",
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid #e4e7ec",
                        cursor: "pointer",
                        "&:hover": { opacity: 0.9 },
                        maxHeight: 180,
                      }}
                    >
                      <Box
                        component="img"
                        src={ninSlip}
                        alt="NIN slip"
                        sx={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                          maxHeight: 180,
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Tap to open full size
                    </Typography>
                  </Stack>
                </>
              )}
            </Box>
          </Stack>
        </Box>

        <Stack spacing={2}>
          {[
            { label: "Profile settings", icon: <PersonIcon /> },
            { label: "Payment Method", icon: <CreditCardIcon /> },
            { label: "Invite and earn", icon: <GroupAddIcon /> },
            { label: "Chat with us", icon: <ChatBubbleIcon /> },
            { label: "Log Out", icon: <LogoutIcon />, onClick: handleLogout },
          ].map((item) => (
            <Stack
              key={item.label}
              direction="row"
              spacing={2}
              alignItems="center"
              onClick={item.onClick}
              sx={{ cursor: item.onClick ? "pointer" : "default" }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: "#0F8B4C",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </Box>
              <Typography fontWeight={600}>{item.label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
