import { prisma } from "@/lib/prisma";

export default async function ProjectsPage() {
  // DB에서 프로젝트 + 관련 이미지 조회
  const projects = await prisma.project.findMany({
    include: {
      images: true, // 프로젝트에 연결된 이미지도 함께 가져옴
    },
    orderBy: {
      projectId: "desc", // 최근 프로젝트 먼저 정렬 (선택 사항)
    },
  });

  return (
    <main>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.projectId}>
            <h2>{project.name}</h2>
            {project.summary && <p>{project.summary}</p>}

            {/* 이미지가 있으면 리스트로 렌더링 */}
            {project.images.length > 0 && (
              <ul>
                {project.images.map((img) => (
                  <li key={img.imageId}>
                    <img
                      src={img.path}
                      alt={img.alt ?? project.name}
                      width={img.width ?? 300}
                      height={img.height ?? 200}
                    />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
