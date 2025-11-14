// src/features/projects/server/queries.ts
import { z } from 'zod';

import { supabaseServer } from '@lib/supabase/server';
import { ApiError } from '@shared/errors/ApiError';
import { ErrorCode } from '@shared/types';

import { ProjectListItemSchema } from '../model/schemas';

// 생성 입력 스키마(필요 필드만)
export const CreateProjectSchema = ProjectListItemSchema.pick({
  name: true,
  category: true,
  slug: true,
  landCover: true,
  portCover: true,
});
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

// 1. 프로젝트 목록 조회
export async function listProjects() {
  const sb = await supabaseServer();

  const { data, error } = await sb
    .from('projects')
    .select(
      `
      projectId,
      name,
      category,
      slug,
      images_webp ( path, isLandCover, isPortCover )
    `,
    )
    .eq('published', true)
    .order('projectId', { ascending: false });

  if (error) throw new ApiError(error.message, ErrorCode.UPSTREAM, 502, error);

  const rows = (data ?? []) as Array<
    {
      projectId: number;
      name: string;
      category: string | null;
      slug: string | null;
      images_webp?: Array<{ path: string; isLandCover: boolean; isPortCover: boolean }>;
    } & Record<string, unknown>
  >;

  return rows.map((p) => {
    const land = p.images_webp?.find((i) => i.isLandCover)?.path ?? null;
    const port = p.images_webp?.find((i) => i.isPortCover)?.path ?? null;

    return {
      projectId: p.projectId,
      name: p.name,
      category: p.category ?? '',
      slug: p.slug ?? '',
      landCover: land,
      portCover: port,
    };
  });
}

// 2. 프로젝트 단건 조회
export async function getProjectById(id: number) {
  const sb = await supabaseServer();

  const { data, error } = await sb
    .from('projects')
    .select(
      `
      projectId,
      name,
      category,
      description,
      area,
      location,
      type,
      photo,
      year,
      slug,
      blogUrl,
      images_webp (
        imageId,
        projectId,
        path,
        width,
        height,
        no,
        isLandCover,
        isPortCover,
        mime,
        alt
      )
    `,
    )
    .eq('projectId', id)
    .eq('published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      throw new ApiError('Project not found', ErrorCode.NOT_FOUND, 404);
    }
    throw new ApiError(error.message, ErrorCode.UPSTREAM, 502, error);
  }

  if (!data) {
    throw new ApiError('Project not found', ErrorCode.NOT_FOUND, 404);
  }

  // 이미지 정렬 (no 순서로)
  const sortedImages = (data.images_webp || []).sort((a, b) => (a.no || 0) - (b.no || 0));

  return {
    projectId: data.projectId,
    name: data.name,
    category: data.category,
    description: data.description,
    area: data.area,
    location: data.location,
    type: data.type,
    photo: data.photo,
    year: data.year,
    slug: data.slug,
    blogUrl: data.blogUrl,
    images: sortedImages.map((img) => ({
      imageId: img.imageId,
      projectId: img.projectId,
      path: img.path,
      width: img.width,
      height: img.height,
      no: img.no,
      isLandCover: img.isLandCover,
      isPortCover: img.isPortCover,
      mime: img.mime,
      alt: img.alt,
    })),
  };
}

export const UpsertIdSchema = z.object({ id: z.coerce.number().int().positive() });

export async function createProject(input: unknown) {
  const parsed = CreateProjectSchema.safeParse(input);
  if (!parsed.success) {
    throw new ApiError(
      'Validation failed',
      ErrorCode.VALIDATION,
      400,
      parsed.error.flatten(),
    );
  }

  const sb = await supabaseServer();

  const { data: proj, error: pe } = await sb
    .from('projects')
    .insert({
      name: parsed.data.name,
      category: parsed.data.category ?? null,
      slug: parsed.data.slug ?? null,
      published: true,
    })
    .select('projectId')
    .single();

  if (pe) throw new ApiError(pe.message, ErrorCode.UPSTREAM, 502, pe);

  const toInsert = [];
  if (parsed.data.landCover) {
    toInsert.push({
      projectId: proj!.projectId,
      path: parsed.data.landCover,
      isLandCover: true,
      isPortCover: false,
    });
  }
  if (parsed.data.portCover) {
    toInsert.push({
      projectId: proj!.projectId,
      path: parsed.data.portCover,
      isLandCover: false,
      isPortCover: true,
    });
  }
  if (toInsert.length) {
    const { error: ie } = await sb.from('images_webp').insert(toInsert);
    if (ie) throw new ApiError(ie.message, ErrorCode.UPSTREAM, 502, ie);
  }

  return { projectId: proj!.projectId };
}
