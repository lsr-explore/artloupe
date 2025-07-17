import { SiteLayout } from "components";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "ArtLoupe",
	description: "AI-powered art analysis platform",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<SiteLayout>{children}</SiteLayout>
			</body>
		</html>
	);
}
