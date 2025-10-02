import type { Metadata } from "next";
import Container from "@shared/components/layout/Container";
import "./globals.css";
import { pretendard } from "./fonts/pretendard";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"), // 배포 도메인
  title: {
    default: "DEEF",
    template: "%s | DEEF",
  },
  description: "서비스 한 줄 소개(120~160자 추천).",
  alternates: {
    canonical: "/", // 기본 canonical
    // languages: { "ko-KR": "/", "en-US": "/en" }, // 다국어 쓰면 추가
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "DEEF",
    title: "DEEF",
    description: "서비스 한 줄 소개.",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DEEF",
    description: "서비스 한 줄 소개.",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="min-h-dvh bg-background text-foreground font-pretendard antialiased">
        <Providers>
          <Container>
            <Header />
            {children}
            <Footer />
          </Container>
        </Providers>
      </body>
    </html>
  );
}
