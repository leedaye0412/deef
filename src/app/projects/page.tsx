// app/projects/page.tsx
"use client";

import ProjectsGrid from "@/features/projects/components/ProjectsGrid";
import VerticalSliderProjects from "@/features/projects/components/VerticalSlider";
import { useEffect, useState } from "react";

/** Tailwind lg 브레이크포인트(1024px) 기준으로 데스크톱 여부 판단 */
function useIsDesktop(minWidth = 1024) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [minWidth]);

  return isDesktop;
}

export default function ProjectsPage() {
  const isDesktop = useIsDesktop(1024); // Tailwind lg 기준

  // 첫 렌더(SSR)~클라이언트 매칭까지 잠깐의 중간 상태 처리
  if (isDesktop === null) {
    return <main className="min-h-screen bg-black" />;
  }

  return (
    <main className="min-h-screen bg-black">
      {isDesktop ? (
        <section className="px-5 sm:px-8 md:px-12 py-10">
          <ProjectsGrid maxPerRow={4} aspect="photo" />
        </section>
      ) : (
        <section>
          <VerticalSliderProjects />
        </section>
      )}
    </main>
  );
}
