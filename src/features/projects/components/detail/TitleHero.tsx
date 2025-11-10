'use client';

import Image from 'next/image';

import type { ProjectDetail } from '@/features/projects/api/client';

export default function TitleHero({ project }: { project: ProjectDetail }) {
  const landCover =
    project.images.find((img) => img.isLandCover)?.path ?? project.photo ?? null;

  return (
    <section className="relative w-full">
      <div>
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-none sm:rounded-xl">
          {landCover ? (
            <Image
              src={landCover}
              alt={project.name}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1400px"
              className="object-cover"
              blurDataURL="/_static/lqip/placeholder-16x9.jpg"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-neutral-500">
              No cover
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
