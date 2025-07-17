import Link from "next/link";
import React from "react";

export const Header = () => {
	return (
		<header className="flex justify-between items-center p-6 border-b">
			<Link href="/" className="flex items-center space-x-3">
				{}
				<img src="/loupe-logo.svg" alt="Loupe Logo" className="w-8 h-8" />
				<span className="text-2xl font-semibold">ArtLoupe.ai</span>
			</Link>
			<nav className="space-x-6 text-sm">
				<a href="/images/search?paintings" className="hover:underline">
					Paintings
				</a>
				<a href="/images/search?photos" className="hover:underline">
					Photos
				</a>
				<a href="/info/about" className="hover:underline">
					About
				</a>
			</nav>
		</header>
	);
};
