import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "deslop — Stop shipping AI slop. Start shipping design.",
  description:
    "Generate complete design.md files from any live website. Extract colors, typography, spacing, and components into a structured design system ready for Cursor, v0, and any AI tool.",
  keywords: [
    "design system",
    "design tokens",
    "AI design",
    "design.md",
    "design system generator",
  ],
  openGraph: {
    title: "deslop — Stop shipping AI slop. Start shipping design.",
    description:
      "Generate complete design.md files from any live website. Extract colors, typography, spacing, and components.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
