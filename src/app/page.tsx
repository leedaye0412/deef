import ProjectsCoverSlider from "@/features/home/components/ProjectsCoverSlider";

export default function Home() {
  return (
    <main>
      <ProjectsCoverSlider
        fullBleed
        fit="cover"
        heightClass="h-[100svh]"
        className="-mt-30" // 헤더 높이 h-14만큼 위로 당김
      />

    </main>
  );
}
