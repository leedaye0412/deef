import { useQuery } from "@tanstack/react-query";
import { getProjects, getProject } from "./client";

const QK = {
  projects: ["projects"] as const,
  project: (id: number) => ["projects", id] as const,
};

// 프로젝트 목록 조회
export function useProjects() {
  return useQuery({
    queryKey: QK.projects,
    queryFn: getProjects,
  });
}

// 프로젝트 단건 조회
export function useProject(id: number) {
  return useQuery({
    queryKey: QK.project(id),
    queryFn: () => getProject(id),
    enabled: !!id,
  });
}
