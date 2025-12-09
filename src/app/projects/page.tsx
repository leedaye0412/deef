import type { Metadata } from 'next';

import { siteConfig } from '@/shared/config/site';

import ProjectsPageClient from './ProjectsPageClient';

const description =
  'DEEF의 인테리어 프로젝트 포트폴리오를 살펴보고 공간별 사례를 확인하세요.';

export const metadata: Metadata = {
  title: 'Projects',
  description,
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    url: `${siteConfig.url}/projects`,
    title: 'Projects',
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
    title: 'Projects',
    description,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
