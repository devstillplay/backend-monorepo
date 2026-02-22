"use client";

import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";

export default function DesktopOnlyDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setOpen(window.innerWidth >= 768);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  return (
    <Dialog open={open} disableEscapeKeyDown onClose={() => {}}>
      <DialogTitle>Mobile only experience</DialogTitle>
      <DialogContent>
        Still Play is designed for mobile screens. Switch to a phone-sized
        window or use a mobile device for the best experience.
      </DialogContent>
    </Dialog>
  );
}
