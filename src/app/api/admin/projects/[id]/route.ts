import { requireAuthenticated } from '@features/admin/auth/server/queries';
import {
  AdminProjectIdSchema,
  deleteAdminProject,
  getAdminProjectById,
  updateAdminProject,
} from '@features/admin/projects/server/queries';
import { ApiError } from '@shared/errors/ApiError';
import { withRoute } from '@shared/server/withRoute';
import { ErrorCode } from '@shared/types';

function parseId(params: { id?: string | string[] }) {
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const parsed = AdminProjectIdSchema.safeParse({ id });
  if (!parsed.success) {
    throw new ApiError('Invalid id', ErrorCode.BAD_REQUEST, 400, parsed.error.flatten());
  }
  return parsed.data.id;
}

// GET /api/admin/projects/[id] - 인증 관리자 전용 프로젝트 상세 조회
export const GET = withRoute(async (_req, { params }) => {
  await requireAuthenticated();
  const id = parseId(await params);
  return await getAdminProjectById(id);
});

// PATCH /api/admin/projects/[id] - 인증 관리자 전용 프로젝트 수정
export const PATCH = withRoute(async (req, { params }) => {
  await requireAuthenticated();
  const id = parseId(await params);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError('Invalid JSON body', ErrorCode.BAD_REQUEST, 400);
  }

  return await updateAdminProject(id, body);
});

// DELETE /api/admin/projects/[id] - 인증 관리자 전용 프로젝트 삭제
export const DELETE = withRoute(async (_req, { params }) => {
  await requireAuthenticated();
  const id = parseId(await params);
  return await deleteAdminProject(id);
});
