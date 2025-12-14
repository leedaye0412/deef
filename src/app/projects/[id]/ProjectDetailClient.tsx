'use client';

import ErrorBox from '@shared/components/common/ErrorBox';

import { useProject } from '@/features/projects/api/hooks';
import HorizontalRelated from '@/features/projects/components/detail/HorizontalRelated';
import ImagesStack from '@/features/projects/components/detail/ImagesStack';
import InfoBlock from '@/features/projects/components/detail/InfoBlock';
import ProjectDetailSkeleton from '@/features/projects/components/detail/ProjectDetailSkeleton';
import TitleHero from '@/features/projects/components/detail/TitleHero';

export default function ProjectDetailClient({ id }: { id: number }) {
  const { data, isLoading, isError, refetch } = useProject(id);

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <ErrorBox
          title="프로젝트 정보를 불러오지 못했어요"
          message="잠시 후 다시 시도해 주세요."
          onRetry={isError ? () => refetch() : undefined}
        />
      </main>
    );
  }

  return (
    <main>
      <TitleHero project={data} />
      <div className="px-layout-x-mobile md:px-layout-x-desktop py-layout-y-mobile md:py-layout-y-desktop">
        <InfoBlock project={data} />
        <ImagesStack project={data} />
      </div>
      <HorizontalRelated />
    </main>
  );
}
