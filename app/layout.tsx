import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "deslop — Precision Quality Control for AI Frontend Code",
  description:
    "Extract clean design systems and production-grade design.md files from any live URL. Eliminate AI hallucinations, random gradients, and generic slop.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="min-h-screen bg-[#FAFAFA] text-[#0A0D14] font-sans selection:bg-[#FF4800] selection:text-white">
        {children}
      </body>
    </html>
  );
}
