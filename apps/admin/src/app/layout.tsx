import React from "react";

// apps/admin/src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactQueryProvider } from "./react-query-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "artloupe Admin",
  description: "Admin panel for artloupe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
