'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { Mousewheel, Parallax } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/parallax';

import type { ProjectListItem } from '@/features/projects/api/client';

function VerticalSliderProjects({ data }: { data: ProjectListItem[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-svh w-full items-center justify-center text-neutral-400">
        No projects found.
      </div>
    );
  }

  return (
    <Swiper
      direction="vertical"
      mousewheel
      speed={900}
      modules={[Mousewheel, Parallax]}
      slidesPerView={1}
      parallax
      observer={false}
      observeParents={false}
      preventClicks={false}
      preventClicksPropagation={false}
      className="h-svh w-full"
    >
      {data.map((p, idx) => {
        const cover = p.portCover;
        const href = `/projects/${p.projectId}`;

        return (
          <SwiperSlide key={p.projectId}>
            <div className="flex h-svh w-full items-center justify-center">
              <Link href={href} className="mx-auto block w-[min(86vw,900px)]">
                {cover ? (
                  <div className="relative w-full h-[50vh] my-8">
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

                {/* 텍스트 */}
                <div className="text-center">
                  <p className="tracking-wide text-white text-22">{p.name}</p>
                  {p.category && (
                    <p className="text-white/85 text-14">{p.category.toUpperCase()}</p>
                  )}
                </div>
              </Link>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

export default memo(VerticalSliderProjects);
