import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/__tests__/test-utilities";
import { Header } from "./header";

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...properties
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...properties}>
      {children}
    </a>
  ),
}));

describe("Header", () => {
  it("renders the header with logo and brand name", () => {
    render(<Header />);

    // Check if the logo image is rendered
    const logo = screen.getByAltText("Loupe Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/loupe-logo.svg");
    expect(logo).toHaveClass("w-8", "h-8");

    // Check if the brand name is rendered
    const brandName = screen.getByText("ArtLoupe.ai");
    expect(brandName).toBeInTheDocument();
    expect(brandName).toHaveClass("text-2xl", "font-semibold");
  });

  it("renders navigation links", () => {
    render(<Header />);

    // Check if all navigation links are present
    const paintingsLink = screen.getByText("Paintings");
    const photosLink = screen.getByText("Photos");
    const aboutLink = screen.getByText("About");

    expect(paintingsLink).toBeInTheDocument();
    expect(photosLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();

    // Check if links have correct href attributes
    expect(paintingsLink).toHaveAttribute("href", "/images/search?paintings");
    expect(photosLink).toHaveAttribute("href", "/images/search?photos");
    expect(aboutLink).toHaveAttribute("href", "/info/about");
  });

  it("renders the home link with correct structure", () => {
    render(<Header />);

    // Check if the home link is rendered
    const homeLink = screen.getByRole("link", { name: /artloupe\.ai/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
    expect(homeLink).toHaveClass("flex", "items-center", "space-x-3");
  });

  it("applies correct styling classes", () => {
    render(<Header />);

    // Check header element styling
    const header = screen.getByRole("banner");
    expect(header).toHaveClass(
      "flex",
      "justify-between",
      "items-center",
      "p-6",
      "border-b",
    );

    // Check navigation styling
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("space-x-6", "text-sm");
  });

  it("renders all navigation links with hover effects", () => {
    render(<Header />);

    const navigationLinks = screen.getAllByRole("link");

    // Should have 4 links total (home + 3 nav links)
    expect(navigationLinks).toHaveLength(4);

    // Check that nav links have hover classes
    const navLinks = navigationLinks.slice(1); // Exclude home link
    for (const link of navLinks) {
      expect(link).toHaveClass("hover:underline");
    }
  });

  it("has proper semantic HTML structure", () => {
    render(<Header />);

    // Check for header element
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    // Check for navigation element
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();

    // Check for logo image
    const logo = screen.getByAltText("Loupe Logo");
    expect(logo).toBeInTheDocument();
  });
});
