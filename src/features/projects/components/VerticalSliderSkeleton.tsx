export function VerticalSliderSkeleton() {
  return (
    <div className="flex h-svh w-full items-center justify-center">
      <div className="flex flex-col items-center w-[min(86vw,900px)]">
        <div className="relative w-2/3 h-[50vh] my-8 rounded-xl bg-neutral-900 animate-pulse" />
        <div className="flex flex-col items-center space-y-3 w-full">
          <div className="h-4 w-1/2 rounded bg-neutral-900 animate-pulse" />
          <div className="h-4 w-1/3 rounded bg-neutral-900 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
