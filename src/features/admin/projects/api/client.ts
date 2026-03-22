import { http } from '@shared/client/http';
import { ApiError } from '@shared/errors/ApiError';
import type { ApiResponse } from '@shared/types';
import { ErrorCode } from '@shared/types';

import type {
  AdminProjectDetail,
  AdminProjectListItem,
  AdminProjectMutationResult,
  AdminProjectUploadResult,
  AdminProjectUpsertInput,
} from '../model/schemas';

export type {
  AdminProjectDetail,
  AdminProjectImage,
  AdminProjectImageInput,
  AdminProjectListItem,
  AdminProjectMutationResult,
  AdminProjectUploadResult,
  AdminProjectUpsertInput,
} from '../model/schemas';

export async function getAdminProjects(): Promise<AdminProjectListItem[]> {
  const res = await http<ApiResponse<AdminProjectListItem[]>>('/api/admin/projects');
  return res.data;
}

export async function getAdminProject(projectId: number): Promise<AdminProjectDetail> {
  const res = await http<ApiResponse<AdminProjectDetail>>(
    `/api/admin/projects/${projectId}`,
  );
  return res.data;
}

export async function createAdminProject(
  input: AdminProjectUpsertInput,
): Promise<AdminProjectMutationResult> {
  const res = await http<ApiResponse<AdminProjectMutationResult>>('/api/admin/projects', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return res.data;
}

export async function updateAdminProject(
  projectId: number,
  input: AdminProjectUpsertInput,
): Promise<AdminProjectMutationResult> {
  const res = await http<ApiResponse<AdminProjectMutationResult>>(
    `/api/admin/projects/${projectId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  );
  return res.data;
}

export async function deleteAdminProject(
  projectId: number,
): Promise<AdminProjectMutationResult> {
  const res = await http<ApiResponse<AdminProjectMutationResult>>(
    `/api/admin/projects/${projectId}`,
    {
      method: 'DELETE',
    },
  );
  return res.data;
}

export async function uploadAdminProjectImage(
  file: File,
): Promise<AdminProjectUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/admin/projects/upload', {
    method: 'POST',
    body: formData,
  });

  const text = await res.text();
  let json: { data?: unknown; message?: string; code?: string } = {};

  if (text) {
    try {
      json = JSON.parse(text) as { data?: unknown; message?: string; code?: string };
    } catch {
      json = {};
    }
  }

  if (!res.ok) {
    throw new ApiError(
      json.message || '이미지 업로드에 실패했습니다.',
      (json.code as ErrorCode) ?? ErrorCode.UPSTREAM,
      res.status,
    );
  }

  return (json.data ?? {}) as AdminProjectUploadResult;
}
