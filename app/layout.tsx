import type { Metadata } from "next";
import type { ReactNode } from "react";
import { profile } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profile.name}, AI engineer`,
  description: profile.positioning,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
