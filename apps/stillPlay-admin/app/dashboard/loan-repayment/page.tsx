"use client";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { Avatar, Box, Pagination, Stack, Typography } from "@mui/material";
import { useState } from "react";

import DashboardHeader from "../../../components/dashboard/DashboardHeader";

export default function LoanRepaymentPage() {
  const [search, setSearch] = useState("");
  const rows = Array.from({ length: 25 }, (_, index) => ({
    name: "Chisom Kunle",
    amount: "N2,000",
    time: "10:15 AM",
    dueDate: "27 AUG 2023",
    id: index + 1,
  }));
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const pageRows = rows.slice(startIndex, startIndex + rowsPerPage);

  return (
    <Box>
      <DashboardHeader search={search} onSearchChange={setSearch} />
      <Box
        sx={{
          background: "#ffffff",
          borderRadius: { xs: 0, md: 4 },
          padding: { xs: 2, md: 3.5 },
          paddingBottom: { xs: 3, md: 4 },
          marginTop: { xs: 2, md: 3 },
          marginX: { xs: -2, md: 0 },
          minHeight: "calc(100vh - 220px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack sx={{ marginTop: "auto" }} spacing={2}>
          <Box
            sx={{
              borderRadius: 3,
              padding: 2,
              backgroundColor: "#f3f3f3",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack
              spacing={2}
              sx={{ marginBottom: 2, paddingTop: 2, paddingLeft: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                REPAYMENT
              </Typography>
              <Stack direction="row" spacing={4} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{
                    color: "#0b7b4c",
                    fontWeight: 600,
                    position: "relative",
                    paddingBottom: 0.5,
                  }}
                >
                  All loans
                  <Box
                    component="span"
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 2,
                      backgroundColor: "#0b7b4c",
                      borderRadius: 999,
                    }}
                  />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paid
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unpaid
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </Stack>
            </Stack>
            <Box
              sx={{
                fontSize: 12,
                color: "text.secondary",
                marginBottom: 2,
                backgroundColor: "#fff",
                borderRadius: 999,
                paddingY: 1.2,
                paddingX: 3,
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box>Name</Box>
              <Box>Amount</Box>
              <Box>Time</Box>
              <Box>Due date</Box>
            </Box>

            <Box
              sx={{
                marginTop: 1,
                maxHeight: { xs: 420, sm: "none" },
                overflowY: { xs: "auto", sm: "visible" },
              }}
            >
              <Stack spacing={0}>
                {pageRows.map((row, index) => (
                  <Box
                    key={`${row.id}`}
                    sx={{
                      paddingY: 2,
                      paddingX: 3,
                      borderBottom:
                        index === pageRows.length - 1
                          ? "none"
                          : "1px solid #fff",
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr 1fr",
                      alignItems: "center",
                      gap: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 36, height: 36 }} />
                      <Typography variant="body2">{row.name}</Typography>
                    </Stack>
                    <Typography variant="body2">{row.amount}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTimeOutlinedIcon
                        sx={{ fontSize: 18, color: "#6b6b6b" }}
                      />
                      <Typography variant="body2">{row.time}</Typography>
                    </Stack>
                    <Typography variant="body2">{row.dueDate}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
            <Stack alignItems="center" sx={{ marginTop: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
