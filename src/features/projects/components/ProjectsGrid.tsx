"use client";

import Link from "next/link";
import Image from "next/image";
import { memo } from "react";
import { useProjects } from "@/features/projects/api/hooks";
import type { ProjectListItem } from "@/features/projects/api/client";

type Props = {
  maxPerRow?: 1 | 2 | 3 | 4;
  gapClass?: string;
  hrefFor?: (p: ProjectListItem) => string;
  aspect?: "square" | "video" | "photo";
};

const aspectToClass: Record<NonNullable<Props["aspect"]>, string> = {
  square: "aspect-square",
  video: "aspect-video",
  photo: "aspect-[3/4]",
};

function ProjectsGrid({
  maxPerRow = 4,
  gapClass = "gap-6",
  hrefFor = (p) => `/projects/${p.projectId}`,
  aspect = "photo",
}: Props) {
  const { data, isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className={`w-full ${aspectToClass[aspect]} rounded-xl bg-neutral-800`} />
            <div className="mt-3 h-3 w-2/3 rounded bg-neutral-800" />
            <div className="mt-2 h-3 w-1/3 rounded bg-neutral-800" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return <div className="text-center text-neutral-400 py-20">No projects found.</div>;
  }

  const gridCols = (() => {
    switch (maxPerRow) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 xs:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 4:
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  })();

  return (
    <div className={`grid ${gridCols} ${gapClass}`}>
      {data.map((p, idx) => {
        const cover = p.portCover;
        const href = hrefFor(p);

        return (
          <Link key={p.projectId} href={href} className="group block">
            {/* 이미지 카드 */}
            <div
              className={`relative w-full ${aspectToClass[aspect]} overflow-hidden rounded-xl bg-neutral-900`}
            >
              {cover ? (
                <Image
                  src={cover}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  priority={idx < 4}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                  No cover
                </div>
              )}

              {/* 하단 그라데이션 + 타이틀 */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent opacity-90" />
              <div className="absolute inset-x-3 bottom-3">
                <p className="text-white tracking-tight text-base md:text-lg drop-shadow">
                  {p.name}
                </p>
                {p.category && <p className="text-white/85 text-xs md:text-sm">{p.category}</p>}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default memo(ProjectsGrid);
