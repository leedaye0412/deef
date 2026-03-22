'use client';

import { useEffect, useState } from 'react';

import type { ProjectDetail } from '@/features/projects/api/client';
import HorizontalRelated from '@/features/projects/components/detail/HorizontalRelated';
import ImagesStack from '@/features/projects/components/detail/ImagesStack';
import InfoBlock from '@/features/projects/components/detail/InfoBlock';
import TitleHero from '@/features/projects/components/detail/TitleHero';

import {
  ADMIN_PROJECT_PREVIEW_READY_MESSAGE,
  isAdminProjectPreviewUpdateMessage,
} from '../../model/preview';

export default function AdminProjectDetailPreviewPage() {
  const [project, setProject] = useState<ProjectDetail | null>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== window.parent) return;
      if (!isAdminProjectPreviewUpdateMessage(event.data)) return;

      setProject(event.data.payload);
    };

    window.addEventListener('message', onMessage);
    window.parent.postMessage(
      { type: ADMIN_PROJECT_PREVIEW_READY_MESSAGE },
      window.location.origin,
    );

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  if (!project) {
    return (
      <>
        <style jsx global>{`
          header,
          footer {
            display: none !important;
          }
        `}</style>

        <main className="flex min-h-screen items-center justify-center bg-black px-4">
          <p className="font-pretendard text-sm text-white/60">
            미리보기 데이터를 불러오는 중입니다.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        header,
        footer {
          display: none !important;
        }
      `}</style>

      <main>
        <TitleHero project={project} />
        <div className="px-layout-x-mobile py-layout-y-mobile md:px-layout-x-desktop md:py-layout-y-desktop">
          <InfoBlock project={project} />
          <ImagesStack project={project} />
        </div>
        <HorizontalRelated />
      </main>
    </>
  );
}
