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
  hrefFor?: (p: ProjectListItem) => string;
};

function VerticalSliderProjects({
  speedMs = 900,
  hrefFor = (p) => `/projects/${p.projectId}`,
}: Props) {
  const { data, isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <div className="flex h-[100svh] w-full items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-6 w-[min(86vw,900px)]">
          <div className="w-full h-[50vh] rounded-lg bg-neutral-800 animate-pulse" />
          <div className="w-2/3 h-6 rounded bg-neutral-800 animate-pulse" />
          <div className="w-1/2 h-5 rounded bg-neutral-800 animate-pulse" />
        </div>
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

          return (
            <SwiperSlide key={p.projectId}>
              <div className="flex h-[100svh] w-full items-center justify-center">
                <div className="mx-auto flex max-w-[1200px] flex-col items-center px-6 sm:px-10">
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
                      <div className="relative w-full h-[50vh]">
                        <Image
                          src={cover}
                          alt={p.name}
                          fill
                          priority={idx === 0}
                          sizes="(max-width: 1200px) 86vw, 900px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-neutral-500">
                        No cover
                      </div>
                    )}
                    <span className="sr-only">{p.name}</span>
                  </Link>

                  {/* 텍스트 */}
                  <div
                    className="m-8 text-center"
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
                      {p.name}
                    </p>
                    {p.category && (
                      <p
                        className="mt-2 text-white/85"
                        style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.125rem)" }}
                      >
                        {p.category.toUpperCase()}
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
