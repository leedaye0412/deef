import type { Metadata } from "next";
import Container from "@shared/components/layout/Container";
import "./globals.css";
import { pretendard } from "./fonts/pretendard";
import { lalezar } from "./fonts/lalezar";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://deef.vercel.app"),
  title: {
    default: "DEEF",
    template: "%s | DEEF",
  },
  description: "인테리어 디자인 스튜디오",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "DEEF",
    title: "DEEF",
    description: "인테리어 디자인 스튜디오",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DEEF",
    description: "인테리어 디자인 스튜디오",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${lalezar.variable}`}>
      <head>
        <link rel="preconnect" href="https://eqfioozgoqgrnpjvaacv.supabase.co" crossOrigin="" />
      </head>
      <body className="min-h-dvh bg-background text-foreground font-lalezar antialiased">
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
