import type { Metadata } from "next";
import { Fredoka, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

import { AuthProvider } from "@/lib/auth/auth-context";

export const metadata: Metadata = {
  title: "deslop",
  description:
    "Extract clean design systems and production-grade design.md files from any live URL. Eliminate AI hallucinations, random gradients, and generic slop.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} antialiased`}>
      <body className="min-h-screen bg-[#FAFAFA] text-[#0A0D14] font-sans selection:bg-[#FF4800] selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
