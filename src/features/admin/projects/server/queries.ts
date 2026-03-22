import { z } from 'zod';

import { supabaseAdmin } from '@lib/supabase/admin';
import { ApiError } from '@shared/errors/ApiError';
import { ErrorCode } from '@shared/types';

import {
  AdminProjectDetailSchema,
  AdminProjectListItemSchema,
  AdminProjectUpsertInputSchema,
  type AdminProjectDetail,
  type AdminProjectImageInput,
  type AdminProjectListItem,
} from '../model/schemas';

export const AdminProjectIdSchema = z.object({ id: z.coerce.number().int().positive() });

type SupabaseAdminClient = typeof supabaseAdmin;

function isProjectsPrimaryKeyDuplicateError(error: {
  code?: string | null;
  message?: string | null;
  details?: string | null;
}) {
  if (error.code !== '23505') return false;
  if (error.message?.includes('projects_pkey')) return true;
  return error.details?.includes('("projectId")') ?? false;
}

async function resolveNextProjectId(sb: SupabaseAdminClient) {
  const { data, error } = await sb
    .from('projects')
    .select('projectId')
    .order('projectId', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new ApiError(error.message, ErrorCode.UPSTREAM, 502, error);
  }

  return (data?.projectId ?? 0) + 1;
}

function assertCoverFlags(images: AdminProjectImageInput[]) {
  if (images.length === 0) {
    throw new ApiError(
      '프로젝트 이미지를 최소 1장 업로드해 주세요.',
      ErrorCode.VALIDATION,
      400,
    );
  }

  const landCoverCount = images.filter((image) => image.isLandCover).length;
  if (landCoverCount !== 1) {
    throw new ApiError(
      '대표 가로 커버 이미지를 정확히 1장 지정해 주세요.',
      ErrorCode.VALIDATION,
      400,
    );
  }

  const portCoverCount = images.filter((image) => image.isPortCover).length;
  if (portCoverCount !== 1) {
    throw new ApiError(
      '대표 세로 커버 이미지를 정확히 1장 지정해 주세요.',
      ErrorCode.VALIDATION,
      400,
    );
  }
}

function slugify(value: string) {
  const normalized = value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || 'project';
}

async function resolveProjectSlug(
  name: string,
  explicitSlug: string | null,
  projectId: number | null,
) {
  if (explicitSlug) return explicitSlug;

  const baseSlug = slugify(name);
  const sb = supabaseAdmin;

  const { data, error } = await sb
    .from('projects')
    .select('projectId, slug')
    .like('slug', `${baseSlug}%`);

  if (error) {
    throw new ApiError(error.message, ErrorCode.UPSTREAM, 502, error);
  }

  const usedSlugs = new Set(
    (data ?? [])
      .filter((row) => row.slug && row.projectId !== projectId)
      .map((row) => row.slug as string),
  );

  if (!usedSlugs.has(baseSlug)) return baseSlug;

  let suffix = 2;
  while (usedSlugs.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
}

function toProjectRowInput(
  input: z.infer<typeof AdminProjectUpsertInputSchema>,
  slug: string | null,
) {
  return {
    name: input.name,
    category: input.category,
    description: input.description,
    area: input.area,
    location: input.location,
    type: input.type,
    photo: input.photo,
    year: input.year,
    slug,
    blogUrl: input.blogUrl,
    published: input.published,
  };
}

function normalizeImageDimensionsForStorage(width: number | null, height: number | null) {
  if (width === 1 || width === 2) {
    return { width, height: null as number | null };
  }

  if (width !== null && height !== null) {
    return {
      width: width >= height ? 2 : 1,
      height: null as number | null,
    };
  }

  return { width, height };
}

function toImageRows(projectId: number, images: AdminProjectImageInput[]) {
  return images.map((image, index) => {
    const normalized = normalizeImageDimensionsForStorage(image.width, image.height);

    return {
      projectId,
      path: image.path,
      width: normalized.width,
      height: normalized.height,
      no: image.no ?? index + 1,
      isLandCover: image.isLandCover,
      isPortCover: image.isPortCover,
      mime: image.mime,
      alt: image.alt,
    };
  });
}

export async function listAdminProjects(): Promise<AdminProjectListItem[]> {
  const sb = supabaseAdmin;

  const { data, error } = await sb
    .from('projects')
    .select(
      `
      projectId,
      name,
      category,
      slug,
      year,
      published,
      images_webp(path, isLandCover, isPortCover)
    `,
    )
    .order('projectId', { ascending: false });

  if (error) throw new ApiError(error.message, ErrorCode.UPSTREAM, 502, error);

  const rows = (data ?? []) as Array<{
    projectId: number;
    name: string;
    category: string | null;
    slug: string | null;
    year: number | null;
    published: boolean;
    images_webp?: Array<{ path: string; isLandCover: boolean; isPortCover: boolean }>;
  }>;

  return rows.map((project) =>
    AdminProjectListItemSchema.parse({
      projectId: project.projectId,
      name: project.name,
      category: project.category,
      slug: project.slug,
      year: project.year,
      published: project.published,
      landCover: project.images_webp?.find((image) => image.isLandCover)?.path ?? null,
      portCover: project.images_webp?.find((image) => image.isPortCover)?.path ?? null,
      imageCount: project.images_webp?.length ?? 0,
    }),
  );
}

export async function getAdminProjectById(
  projectId: number,
): Promise<AdminProjectDetail> {
  const sb = supabaseAdmin;

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
      published,
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
    .eq('projectId', projectId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new ApiError('Project not found', ErrorCode.NOT_FOUND, 404);
    }
    throw new ApiError(error.message, ErrorCode.UPSTREAM, 502, error);
  }

  if (!data) {
    throw new ApiError('Project not found', ErrorCode.NOT_FOUND, 404);
  }

  const sortedImages = [...(data.images_webp ?? [])].sort((a, b) => {
    const aOrder = a.no ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.no ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.imageId - b.imageId;
  });

  return AdminProjectDetailSchema.parse({
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
    published: data.published,
    images: sortedImages.map((image) => ({
      imageId: image.imageId,
      projectId: image.projectId,
      path: image.path,
      width: image.width,
      height: image.height,
      no: image.no,
      isLandCover: image.isLandCover,
      isPortCover: image.isPortCover,
      mime: image.mime,
      alt: image.alt,
    })),
  });
}

