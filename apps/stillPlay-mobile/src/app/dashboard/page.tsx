"use client";

import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        pb: "calc(72px + env(safe-area-inset-bottom) + 160px)",
        overflow: "hidden",
        backgroundColor: "#F5F5F5",
      }}
    >
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Avatar
            src="https://i.pravatar.cc/100?img=12"
            alt="User avatar"
            sx={{ width: 40, height: 40 }}
          />
          <IconButton
            aria-label="Notifications"
            onClick={() => router.push("/dashboard/notifications")}
            sx={{
              border: "1px solid #E8E8E8",
              borderRadius: 2,
              width: 40,
              height: 40,
            }}
          >
            <NotificationsNoneIcon />
          </IconButton>
        </Stack>

        <Box>
          <Typography color="text.secondary" variant="body2">
            Available balance
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
            N421,002.00
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push("/dashboard/loan")}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              py: 1.2,
            }}
          >
            Get a Loan
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              py: 1.2,
            }}
          >
            Place a bet
          </Button>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: 2,
            backgroundColor: "#F8FAFC",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: "#E8F5EF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LockIcon sx={{ color: "#22C55E" }} />
            </Box>
            <Box>
              <Typography fontWeight={600}>Create a lock savings</Typography>
              <Typography color="text.secondary" variant="body2">
                Earn up to 15% in bitcoin when you lock funds.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          position: "fixed",
          left: 0,
          right: 0,
          bottom: "calc(72px + env(safe-area-inset-bottom))",
          px: 3,
          pt: 2.5,
          pb: 3,
          height: isExpanded ? "70vh" : "36vh",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          zIndex: 0,
          transition: "height 220ms ease",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography fontWeight={600}>Recent Activity</Typography>
          <Button
            variant="text"
            onClick={() => setIsExpanded((prev) => !prev)}
            sx={{
              minWidth: 0,
              px: 0,
              color: "warning.main",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {isExpanded ? "See Less" : "See More"}
          </Button>
        </Stack>

        <Stack
          spacing={2}
          sx={{
            overflowY: "auto",
            pr: 0.5,
          }}
        >
          {[
            {
              title: "Loan received",
              amount: "N25,000",
              date: "20 Aug, 2023",
            },
            {
              title: "Loan received",
              amount: "N5,000",
              date: "20 Aug, 2023",
            },
            {
              title: "Loan deducted",
              amount: "N25,000",
              date: "20 Aug, 2023",
              isDebit: true,
            },
          ].map((item, index) => (
            <Stack
              key={`${item.title}-${index}`}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: "#E8F5EF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography fontWeight={700} color="#22C55E">
                    ₦
                  </Typography>
                </Box>
                <Box>
                  <Typography fontWeight={600}>{item.title}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {item.date}
                  </Typography>
                </Box>
              </Stack>
              <Typography
                fontWeight={700}
                color={item.isDebit ? "error.main" : "text.primary"}
              >
                {item.isDebit ? `-${item.amount}` : item.amount}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
