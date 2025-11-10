import type { Metadata } from 'next';

import './globals.css';
import Footer from '@/shared/components/layout/Footer';
import Header from '@/shared/components/layout/Header';

import { lalezar } from './fonts/lalezar';
import { pretendard } from './fonts/pretendard';
import Providers from './providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.deef.kr'),
  title: {
    default: 'DEEF',
    template: '%s | DEEF',
  },
  description: '인테리어 디자인 스튜디오',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.deef.kr',
    siteName: 'DEEF',
    title: 'DEEF',
    description: '인테리어 디자인 스튜디오',
    images: [{ url: 'https://www.deef.kr/og.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DEEF',
    description: '인테리어 디자인 스튜디오',
    images: ['https://www.deef.kr/og.jpg'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${lalezar.variable}`}>
      <head>
        <link
          rel="preconnect"
          href="https://eqfioozgoqgrnpjvaacv.supabase.co"
          crossOrigin=""
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'DEEF',
              url: 'https://www.deef.kr',
              logo: 'https://www.deef.kr/deefLogo.png',
              sameAs: [
                'https://instagram.com/designstudio.deef',
                'https://www.youtube.com/channel/UCjdMYkq5E_TjJmFwDu2nwBQ',
                'https://blog.naver.com/deefdesignstudio',
              ],
            }),
          }}
        />
      </head>
      <body className="bg-background text-foreground font-lalezar antialiased">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
