import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

// Variable on both weight and width — the titles lean on the width axis.
const sans = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "TripleArc — Governance · Risk · Compliance",
  description: "Turn the dial. TripleArc GRC Solutions holds governance, risk and compliance in one structure.",
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
