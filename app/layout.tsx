import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "创意导航 - 探索我的创意工具箱",
  description: "汇聚AI创意、时尚生活、趣味游戏与智能工具，为你打造一站式的创意探索之旅",
  keywords: "创意工具,AI工具,在线工具,实用工具,创意导航",
  authors: [{ name: "Claude Code" }],
  openGraph: {
    title: "创意导航 - 探索我的创意工具箱",
    description: "汇聚AI创意、时尚生活、趣味游戏与智能工具",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
