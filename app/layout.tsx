import type { Metadata, Viewport } from "next";
import { Montserrat, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "TripleArc — Governance, Risk & Compliance, Engineered",
  description:
    "TripleArc GRC Solutions unifies governance, risk and compliance into one living architecture for regulated enterprises.",
};

export const viewport: Viewport = {
  themeColor: "#050d1a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
