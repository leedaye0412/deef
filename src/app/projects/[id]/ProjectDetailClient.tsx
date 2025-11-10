'use client';

import { useProject } from '@/features/projects/api/hooks';
import HorizontalRelated from '@/features/projects/components/detail/HorizontalRelated';
import ImagesStack from '@/features/projects/components/detail/ImagesStack';
import InfoBlock from '@/features/projects/components/detail/InfoBlock';
import ProjectDetailSkeleton from '@/features/projects/components/detail/ProjectDetailSkeleton';
import TitleHero from '@/features/projects/components/detail/TitleHero';

export default function ProjectDetailClient({ id }: { id: number }) {
  const { data, isLoading, isError } = useProject(id);

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <main className="flex items-center justify-center">Failed to load project.</main>
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
