"use client";

import type { ProjectDetail } from "@/features/projects/api/client";
import { cn } from "@/lib/utils";

type Props = { project: ProjectDetail };

export default function TitleHero({ project, fluid = false }: { project: ProjectDetail; fluid?: boolean }) {
  const landCover = project.images.find((img) => img.isLandCover)?.path ?? project.photo ?? null;

  return (
    <section className="relative w-full">
      <div className={cn("mx-auto", fluid ? "max-w-none px-0 mt-4 md:mt-0" : "max-w-[1400px] px-6 sm:px-10")}>
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-none sm:rounded-xl">
          {landCover ? (
            <img
              src={landCover}
              alt={project.name}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-neutral-500">
              No cover
            </div>
          )}

          <div className="absolute left-2 top-6 font-bold sm:left-10 sm:top-20">
            <h1 className="text-white text-24 sm:text-3xl md:text-48 tracking-tight drop-shadow">
              {project.name.toUpperCase()}
              {project.category ? <span> | {project.category.toUpperCase()}</span> : null}
            </h1>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        </div>
      </div>
    </section>
  );
}
