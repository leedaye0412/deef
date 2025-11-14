export function ProjectsGridSkeleton() {
  return (
    <section className="py-6 md:py-6 my-16 md:my-21 px-layout-x-mobile md:px-layout-x-desktop">
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="group">
            <div className="relative w-full aspect-[3/4] rounded-xl bg-neutral-900 animate-pulse">
              <div className="absolute inset-x-3 bottom-3 space-y-2">
                <div className="h-5 w-3/4 rounded bg-neutral-800 backdrop-blur-sm" />
                <div className="h-4 w-1/2 rounded bg-neutral-800 backdrop-blur-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
