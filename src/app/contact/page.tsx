import type { Metadata } from 'next';

import ContactInfo from '@/features/contact/components/ContactInfo';
import { siteConfig } from '@/shared/config/site';

const description =
  'DEEF 스튜디오의 대표 연락처, 이메일, 스튜디오 위치와 SNS 채널을 확인하고 프로젝트를 문의하세요.';

export const metadata: Metadata = {
  title: 'Contact',
  description,
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    url: `${siteConfig.url}/contact`,
    title: 'Contact',
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
    title: 'Contact',
    description,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
};

export default function Contact() {
  return (
    <main>
      <ContactInfo />
    </main>
  );
}
