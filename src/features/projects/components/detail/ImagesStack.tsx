"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { ProjectDetail } from "@/features/projects/api/client";

type Props = { project: ProjectDetail };

type ImgItem = ProjectDetail["images"][number] & {
  _naturalW?: number;
  _naturalH?: number;
};

function isPortrait(img: ImgItem) {
  const w = img.width ?? img._naturalW;
  const h = img.height ?? img._naturalH;
  if (!w || !h) return false;
  return h > w;
}

function groupForLayout(images: ImgItem[]) {
  const result: Array<{ type: "pair" | "single"; items: ImgItem[] }> = [];
  const portraitPool: ImgItem[] = [];

  images.forEach((img) => {
    if (isPortrait(img)) {
      portraitPool.push(img);
      if (portraitPool.length === 2) {
        result.push({ type: "pair", items: portraitPool.splice(0, 2) });
      }
    } else {
      result.push({ type: "single", items: [img] });
    }
  });

  if (portraitPool.length === 1) {
    result.push({ type: "single", items: portraitPool.splice(0, 1) });
  }

  return result;
}

export default function ImagesStack({ project }: Props) {
  const [dyn, setDyn] = useState<Record<number, { w: number; h: number }>>({});
  const imgs: ImgItem[] = (project.images ?? []).map((i) => ({
    ...i,
    _naturalW: dyn[i.imageId]?.w,
    _naturalH: dyn[i.imageId]?.h,
  }));

  const groups = useMemo(() => {
    if (!imgs || imgs.length === 0) return [];
    return groupForLayout(imgs);
  }, [imgs]);

  if (groups.length === 0) return null;

  return (
    <section>
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-10 md:gap-10">
          {groups.map((g, idx) =>
            g.type === "pair" ? (
              <div key={`pair-${idx}`} className="grid grid-cols-2 gap-5 md:gap-10">
                {g.items.map((img) => (
                  <figure key={img.imageId} className="w-full">
                    <Image
                      src={img.path}
                      alt={img.alt ?? project.name}
                      width={img.width ?? 1000}
                      height={img.height ?? 1500}
                      className="w-full h-auto object-contain md:h-[80vh] md:object-cover"
                      sizes="(max-width: 768px) 50vw, 680px"
                      onLoad={(e) => {
                        if (!img.width || !img.height) {
                          const el = e.currentTarget as HTMLImageElement;
                          setDyn((prev) => ({
                            ...prev,
                            [img.imageId]: { w: el.naturalWidth, h: el.naturalHeight },
                          }));
                        }
                      }}
                    />
                  </figure>
                ))}
              </div>
            ) : (
              g.items.map((img) => (
                <figure key={`single-${idx}-${img.imageId}`} className="w-full">
                  <Image
                    src={img.path}
                    alt={img.alt ?? project.name}
                    width={img.width ?? 1600}
                    height={img.height ?? 1000}
                    className="w-full h-auto object-contain md:h-[90vh] md:object-cover"
                    sizes="(max-width: 768px) 100vw, 1400px"
                    priority={idx === 0}
                    onLoad={(e) => {
                      if (!img.width || !img.height) {
                        const el = e.currentTarget as HTMLImageElement;
                        setDyn((prev) => ({
                          ...prev,
                          [img.imageId]: { w: el.naturalWidth, h: el.naturalHeight },
                        }));
                      }
                    }}
                  />
                </figure>
              ))
            )
          )}
        </div>
      </div>
    </section>
  );
}
