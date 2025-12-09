import type { Metadata } from 'next';

import ProjectsCoverSlider from '@/features/home/components/ProjectsCoverSlider';
import { siteConfig } from '@/shared/config/site';

const description =
  'DEEF는 상업 · 주거 공간을 기획하고 시각적 경험을 설계하는 인테리어 디자인 스튜디오입니다.';

export const metadata: Metadata = {
  title: 'Home',
  description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: siteConfig.url,
    title: 'Home',
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
    title: 'Home',
    description,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
};

export default function Home() {
  return (
    <main>
      <header className="sr-only">
        <h1>DEEF 대표 프로젝트</h1>
        <p>상업 및 주거 공간 디자인 사례를 확인하세요.</p>
      </header>
      <ProjectsCoverSlider />
    </main>
  );
}
