import type { Metadata } from 'next';

import './globals.css';
import AuthHashRedirector from '@/features/admin/auth/components/AuthHashRedirector';
import Footer from '@/shared/components/layout/Footer';
import Header from '@/shared/components/layout/Header';
import { siteConfig } from '@/shared/config/site';

import { lalezar } from './fonts/lalezar';
import { pretendard } from './fonts/pretendard';
import Providers from './providers';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: '%s | DEEF',
  },
  description: siteConfig.defaultDescription,
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.defaultDescription,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.defaultDescription,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
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
          <AuthHashRedirector />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
