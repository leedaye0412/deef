'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useProjects } from '@features/projects/api/hooks';

const DEFAULT_SLIDE = {
  id: 1,
  name: 'Project 1',
  mobileSrc: '/hero-mobile.webp',
  desktopSrc: '/hero-desktop.webp',
};

export default function ProjectsCoverSlider() {
  const router = useRouter();
  const { data, isLoading, isError, refetch: _refetch } = useProjects();

  const autoPlay = true;
  const interval = 5000;
  const transitionMs = 2500;
  const kenBurns = true;

  const slides = useMemo(() => {
    if (isLoading || isError || !data || data.length === 0) {
      return [DEFAULT_SLIDE];
    }

    const projectSlides =
      data
        ?.map((p) => ({
          id: p.projectId,
          name: p.name,
          mobileSrc: p.portCover || p.landCover || null,
          desktopSrc: p.landCover || p.portCover || null,
        }))
        .filter((s) => !!s.mobileSrc && !!s.desktopSrc)
        .sort((a, b) => a.id - b.id) ?? [];

    const filteredSlides = projectSlides.filter((s) => s.id !== 1);

    return filteredSlides.length > 0
      ? [DEFAULT_SLIDE, ...filteredSlides]
      : [DEFAULT_SLIDE];
  }, [data, isLoading, isError]);

  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const count = slides.length;

  const normalizedIndex = count ? ((index % count) + count) % count : 0;

  useEffect(() => {
    if (!autoPlay || count <= 1) return;
    const t = setInterval(() => {
      setIsTransitioning(true);
      setIndex((i) => (i + 1) % count);
      setTimeout(() => setIsTransitioning(false), transitionMs);
    }, interval);
    return () => clearInterval(t);
  }, [autoPlay, interval, count, transitionMs]);

  const dragStartX = useRef<number | null>(null);
  const dragging = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current || dragStartX.current == null) return;
    const dx = e.clientX - dragStartX.current;
    dragging.current = false;
    setIsDragging(false);
    dragStartX.current = null;
    const threshold = 40;

    if (dx > threshold) {
      setIsTransitioning(true);
      setIndex((i) => (i - 1 + count) % count);
      setTimeout(() => setIsTransitioning(false), transitionMs);
    } else if (dx < -threshold) {
      setIsTransitioning(true);
      setIndex((i) => (i + 1) % count);
      setTimeout(() => setIsTransitioning(false), transitionMs);
    }
  };

  return (
    <div
      className={`w-screen mx-[calc(50%-50vw)] relative select-none`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className={`relative h-svh overflow-hidden`}>
        {slides.map((s, i) => {
          const isActive = i === normalizedIndex;
          const isPrev = count ? i === (normalizedIndex - 1 + count) % count : false;

          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-all ${
                isActive
                  ? 'opacity-100 z-20'
                  : isPrev && isTransitioning
                    ? 'opacity-0 z-10'
                    : 'opacity-0 z-0'
              }`}
              style={{
                transitionDuration: `${transitionMs}ms`,
                transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={s.mobileSrc as string}
                  alt={s.name}
                  fill
                  sizes="100vw"
                  className={`object-cover ${kenBurns && isActive ? 'animate-ken-burns' : ''} md:hidden`}
                  priority={i === normalizedIndex || i === (normalizedIndex + 1) % count}
                />

                <Image
                  src={s.desktopSrc as string}
                  alt={s.name}
                  fill
                  sizes="100vw"
                  className={`object-cover ${kenBurns && isActive ? 'animate-ken-burns' : ''} hidden md:block`}
                  priority={i === normalizedIndex || i === (normalizedIndex + 1) % count}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

                <button
                  aria-label={`${s.name} 상세로 이동`}
                  onClick={() => router.push(`/projects/${s.id}`)}
                  className="absolute inset-0 z-30"
                />
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes ken-burns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }
        .animate-ken-burns {
          animation: ken-burns ${interval}ms ease-out forwards;
        }
      `}</style>
    </div>
  );
}
