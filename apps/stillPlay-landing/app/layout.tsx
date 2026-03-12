import type { Metadata } from "next";
import type { ReactNode } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Still Play – Betting Credit Platform",
  description:
    "Still Play provides instant betting credit to verified sports bettors, delivered directly into betting wallets through secure integrations with betting platforms. Sure Odds, No Funds? STILL PLAY.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
