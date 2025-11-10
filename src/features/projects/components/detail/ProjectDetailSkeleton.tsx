'use client';

export default function ProjectDetailSkeleton() {
  return (
    <main>
      {/* TitleHero skeleton */}
      <section className="relative w-full">
        <div>
          <div className="relative aspect-[21/9] w-full rounded-none sm:rounded-xl bg-neutral-900 animate-pulse" />
        </div>
      </section>
      {/* InfoBlock skeleton */}
      <section className="px-layout-x-mobile md:px-layout-x-desktop py-8">
        <div className="space-y-3">
          <div className="h-4 w-1/3 rounded bg-neutral-900 animate-pulse" />
          <div className="h-4 w-1/4 rounded bg-neutral-900 animate-pulse" />
          <div className="h-4 w-1/5 rounded bg-neutral-900 animate-pulse" />
        </div>
      </section>
      {/* ImagesStack skeleton */}
      <section className="px-layout-x-mobile md:px-layout-x-desktop py-10 space-y-8">
        <div className="w-full aspect-[3/4] rounded-xl bg-neutral-900 animate-pulse" />
        <div className="w-full aspect-video rounded-xl bg-neutral-900 animate-pulse" />
      </section>
      {/* HorizontalRelated skeleton */}
      <section className="w-full py-8">
        <div className="flex gap-4">
          <div className="w-1/3 aspect-[8/5] rounded-lg bg-neutral-900 animate-pulse" />
          <div className="w-1/3 aspect-[8/5] rounded-lg bg-neutral-900 animate-pulse" />
          <div className="w-1/3 aspect-[8/5] rounded-lg bg-neutral-900 animate-pulse" />
        </div>
      </section>
    </main>
  );
}
