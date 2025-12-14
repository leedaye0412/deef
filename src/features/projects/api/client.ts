import { http } from '@shared/client/http';
import type { ApiResponse } from '@shared/types';

import type { ProjectDetail, ProjectListItem } from '@/features/projects/model/schemas';

export type { ProjectDetail, ProjectListItem } from '@/features/projects/model/schemas';

// API 함수들
export async function getProjects(): Promise<ProjectListItem[]> {
  const res = await http<ApiResponse<ProjectListItem[]>>('/api/projects');
  return res.data;
}

export async function getProject(id: number): Promise<ProjectDetail> {
  const res = await http<ApiResponse<ProjectDetail>>(`/api/projects/${id}`);
  return res.data;
}
