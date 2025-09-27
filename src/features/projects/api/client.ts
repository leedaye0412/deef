import { http } from "@shared/client/http";
import type { ApiResponse } from "@shared/types";

// 타입 정의
export type ProjectListItem = {
  projectId: number;
  name: string;
  category: string;
  slug: string;
  landCover: string | null;
  portCover: string | null;
};

export type ProjectImage = {
  imageId: number;
  projectId: number;
  path: string;
  width: number | null;
  height: number | null;
  no: number | null;
  isLandCover: boolean;
  isPortCover: boolean;
  mime: string | null;
  alt: string | null;
};

export type ProjectDetail = {
  projectId: number;
  name: string;
  category: string | null;
  description: string | null;
  area: number | null;
  location: string | null;
  type: string | null;
  photo: string | null;
  year: number | null;
  slug: string | null;
  blogUrl: string | null;
  images: ProjectImage[];
};

// API 함수들
export async function getProjects(): Promise<ProjectListItem[]> {
  const res = await http<ApiResponse<ProjectListItem[]>>("/api/projects");
  return res.data;
}

export async function getProject(id: number): Promise<ProjectDetail> {
  const res = await http<ApiResponse<ProjectDetail>>(`/api/projects/${id}`);
  return res.data;
}