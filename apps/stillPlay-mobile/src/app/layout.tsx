import type { Metadata } from "next";

import DesktopOnlyDialog from "@/components/DesktopOnlyDialog";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Still Play",
  description: "Still Play mobile web experience"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <DesktopOnlyDialog />
          {children}
        </Providers>
      </body>
    </html>
  );
}
