import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "도서출판 시프트 — 일상과 실무를 Shift하는 책",
    template: "%s | 도서출판 시프트",
  },
  description:
    "시프트 출판사는 새로운 모습, 능력을 발견하는 데 도움이 되는 책을 만듭니다. 올바른 지식과 정보가 가득 담긴 솔직하고 실용적인 책.",
  icons: {
    icon: [{ url: "/shift-logo.png", type: "image/png" }],
    apple: [{ url: "/shift-logo.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-void text-paper">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
