import { withSimpleRoute } from "@/shared/server/withRoute";
import { listProjects } from "@features/projects/server/queries";

export const GET = withSimpleRoute(async () => {
  return await listProjects();
});
