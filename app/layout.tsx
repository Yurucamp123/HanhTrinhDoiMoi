import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import CozeChat from "@/components/CozeChat";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hành trình đổi đời - Câu chuyện giai cấp Việt Nam",
  description:
    "Theo chân nhân vật Nam trong hành trình từ nông dân đến công nhân, rồi trí thức kỹ sư. Khám phá sự biến đổi giai cấp trong thời kỳ quá độ lên CNXH ở Việt Nam.",
  generator: "Binh",
  keywords:
    "Việt Nam, giai cấp, CNXH, nông dân, công nhân, trí thức, liên minh",
  openGraph: {
    title: "Hành trình đổi đời - Câu chuyện giai cấp Việt Nam",
    description:
      "Câu chuyện về sự biến đổi giai cấp trong thời kỳ quá độ lên CNXH ở Việt Nam",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${inter.variable}`}
      >
        <Suspense fallback={null}>
          {children}
          <CozeChat />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
