// app/components/VerticalSliderProjects.tsx
"use client";

import { memo } from "react";
import Link from "next/link";
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
  hrefFor = (p) => (p.slug ? `/projects/${p.slug}` : `/projects/${p.projectId}`),
  descriptionFor,
}: Props) {
  const { data, isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <div className="flex h-[100svh] w-full items-center justify-center bg-black text-white/80">
        Loading…
      </div>
    );
  }
  if (isError || !data || data.length === 0) {
    return (
      <div className="flex h-[100svh] w-full items-center justify-center bg-black text-red-200">
        Failed to load projects.
      </div>
    );
  }

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-black">
      <Swiper
        direction="vertical"
        mousewheel
        speed={speedMs}
        modules={[Mousewheel, Parallax]}
        slidesPerView={1}
        parallax
        observer={false}
        observeParents={false}
        className="h-[100svh] w-full"
      >
        {data.map((p, idx) => {
          const cover = p.portCover;
          const href = hrefFor(p);
          const desc = descriptionFor?.(p);

          return (
            <SwiperSlide key={p.projectId} className="!h-[100svh]">
              <Link href={href} className="block h-[100svh] w-full">
                {/* 중앙 레일: 픽셀 고정 패딩 + safe-area 보정 */}
                <div
                  className="mx-auto flex h-full max-w-[1200px] flex-col items-center"
                  style={{
                    paddingTop: "72px",
                    paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 72px)",
                  }}
                >
                  {/* 이미지 래퍼: contain + 최대 높이, 잘림 방지, 패럴랙스는 약하게 */}
                  <div
                    className="relative mx-auto w-[min(86vw,900px)] overflow-visible"
                    style={{
                      maxHeight: "min(64svh, 70%)", // 한 화면 안에 항상 들어오도록 상한
                      minHeight: "min(36svh, 45%)", // 너무 작아지지 않게 하한
                    }}
                    data-swiper-parallax-y="6%"
                    data-swiper-parallax-opacity="0.06"
                  >
                    {cover ? (
                      <img
                        src={cover}
                        alt={p.name}
                        className="max-h-full w-full object-contain"
                        loading={idx === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-neutral-500">
                        No cover
                      </div>
                    )}
                  </div>

                  {/* 텍스트 블록: 중앙 정렬, 모두 보이게 고정 영역 */}
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
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* 스크롤 힌트 */}
      {showChevron && (
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 animate-bounce text-white/85"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default memo(VerticalSliderProjects);
