import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { THEME_STORAGE_KEY } from "@/lib/themes";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://shiftbook.co.kr";
const SITE_NAME = "도서출판 시프트";
const SITE_TITLE = "도서출판 시프트 — 일상과 실무를 Shift하는 책";
const SITE_DESCRIPTION =
  "시프트 출판사는 새로운 모습, 능력을 발견하는 데 도움이 되는 책을 만듭니다. 올바른 지식과 정보가 가득 담긴 솔직하고 실용적인 책.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | 도서출판 시프트",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

const themeBootScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)},t=localStorage.getItem(k),a=["blue","ink","forest","wine","slate"];document.documentElement.dataset.theme=t&&a.indexOf(t)!==-1?t:"blue"}catch(e){document.documentElement.dataset.theme="blue"}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistMono.variable} h-full antialiased`} data-theme="blue">
      <body className="min-h-full flex flex-col bg-void text-paper break-keep">
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
