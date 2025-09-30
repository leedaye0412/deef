import { withRoute } from "@/shared/server/withRoute";
import { getProjectById, UpsertIdSchema } from "@features/projects/server/queries";

function parseId(params: { id?: string }) {
  // async 제거
  const p = UpsertIdSchema.safeParse({ id: params.id });
  if (!p.success) throw new Error("Invalid id");
  return p.data.id;
}

// GET /api/projects/[id] - 프로젝트 단건 조회
export const GET = withRoute(async (_req, { params }) => {
  const resolvedParams = await params;
  const id = parseId(resolvedParams); // await 없이
  return await getProjectById(id);
});
