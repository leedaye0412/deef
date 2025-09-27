import { z } from "zod";

export const ProjectListItemSchema = z.object({
  projectId: z.number(),
  name: z.string(),
  category: z.string(),
  slug: z.string(),
  landCover: z.string().url().nullable().optional(),
  portCover: z.string().url().nullable().optional(),
});

export const GetProjectsResponseSchema = z.object({
  data: z.array(ProjectListItemSchema),
});
