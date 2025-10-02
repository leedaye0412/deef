import ProjectsCoverSlider from "@/features/home/components/ProjectsCoverSlider";

export default function Home() {
  return (
    <main>
      <ProjectsCoverSlider
        fullBleed
        fit="cover"
        heightClass="h-[100svh]"
        className="
            mt-[calc(-32px-var(--spacing-layout-y-mobile))]
            md:mt-[calc(-56px-var(--spacing-layout-y-desktop))]
        "
      />
    </main>
  );
}
