import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProjectDetailClient from '@/app/projects/[id]/ProjectDetailClient';
import { getProject } from '@/features/projects/api/client';
import { siteConfig } from '@/shared/config/site';

type Params = { id: string };
type PageProps = { params?: Promise<Params> };

const fallbackDescription = 'DEEF 프로젝트의 상세 사진과 공간 정보를 확인하세요.';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = (await params) ?? { id: '' };
  const { id } = resolvedParams;
  const projectId = Number(id);
  const canonicalPath = Number.isNaN(projectId) ? '/projects' : `/projects/${projectId}`;

  if (Number.isNaN(projectId)) {
    return {
      title: 'Project',
      description: fallbackDescription,
      alternates: { canonical: canonicalPath },
    };
  }

  try {
    const project = await getProject(projectId);
    const description =
      project.description ||
      `${project.name} 프로젝트의 규모, 위치, 타입 등의 세부 정보를 확인하세요.`;

    const cover =
      project.images.find((img) => img.isLandCover)?.path ||
      project.photo ||
      siteConfig.ogImage;
    const ogImage = cover.startsWith('http') ? cover : `${siteConfig.url}${cover}`;

    return {
      title: project.name ?? 'Project',
      description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        url: `${siteConfig.url}${canonicalPath}`,
        title: project.name ?? 'Project',
        description,
        images: [{ url: ogImage, width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: project.name ?? 'Project',
        description,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: 'Project',
      description: fallbackDescription,
      alternates: { canonical: canonicalPath },
    };
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = (await params) ?? { id: '' };
  const projectId = Number(resolvedParams.id);
  if (Number.isNaN(projectId)) {
    notFound();
  }
  return <ProjectDetailClient id={projectId} />;
}
