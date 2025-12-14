import { z } from 'zod';

const coverSchema = z.union([z.string().url(), z.null()]);

export const ProjectImageSchema = z.object({
  imageId: z.number(),
  projectId: z.number(),
  path: z.string(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  no: z.number().nullable(),
  isLandCover: z.boolean(),
  isPortCover: z.boolean(),
  mime: z.string().nullable(),
  alt: z.string().nullable(),
});

export const ProjectListItemSchema = z.object({
  projectId: z.number(),
  name: z.string(),
  category: z.string(),
  slug: z.string(),
  landCover: coverSchema,
  portCover: coverSchema,
});

export const ProjectDetailSchema = z.object({
  projectId: z.number(),
  name: z.string(),
  category: z.string().nullable(),
  description: z.string().nullable(),
  area: z.number().nullable(),
  location: z.string().nullable(),
  type: z.string().nullable(),
  photo: z.string().nullable(),
  year: z.number().nullable(),
  slug: z.string().nullable(),
  blogUrl: z.string().nullable(),
  images: z.array(ProjectImageSchema),
});

export const GetProjectsResponseSchema = z.object({
  data: z.array(ProjectListItemSchema),
});

export type ProjectListItem = z.infer<typeof ProjectListItemSchema>;
export type ProjectImage = z.infer<typeof ProjectImageSchema>;
export type ProjectDetail = z.infer<typeof ProjectDetailSchema>;
