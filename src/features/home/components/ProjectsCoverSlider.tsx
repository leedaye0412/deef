'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useProjects } from '@features/projects/api/hooks';

export default function ProjectsCoverSlider() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useProjects();

  const autoPlay = true;
  const interval = 5000;
  const transitionMs = 2500;
  const kenBurns = true;

  const slides = useMemo(() => {
    return (
      data
        ?.map((p) => ({
          id: p.projectId,
          name: p.name,
          mobileSrc: p.portCover || p.landCover || null,
          desktopSrc: p.landCover || p.portCover || null,
        }))
        .filter((s) => !!s.mobileSrc && !!s.desktopSrc)
        .sort((a, b) => a.id - b.id) ?? []
    );
  }, [data]);

  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (count === 0) return;
    setIndex((i) => ((i % count) + count) % count);
  }, [count]);

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
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current || dragStartX.current == null) return;
    const dx = e.clientX - dragStartX.current;
    dragging.current = false;
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

  if (isLoading) {
    return (
      <div className="w-screen mx-[calc(50%-50vw)] relative h-svh overflow-hidden">
        <div className="absolute inset-0 animate-pulse bg-white/5" />
      </div>
    );
  }

  if (isError || count === 0) {
    return (
      <div className="w-screen mx-[calc(50%-50vw)] grid place-items-center h-svh">
        {isError ? (
          <div className="text-sm opacity-80">
            이미지를 불러오지 못했어요.{' '}
            <button onClick={() => refetch()} className="underline">
              다시 시도
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`w-screen mx-[calc(50%-50vw)] relative select-none`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
    >
      <div className={`relative h-svh overflow-hidden`}>
        {slides.map((s, i) => {
          const isActive = i === index;
          const isPrev = i === (index - 1 + count) % count;

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
                {/* 모바일용 이미지 */}
                <Image
                  src={s.mobileSrc as string}
                  alt={s.name}
                  fill
                  sizes="100vw"
                  className={`object-cover ${kenBurns && isActive ? 'animate-ken-burns' : ''} md:hidden`}
                  priority={i === index || i === (index + 1) % count}
                />

                {/* 데스크탑용 이미지 */}
                <Image
                  src={s.desktopSrc as string}
                  alt={s.name}
                  fill
                  sizes="100vw"
                  className={`object-cover ${kenBurns && isActive ? 'animate-ken-burns' : ''} hidden md:block`}
                  priority={i === index || i === (index + 1) % count}
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
