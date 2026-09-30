import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TripleArc — Governance, Risk & Compliance, made clear",
  description:
    "TripleArc GRC Solutions unifies governance, risk and compliance into one clear structure for regulated enterprises.",
};

export const viewport: Viewport = {
  themeColor: "#f5f7fb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
