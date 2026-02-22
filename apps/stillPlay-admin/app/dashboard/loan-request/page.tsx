"use client";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import {
  Avatar,
  Box,
  Button,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import DashboardHeader from "../../../components/dashboard/DashboardHeader";

export default function LoanRequestPage() {
  const [search, setSearch] = useState("");
  const rows = Array.from({ length: 25 }, (_, index) => ({
    status:
      index % 3 === 0 ? "Approved" : index % 2 === 0 ? "Denied" : "Pending",
    statusColor:
      index % 3 === 0 ? "#22c55e" : index % 2 === 0 ? "#ef4444" : "#f9a826",
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
                LOAN REQUEST
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
                  All request
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
                  Denied
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Approved
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
                gridTemplateColumns: "1.2fr 1.6fr 1fr 1fr 1fr 160px",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box>Offline code</Box>
              <Box>Name</Box>
              <Box>Amount</Box>
              <Box>Time</Box>
              <Box>Status</Box>
              <Box />
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
                    key={`loan-${row.id}`}
                    sx={{
                      paddingY: 2,
                      paddingX: 3,
                      borderBottom:
                        index === pageRows.length - 1
                          ? "none"
                          : "1px solid #fff",
                      backgroundColor: index === 0 ? "#ffffff" : "transparent",
                      display: "grid",
                      gridTemplateColumns: "1.2fr 1.6fr 1fr 1fr 1fr 160px",
                      alignItems: "center",
                      gap: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      #1234BF
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32 }} />
                      <Typography variant="body2">Chisom Kunle</Typography>
                    </Stack>
                    <Typography variant="body2">N2,000</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTimeOutlinedIcon
                        sx={{ fontSize: 18, color: "#6b6b6b" }}
                      />
                      <Typography variant="body2">10:15 AM</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: row.statusColor,
                        }}
                      />
                      <Typography variant="body2">{row.status}</Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      {index === 0 ? (
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: "#ffd6d6",
                              color: "#6b3c3c",
                              boxShadow: "none",
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: "#d7f6d7",
                              color: "#1f5a1f",
                              boxShadow: "none",
                            }}
                          >
                            Approve
                          </Button>
                        </>
                      ) : null}
                    </Stack>
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
