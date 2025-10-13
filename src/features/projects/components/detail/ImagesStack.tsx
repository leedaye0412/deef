"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { ProjectDetail } from "@/features/projects/api/client";

type Props = { project: ProjectDetail };

type ImgItem = ProjectDetail["images"][number] & {
  _naturalW?: number;
  _naturalH?: number;
};

function isPortrait(img: ImgItem) {
  if (img.width === 1) return true;
  if (img.width === 2) return false; 
  const w = img.width ?? img._naturalW;
  const h = img.height ?? img._naturalH;
  if (!w || !h) return false;
  return h > w;
}

export default function ImagesStack({ project }: Props) {
  const [dyn, setDyn] = useState<Record<number, { w: number; h: number }>>({});

  const imgs: ImgItem[] =
    (project.images ?? []).map((i) => ({
      ...i,
      _naturalW: dyn[i.imageId]?.w,
      _naturalH: dyn[i.imageId]?.h,
    })) ?? [];

  const { portraits, landscapes } = useMemo(() => {
    const portraits: ImgItem[] = [];
    const landscapes: ImgItem[] = [];
    imgs.forEach((img) => (isPortrait(img) ? portraits : landscapes).push(img));
    return { portraits, landscapes };
  }, [imgs]);

  if (imgs.length === 0) return null;

  const [desc1, desc2] = (project.description ?? "").split("<br/>");

  return (
    <section>
      <div className="mx-auto max-w-[1400px] space-y-0 md:space-y-16">
        {/* Portrait slider */}
        {portraits.length > 0 && (
          <div className="flex flex-col md:flex-row">
            {/* 이미지 슬라이더 */}
            <div className="w-full md:flex-1 min-w-0">
              <Swiper
                modules={[Navigation, Pagination, A11y]}
                pagination={{ clickable: true }}
                spaceBetween={16}
                slidesPerView={1}
                className="custom-swiper"
                observer
                observeParents
                resizeObserver
                onResize={(sw) => sw.update()}
                onAfterInit={(sw) => sw.update()}
              >
                {portraits.map((img, idx) => (
                  <SwiperSlide key={`p-${img.imageId}`}>
                    <figure className="w-full">
                      <Image
                        src={img.path}
                        alt={img.alt ?? project.name}
                        width={img._naturalW ?? img.width ?? 1}
                        height={img._naturalH ?? img.height ?? 1}
                        className="w-full h-auto object-contain md:object-cover"
                        sizes="(max-width: 768px) 100vw, 440px"
                        priority={idx === 0}
                        onLoad={(e) => {
                          if (!img.height || !img.width || img.width === 1 || img.width === 2) {
                            const el = e.currentTarget as HTMLImageElement;
                            setDyn((prev) => ({
                              ...prev,
                              [img.imageId]: { w: el.naturalWidth, h: el.naturalHeight },
                            }));
                          }
                        }}
                      />
                    </figure>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* 설명 텍스트 */}
            <div className="w-full md:flex-1 min-w-0 flex items-center justify-center px-0 sm:px-10 py-10 sm:py-14">
              <p
                className="font-pretendard text-11 leading-[22px] text-justify whitespace-pre-line"
                style={{ wordBreak: "keep-all" }}
              >
                {desc1}
              </p>
            </div>
          </div>
        )}

        {/* Landscape slider */}
        {landscapes.length > 0 && (
          <div>
            <Swiper
              modules={[Navigation, Pagination, A11y]}
              pagination={{ clickable: true }}
              spaceBetween={16}
              slidesPerView={1}
              className="custom-swiper"
            >
              {landscapes.map((img, idx) => (
                <SwiperSlide key={`l-${img.imageId}`}>
                  <figure className="w-full">
                    <Image
                      src={img.path}
                      alt={img.alt ?? project.name}
                      width={img._naturalW ?? img.width ?? 1}
                      height={img._naturalH ?? img.height ?? 1}
                      className="w-full h-auto object-contain md:h-[90vh] md:object-cover"
                      sizes="(max-width: 768px) 100vw, 1200px"
                      priority={idx === 0}
                      onLoad={(e) => {
                        if (!img.height || !img.width || img.width === 1 || img.width === 2) {
                          const el = e.currentTarget as HTMLImageElement;
                          setDyn((prev) => ({
                            ...prev,
                            [img.imageId]: { w: el.naturalWidth, h: el.naturalHeight },
                          }));
                        }
                      }}
                    />
                  </figure>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <section>
          <div className="mx-auto max-w-[1000px] px-0 sm:px-10 py-10 sm:py-14">
            <p
              className="font-pretendard text-justify sm:text-center text-11 leading-[22px] whitespace-pre-line"
              style={{ wordBreak: "keep-all" }}
            >
              {desc2}
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
