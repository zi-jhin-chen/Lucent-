import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "Lucent - 您的風格與內容助理",
  description:
    "一個風格與內容助理，讓您的數位形象與個人本質保持一致。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head />
      <body className={cn("font-body antialiased", lora.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
