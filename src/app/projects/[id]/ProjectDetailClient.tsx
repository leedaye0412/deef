"use client";

import { useProject } from "@/features/projects/api/hooks";
import TitleHero from "@/features/projects/components/detail/TitleHero";
import InfoBlock from "@/features/projects/components/detail/InfoBlock";
import ImagesStack from "@/features/projects/components/detail/ImagesStack";
import HorizontalRelated from "@/features/projects/components/detail/HorizontalRelated";
import FullBleed from "@/shared/components/layout/FullBleed";
import ProjectDetailSkeleton from "@/features/projects/components/detail/ProjectDetailSkeleton";

export default function ProjectDetailClient({ id }: { id: number }) {
  const { data, isLoading, isError } = useProject(id);

    if (isLoading) {
      return <ProjectDetailSkeleton />;
    }
  
  if (isError || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-200">
        Failed to load project.
      </main>
    );
  }

  return (
    <main className="min-h-screen ">
      <FullBleed>
        <TitleHero project={data} fluid />
      </FullBleed>
      <InfoBlock project={data} />
      <ImagesStack project={data} />
      <FullBleed>
        <HorizontalRelated fluid />
      </FullBleed>
    </main>
  );
}
