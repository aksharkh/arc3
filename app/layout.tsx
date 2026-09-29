import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const sans = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "TripleArc — Governance, Risk & Compliance",
  description:
    "TripleArc GRC Solutions unifies governance, risk and compliance into one structure for regulated enterprises.",
};

export const viewport: Viewport = {
  themeColor: "#07111f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
