'use client';

import { useEffect, useState } from 'react';

import ErrorBox from '@shared/components/common/ErrorBox';

import { useProjects } from '@/features/projects/api/hooks';
import ProjectsGrid from '@/features/projects/components/ProjectsGrid';
import { ProjectsGridSkeleton } from '@/features/projects/components/ProjectsGridSkeleton';
import VerticalSliderProjects from '@/features/projects/components/VerticalSlider';
import { VerticalSliderSkeleton } from '@/features/projects/components/VerticalSliderSkeleton';

function useIsDesktop(minWidth = 1024) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [minWidth]);

  return isDesktop;
}

export default function ProjectsPageClient() {
  const isDesktop = useIsDesktop(1024);
  const { data, isLoading, isError, refetch } = useProjects();

  if (isDesktop === null) {
    return <main className="min-h-screen" />;
  }

  if (isLoading) {
    return (
      <main className="min-h-screen">
        {isDesktop ? <ProjectsGridSkeleton /> : <VerticalSliderSkeleton />}
      </main>
    );
  }

  if (isError || !data) {
    const message = isError
      ? '프로젝트 목록을 불러오지 못했어요.'
      : '표시할 프로젝트가 없습니다.';
    return (
      <main className="min-h-screen flex items-center justify-center">
        <ErrorBox message={message} onRetry={isError ? () => refetch() : undefined} />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {isDesktop ? (
        <section className="py-6 md:py-6 my-16 md:my-21 px-layout-x-mobile md:px-layout-x-desktop">
          <ProjectsGrid data={data} maxPerRow={4} aspect="photo" />
        </section>
      ) : (
        <section>
          <VerticalSliderProjects data={data} />
        </section>
      )}
    </main>
  );
}