export async function createAdminProject(input: unknown) {
  const parsed = AdminProjectUpsertInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new ApiError(
      '입력한 내용을 다시 확인해 주세요.',
      ErrorCode.VALIDATION,
      400,
      parsed.error.flatten(),
    );
  }

  assertCoverFlags(parsed.data.images);

  const resolvedSlug = await resolveProjectSlug(parsed.data.name, parsed.data.slug, null);
  const sb = supabaseAdmin;
  let createdProjectId: number | null = null;
  let lastDuplicateError: unknown = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const nextProjectId = await resolveNextProjectId(sb);
    const { data: created, error: createError } = await sb
      .from('projects')
      .insert({
        projectId: nextProjectId,
        ...toProjectRowInput(parsed.data, resolvedSlug),
      })
      .select('projectId')
      .single();

    if (createError) {
      if (isProjectsPrimaryKeyDuplicateError(createError)) {
        lastDuplicateError = createError;
        continue;
      }
      throw new ApiError(createError.message, ErrorCode.UPSTREAM, 502, createError);
    }

    if (!created) {
      throw new ApiError('Project create failed', ErrorCode.INTERNAL, 500);
    }

    createdProjectId = created.projectId;
    break;
  }

  if (createdProjectId === null) {
    throw new ApiError(
      '새 projectId를 할당하지 못했습니다. 잠시 후 다시 시도해 주세요.',
      ErrorCode.UPSTREAM,
      502,
      lastDuplicateError,
    );
  }

  if (parsed.data.images.length > 0) {
    const { error: imagesError } = await sb
      .from('images_webp')
      .insert(toImageRows(createdProjectId, parsed.data.images));

    if (imagesError) {
      throw new ApiError(imagesError.message, ErrorCode.UPSTREAM, 502, imagesError);
    }
  }

  return { projectId: createdProjectId };
}

export async function updateAdminProject(projectId: number, input: unknown) {
  const parsed = AdminProjectUpsertInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new ApiError(
      '입력한 내용을 다시 확인해 주세요.',
      ErrorCode.VALIDATION,
      400,
      parsed.error.flatten(),
    );
  }

  assertCoverFlags(parsed.data.images);

  const resolvedSlug = await resolveProjectSlug(
    parsed.data.name,
    parsed.data.slug,
    projectId,
  );
  const sb = supabaseAdmin;

  const { data: updated, error: updateError } = await sb
    .from('projects')
    .update(toProjectRowInput(parsed.data, resolvedSlug))
    .eq('projectId', projectId)
    .select('projectId')
    .maybeSingle();

  if (updateError)
    throw new ApiError(updateError.message, ErrorCode.UPSTREAM, 502, updateError);

  if (!updated) {
    throw new ApiError('Project not found', ErrorCode.NOT_FOUND, 404);
  }

  const { error: deleteImagesError } = await sb
    .from('images_webp')
    .delete()
    .eq('projectId', projectId);

  if (deleteImagesError) {
    throw new ApiError(
      deleteImagesError.message,
      ErrorCode.UPSTREAM,
      502,
      deleteImagesError,
    );
  }

  if (parsed.data.images.length > 0) {
    const { error: imagesError } = await sb
      .from('images_webp')
      .insert(toImageRows(projectId, parsed.data.images));

    if (imagesError) {
      throw new ApiError(imagesError.message, ErrorCode.UPSTREAM, 502, imagesError);
    }
  }

  return { projectId };
}

export async function deleteAdminProject(projectId: number) {
  const sb = supabaseAdmin;

  const { data: existing, error: existingError } = await sb
    .from('projects')
    .select('projectId')
    .eq('projectId', projectId)
    .maybeSingle();

  if (existingError) {
    throw new ApiError(existingError.message, ErrorCode.UPSTREAM, 502, existingError);
  }

  if (!existing) {
    throw new ApiError('Project not found', ErrorCode.NOT_FOUND, 404);
  }

  const { error: deleteImagesError } = await sb
    .from('images_webp')
    .delete()
    .eq('projectId', projectId);

  if (deleteImagesError) {
    throw new ApiError(
      deleteImagesError.message,
      ErrorCode.UPSTREAM,
      502,
      deleteImagesError,
    );
  }

  const { error: deleteProjectError } = await sb
    .from('projects')
    .delete()
    .eq('projectId', projectId);

  if (deleteProjectError) {
    throw new ApiError(
      deleteProjectError.message,
      ErrorCode.UPSTREAM,
      502,
      deleteProjectError,
    );
  }

  return { projectId };
}
