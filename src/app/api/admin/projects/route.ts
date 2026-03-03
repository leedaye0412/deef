import { requireAuthenticated } from '@features/admin/auth/server/queries';
import { createProject } from '@features/projects/server/queries';
import { ApiError } from '@shared/errors/ApiError';
import { withSimpleRoute } from '@shared/server/withRoute';
import { ErrorCode } from '@shared/types';

// POST /api/admin/projects - 초대된 인증 사용자 전용 프로젝트 생성
export const POST = withSimpleRoute(async (req) => {
  await requireAuthenticated();

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    throw new ApiError('Invalid JSON body', ErrorCode.BAD_REQUEST, 400);
  }

  return await createProject(body);
});
