import type { ProjectDetail } from '@/features/projects/api/client';

export const ADMIN_PROJECT_PREVIEW_UPDATE_MESSAGE = 'admin-project-preview:update';
export const ADMIN_PROJECT_PREVIEW_READY_MESSAGE = 'admin-project-preview:ready';

export type AdminProjectPreviewUpdateMessage = {
  type: typeof ADMIN_PROJECT_PREVIEW_UPDATE_MESSAGE;
  payload: ProjectDetail;
};

export type AdminProjectPreviewReadyMessage = {
  type: typeof ADMIN_PROJECT_PREVIEW_READY_MESSAGE;
};

export function isAdminProjectPreviewUpdateMessage(
  value: unknown,
): value is AdminProjectPreviewUpdateMessage {
  if (!value || typeof value !== 'object') return false;
  return (value as { type?: unknown }).type === ADMIN_PROJECT_PREVIEW_UPDATE_MESSAGE;
}

export function isAdminProjectPreviewReadyMessage(
  value: unknown,
): value is AdminProjectPreviewReadyMessage {
  if (!value || typeof value !== 'object') return false;
  return (value as { type?: unknown }).type === ADMIN_PROJECT_PREVIEW_READY_MESSAGE;
}
