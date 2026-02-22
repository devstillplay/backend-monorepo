import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { ReactNode } from "react";

import BrandPanel from "./BrandPanel";

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          background: "#fff",
          borderRadius: 0,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "40% 60%" },
        }}
      >
        <BrandPanel />
        <Box
          sx={{
            padding: { xs: 3, md: 6 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            sx={{ width: "100%", maxWidth: 680 }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
