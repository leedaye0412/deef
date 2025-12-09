import type { Metadata } from 'next';

import Introduce from '@/features/about/components/Introduce';
import { siteConfig } from '@/shared/config/site';

const description =
  'DEEF 공동대표가 소개하는 디자인 철학과 공간을 바라보는 가치관을 만나보세요.';

export const metadata: Metadata = {
  title: 'About',
  description,
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    url: `${siteConfig.url}/about`,
    title: 'About',
    description,
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
    title: 'About',
    description,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
};

export default function About() {
  return <Introduce />;
}
