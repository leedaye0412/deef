import crypto from 'node:crypto';

import sharp from 'sharp';

import { requireAuthenticated } from '@features/admin/auth/server/queries';
import { supabaseAdmin } from '@lib/supabase/admin';
import { ApiError } from '@shared/errors/ApiError';
import { withSimpleRoute } from '@shared/server/withRoute';
import { ErrorCode } from '@shared/types';

const MAX_UPLOAD_SIZE_BYTES = 15 * 1024 * 1024;
const DEFAULT_BUCKET = 'images';
const WEBP_QUALITY = 82;

function sanitizeBaseName(name: string) {
  const withoutExt = name.replace(/\.[^.]+$/, '');
  const safe = withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return safe.slice(0, 60) || 'project-image';
}

async function convertToWebp(inputBuffer: Buffer): Promise<Buffer> {
  try {
    return await sharp(inputBuffer).webp({ quality: WEBP_QUALITY }).toBuffer();
  } catch (sharpError) {
    throw new ApiError(
      '이미지를 WebP 형식으로 변환하지 못했습니다.',
      ErrorCode.INTERNAL,
      500,
      {
        sharpError: sharpError instanceof Error ? sharpError.message : String(sharpError),
      },
    );
  }
}

// POST /api/admin/projects/upload - 인증 관리자 전용 이미지 업로드
export const POST = withSimpleRoute(async (req) => {
  await requireAuthenticated();

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    throw new ApiError('Invalid form data', ErrorCode.BAD_REQUEST, 400);
  }

  const fileEntry = formData.get('file');
  if (!(fileEntry instanceof File)) {
    throw new ApiError('업로드할 이미지 파일이 필요합니다.', ErrorCode.VALIDATION, 400);
  }

  if (!fileEntry.type.startsWith('image/')) {
    throw new ApiError('이미지 파일만 업로드할 수 있습니다.', ErrorCode.VALIDATION, 400);
  }

  if (fileEntry.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new ApiError('파일 크기는 15MB 이하여야 합니다.', ErrorCode.VALIDATION, 400, {
      size: fileEntry.size,
    });
  }

  const sb = supabaseAdmin;
  const bucket =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ??
    process.env.SUPABASE_STORAGE_BUCKET ??
    DEFAULT_BUCKET;
  const sourceBuffer = Buffer.from(await fileEntry.arrayBuffer());
  const webpBuffer = await convertToWebp(sourceBuffer);
  const baseName = sanitizeBaseName(fileEntry.name);
  const datePath = new Date().toISOString().slice(0, 10).replace(/-/g, '/');
  const objectPath = `projects/${datePath}/${crypto.randomUUID()}-${baseName}.webp`;

  const { error: uploadError } = await sb.storage
    .from(bucket)
    .upload(objectPath, webpBuffer, {
      contentType: 'image/webp',
      upsert: false,
      cacheControl: '31536000',
    });

  if (uploadError) {
    throw new ApiError(uploadError.message, ErrorCode.UPSTREAM, 502, uploadError);
  }

  const {
    data: { publicUrl },
  } = sb.storage.from(bucket).getPublicUrl(objectPath);

  return {
    path: publicUrl,
    mime: 'image/webp',
    size: webpBuffer.byteLength,
  };
});
