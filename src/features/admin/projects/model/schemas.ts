import { z } from 'zod';

const PG_INT_MAX = 2147483647;

const nullableTrimmedText = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

const nullableTrimmedTextMax = (max: number, message: string) =>
  nullableTrimmedText.refine((value) => value === null || value.length <= max, {
    message,
  });

const nullableUrlText = nullableTrimmedText.superRefine((value, ctx) => {
  if (!value) return;
  if (!z.string().url().safeParse(value).success) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '블로그 주소는 https://로 시작하는 전체 주소를 입력해 주세요.',
    });
  }
});

const nullableYear = z
  .union([z.number(), z.nan(), z.null(), z.undefined()])
  .transform((value) => (typeof value === 'number' ? value : null))
  .superRefine((value, ctx) => {
    if (value === null) return;

    if (!Number.isFinite(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '연도에는 숫자만 입력해 주세요.',
      });
      return;
    }

    if (!Number.isInteger(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '연도는 소수점 없이 입력해 주세요.',
      });
      return;
    }

    if (value < 1900 || value > 2100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '연도는 1900~2100 범위로 입력해 주세요.',
      });
    }
  });

const nullableArea = z
  .union([z.number(), z.nan(), z.null(), z.undefined()])
  .transform((value) => (typeof value === 'number' ? value : null))
  .superRefine((value, ctx) => {
    if (value === null) return;

    if (!Number.isFinite(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '면적에는 숫자만 입력해 주세요.',
      });
      return;
    }

    if (!Number.isInteger(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '면적은 소수점 없이 입력해 주세요.',
      });
      return;
    }

    if (value < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '면적은 0 이상의 값으로 입력해 주세요.',
      });
      return;
    }

    if (value > PG_INT_MAX) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '면적은 2,147,483,647 이하로 입력해 주세요.',
      });
    }
  });

const imagePathSchema = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) =>
      value.startsWith('/') ||
      value.startsWith('http://') ||
      value.startsWith('https://'),
    {
      message: '이미지 경로가 올바르지 않습니다.',
    },
  );

export const AdminProjectImageSchema = z.object({
  imageId: z.number().int().positive(),
  projectId: z.number().int().positive(),
  path: imagePathSchema,
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  no: z.number().int().nonnegative().nullable(),
  isLandCover: z.boolean(),
  isPortCover: z.boolean(),
  mime: nullableTrimmedText,
  alt: nullableTrimmedText,
});

export const AdminProjectImageInputSchema = z.object({
  path: imagePathSchema,
  width: z
    .union([z.number().int().positive(), z.null(), z.undefined()])
    .transform((value) => (typeof value === 'number' ? value : null)),
  height: z
    .union([z.number().int().positive(), z.null(), z.undefined()])
    .transform((value) => (typeof value === 'number' ? value : null)),
  no: z
    .union([z.number().int().nonnegative(), z.null(), z.undefined()])
    .transform((value) => (typeof value === 'number' ? value : null)),
  isLandCover: z.boolean().default(false),
  isPortCover: z.boolean().default(false),
  mime: nullableTrimmedText,
  alt: nullableTrimmedText,
});

export const AdminProjectUpsertInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, '프로젝트명은 필수입니다.')
      .max(200, '프로젝트명은 200자 이하로 입력해 주세요.'),
    category: z
      .string()
      .trim()
      .min(1, '카테고리는 필수입니다.')
      .max(100, '카테고리는 100자 이하로 입력해 주세요.'),
    description: nullableTrimmedText,
    area: nullableArea,
    location: nullableTrimmedTextMax(255, '장소는 255자 이하로 입력해 주세요.'),
    type: nullableTrimmedTextMax(100, '타입은 100자 이하로 입력해 주세요.'),
    photo: nullableTrimmedTextMax(200, '사진작가는 200자 이하로 입력해 주세요.'),
    year: nullableYear,
    slug: nullableTrimmedTextMax(200, '슬러그는 200자 이하로 입력해 주세요.'),
    blogUrl: nullableUrlText,
    published: z.boolean(),
    images: z
      .array(AdminProjectImageInputSchema)
      .min(1, '프로젝트 이미지를 최소 1장 업로드해 주세요.')
      .max(120),
  })
  .superRefine((value, ctx) => {
    const landCoverCount = value.images.filter((image) => image.isLandCover).length;
    if (landCoverCount !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['images'],
        message: '대표 가로 커버 이미지를 정확히 1장 지정해 주세요.',
      });
    }

    const portCoverCount = value.images.filter((image) => image.isPortCover).length;
    if (portCoverCount !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['images'],
        message: '대표 세로 커버 이미지를 정확히 1장 지정해 주세요.',
      });
    }
  });

export const AdminProjectListItemSchema = z.object({
  projectId: z.number().int().positive(),
  name: z.string(),
  category: z.string().nullable(),
  slug: z.string().nullable(),
  year: z.number().int().nullable(),
  published: z.boolean(),
  landCover: z.string().nullable(),
  portCover: z.string().nullable(),
  imageCount: z.number().int().nonnegative(),
});

export const AdminProjectDetailSchema = z.object({
  projectId: z.number().int().positive(),
  name: z.string(),
  category: z.string().nullable(),
  description: z.string().nullable(),
  area: z.number().nullable(),
  location: z.string().nullable(),
  type: z.string().nullable(),
  photo: z.string().nullable(),
  year: z.number().int().nullable(),
  slug: z.string().nullable(),
  blogUrl: z.string().nullable(),
  published: z.boolean(),
  images: z.array(AdminProjectImageSchema),
});

export const AdminProjectMutationResultSchema = z.object({
  projectId: z.number().int().positive(),
});

export const AdminProjectUploadResultSchema = z.object({
  path: z.string().url(),
  mime: z.string().nullable(),
  size: z.number().int().nonnegative(),
});

export type AdminProjectImage = z.infer<typeof AdminProjectImageSchema>;
export type AdminProjectImageInput = z.infer<typeof AdminProjectImageInputSchema>;
export type AdminProjectUpsertInput = z.infer<typeof AdminProjectUpsertInputSchema>;
export type AdminProjectListItem = z.infer<typeof AdminProjectListItemSchema>;
export type AdminProjectDetail = z.infer<typeof AdminProjectDetailSchema>;
export type AdminProjectMutationResult = z.infer<typeof AdminProjectMutationResultSchema>;
export type AdminProjectUploadResult = z.infer<typeof AdminProjectUploadResultSchema>;
