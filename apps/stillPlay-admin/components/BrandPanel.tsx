"use client";

import { Box } from "@mui/material";
import { motion } from "framer-motion";

export default function BrandPanel() {
  return (
    <Box
      component={motion.div}
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      sx={{
        position: "relative",
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "linear-gradient(135deg, #f0b12a 0%, #0b7b4c 55%, #f0b12a 100%)",
        backgroundSize: "200% 200%",
      }}
    >
      <Box
        component={motion.img}
        src="/assets/svg/STILL PLAYLOGOWH.svg"
        alt="Still Play"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{ width: { xs: 140, md: 180 }, height: "auto" }}
      />
    </Box>
  );
}
