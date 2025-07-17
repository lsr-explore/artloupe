import React from "react";
import { Footer } from "./footer";
import { Header } from "./header";

export const SiteLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-grow">{children}</main>
			<Footer />
		</div>
	);
};
