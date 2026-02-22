"use client";

import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/navigation";

const notifications = [
  {
    section: "Today",
    items: [
      {
        title: "You have just received a loan",
        date: "20 Aug, 2023",
        amount: "N25,000",
      },
      {
        title: "You have just received a loan",
        date: "20 Aug, 2023",
        amount: "N25,000",
      },
      {
        title: "You have just received a loan",
        date: "20 Aug, 2023",
        amount: "N25,000",
      },
    ],
  },
  {
    section: "Yesterday",
    items: [
      {
        title: "You have just received a loan",
        date: "20 Aug, 2023",
        amount: "N25,000",
      },
      {
        title: "You have just received a loan",
        date: "20 Aug, 2023",
        amount: "N25,000",
      },
      {
        title: "You have just received a loan",
        date: "20 Aug, 2023",
        amount: "N25,000",
      },
    ],
  },
];

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <Box
      className="screen-content"
      sx={{ backgroundColor: "#FFFFFF", flex: 1 }}
    >
      <Stack spacing={2} sx={{ p: 3, flex: 1, overflow: "hidden" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton aria-label="Back" onClick={() => router.back()}>
              <ArrowBackIcon />
            </IconButton>
            <Typography fontWeight={700} variant="h6">
              Notification
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton aria-label="Search">
              <SearchIcon />
            </IconButton>
            <IconButton aria-label="More">
              <MoreVertIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Box sx={{ flex: 1, overflowY: "auto", pb: 10 }}>
          <Stack spacing={3}>
            {notifications.map((group) => (
              <Stack key={group.section} spacing={2}>
                <Typography fontWeight={700}>{group.section}</Typography>
                <Stack spacing={2}>
                  {group.items.map((item, index) => (
                    <Stack key={`${group.section}-${index}`} spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            backgroundColor: "#E6F1EB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              backgroundColor: "#0F8B4C",
                            }}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={600}>{item.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.date}
                          </Typography>
                        </Box>
                        <Typography fontWeight={600}>{item.amount}</Typography>
                      </Stack>
                      <Divider />
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
