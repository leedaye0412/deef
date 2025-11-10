'use client';

import { useEffect, useState } from 'react';

import ProjectsGrid from '@/features/projects/components/ProjectsGrid';
import VerticalSliderProjects from '@/features/projects/components/VerticalSlider';

function useIsDesktop(minWidth = 1024) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [minWidth]);

  return isDesktop;
}

export default function ProjectsPage() {
  const isDesktop = useIsDesktop(1024);

  if (isDesktop === null) {
    return <main className="min-h-screen" />;
  }

  return (
    <main className="min-h-screen">
      {isDesktop ? (
        <section className="py-6 md:py-6 my-16 md:my-21 px-layout-x-mobile md:px-layout-x-desktop">
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
