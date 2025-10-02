"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Parallax } from "swiper/modules";
import "swiper/css";
import "swiper/css/parallax";

import { useProjects } from "@/features/projects/api/hooks";
import type { ProjectListItem } from "@/features/projects/api/client";

type Props = {
  speedMs?: number;
  showChevron?: boolean;
  hrefFor?: (p: ProjectListItem) => string;
  descriptionFor?: (p: ProjectListItem) => string | undefined;
};

function VerticalSliderProjects({
  speedMs = 900,
  showChevron = true,
  hrefFor = (p) => `/projects/${p.projectId}`,
  descriptionFor,
}: Props) {
  const { data, isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <div className="flex h-[100svh] w-full items-center justify-center  text-white/80">
        Loading…
      </div>
    );
  }
  if (isError || !data || data.length === 0) {
    return (
      <div className="flex h-[100svh] w-full items-center justify-center text-red-200">
        Failed to load projects.
      </div>
    );
  }

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      <Swiper
        direction="vertical"
        mousewheel
        speed={speedMs}
        modules={[Mousewheel, Parallax]}
        slidesPerView={1}
        parallax
        observer={false}
        observeParents={false}
        preventClicks={false}
        preventClicksPropagation={false}
        className="h-[100svh] w-full"
      >
        {data.map((p, idx) => {
          const cover = p.portCover;
          const href = hrefFor(p);
          const desc = descriptionFor?.(p);

          return (
            <SwiperSlide key={p.projectId} className="!h-[100svh]">
              <div className="h-[100svh] w-full">
                {/* 중앙 레일 */}
                <div
                  className="mx-auto flex h-full max-w-[1200px] flex-col items-center"
                  style={{
                    paddingTop: "72px",
                    paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 72px)",
                  }}
                >
                  <Link
                    href={href}
                    className="relative mx-auto block w-[min(86vw,900px)] overflow-visible"
                    style={{
                      maxHeight: "min(64svh, 70%)",
                      minHeight: "min(36svh, 45%)",
                    }}
                    data-swiper-parallax-y="6%"
                    data-swiper-parallax-opacity="0.06"
                  >
                    {cover ? (
                      <Image
                        src={cover}
                        alt={p.name}
                        fill
                        priority={idx === 0}
                        sizes="(max-width: 1200px) 86vw, 900px"
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-neutral-500">
                        No cover
                      </div>
                    )}
                    <span className="sr-only">{p.name}</span>
                  </Link>

                  {/* 텍스트 블록 */}
                  <div
                    className="mt-8 text-center"
                    data-swiper-parallax-y="-5%"
                    data-swiper-parallax-opacity="0.12"
                  >
                    <p
                      className="font-semibold tracking-wide text-white"
                      style={{
                        fontSize: "clamp(1.15rem, 2.6vw, 1.75rem)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {p.name.toUpperCase()}
                    </p>
                    {p.category && (
                      <p
                        className="mt-2 text-white/85"
                        style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.125rem)" }}
                      >
                        {p.category.toUpperCase()}
                      </p>
                    )}
                    {desc && (
                      <p
                        className="mt-1 text-white/80"
                        style={{ fontSize: "clamp(0.9rem, 1.7vw, 1.125rem)" }}
                      >
                        {desc.toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default memo(VerticalSliderProjects);
