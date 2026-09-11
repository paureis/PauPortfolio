import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import "./globals.css";

// Both faces are fetched at build time and served from the site itself,
// so the page makes no request to a font CDN. Display carries the
// positioning line, station headings, and entry titles; body carries the
// rest.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-display-loaded",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.profile.name}, AI engineer`,
  description: `${site.profile.positioning}, ${site.profile.tail}. ${site.profile.supporting}`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
