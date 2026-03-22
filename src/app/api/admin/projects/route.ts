import { requireAuthenticated } from '@features/admin/auth/server/queries';
import {
  createAdminProject,
  listAdminProjects,
} from '@features/admin/projects/server/queries';
import { ApiError } from '@shared/errors/ApiError';
import { withSimpleRoute } from '@shared/server/withRoute';
import { ErrorCode } from '@shared/types';

// GET /api/admin/projects - 인증 관리자 전용 프로젝트 목록 조회
export const GET = withSimpleRoute(async () => {
  await requireAuthenticated();
  return await listAdminProjects();
});

// POST /api/admin/projects - 인증 관리자 전용 프로젝트 생성
export const POST = withSimpleRoute(async (req) => {
  await requireAuthenticated();

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    throw new ApiError('Invalid JSON body', ErrorCode.BAD_REQUEST, 400);
  }

  return await createAdminProject(body);
});
