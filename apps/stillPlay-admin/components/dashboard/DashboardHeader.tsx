"use client";

import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

type DashboardHeaderProps = {
  search: string;
  onSearchChange: Dispatch<SetStateAction<string>>;
};

export default function DashboardHeader({
  search,
  onSearchChange,
}: DashboardHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems={{ xs: "stretch", md: "center" }}
      justifyContent="space-between"
      spacing={2}
      sx={{ marginBottom: 3 }}
    >
      <TextField
        placeholder="Search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#97a6a0" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          width: { xs: "100%", sm: 320, md: 380 },
          alignSelf: { xs: "stretch", md: "flex-start" },
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f3f3f3",
            borderRadius: 999,
            "& fieldset": { border: "none" },
            "&:hover fieldset": { border: "none" },
            "&.Mui-focused fieldset": { border: "none" },
          },
        }}
      />
      <Box />
    </Stack>
  );
}
