'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import type { ProjectListItem } from '@/features/projects/api/client';
import { useProjects } from '@/features/projects/api/hooks';

const hrefFor = (p: ProjectListItem) => `/projects/${p.projectId}`;
const coverFor = (p: ProjectListItem) => p.landCover || p.portCover || null;

export default function HorizontalRelated() {
  const { data, isLoading, isError } = useProjects();
  if (isLoading || isError || !data?.length) return null;

  const items = data.map((p) => ({ ...p, cover: coverFor(p) })).filter((p) => !!p.cover);
  if (!items.length) return null;

  return (
    <section>
      <div>
        <Swiper
          modules={[Keyboard]}
          centeredSlides
          loop={items.length > 3}
          grabCursor
          keyboard={{ enabled: true }}
          slidesPerView={1.35}
          spaceBetween={16}
          slidesOffsetBefore={40}
          slidesOffsetAfter={40}
          breakpoints={{
            640: { slidesPerView: 1.6, spaceBetween: 16 },
            1024: { slidesPerView: 1.9, spaceBetween: 100, slidesOffsetBefore: 80 },
            1440: { slidesPerView: 2.05, spaceBetween: 100, slidesOffsetBefore: 80 },
          }}
          className="w-full"
        >
          {items.map((p) => (
            <SwiperSlide key={p.projectId}>
              <Link href={hrefFor(p)} className="block">
                <div
                  className="
                    relative w-full overflow-hidden rounded-lg bg-neutral-900
                    aspect-[8/5]
                    md:max-h-[350px]
                  "
                >
                  <Image
                    src={p.cover as string}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 640px"
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
