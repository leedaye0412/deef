"use client";

export default function ProjectDetailSkeleton() {
  return (
    <main className="min-h-screen">
      {/* TitleHero skeleton */}
      <section className="relative w-full">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <div className="relative aspect-[21/9] w-full rounded-none sm:rounded-xl bg-neutral-900 animate-pulse" />
        </div>
      </section>

      {/* InfoBlock skeleton */}
      <section className="mx-auto max-w-[1400px] px-6 sm:px-10 py-8">
        <div className="space-y-3">
          <div className="h-4 w-1/3 rounded bg-neutral-800 animate-pulse" />
          <div className="h-4 w-1/4 rounded bg-neutral-800 animate-pulse" />
          <div className="h-4 w-1/5 rounded bg-neutral-800 animate-pulse" />
        </div>
      </section>

      {/* ImagesStack skeleton */}
      <section className="mx-auto max-w-[1400px] px-6 sm:px-10 py-10 space-y-8">
        <div className="w-full aspect-[3/4] rounded-xl bg-neutral-900 animate-pulse" />
        <div className="w-full aspect-video rounded-xl bg-neutral-900 animate-pulse" />
      </section>

      {/* HorizontalRelated skeleton */}
      <section className="bg-black">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 py-8">
          <div className="h-4 w-24 rounded bg-neutral-800 animate-pulse mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[8/5] rounded-lg bg-neutral-900 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
