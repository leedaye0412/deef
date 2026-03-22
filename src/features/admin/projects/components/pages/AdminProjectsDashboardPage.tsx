'use client';

import { Check, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import { ApiError } from '@shared/errors/ApiError';

import { adminNoticeTone, adminTheme } from '@/features/admin/shared/styles/adminTheme';
import type { ProjectDetail } from '@/features/projects/api/client';

import {
  uploadAdminProjectImage,
  type AdminProjectDetail,
  type AdminProjectUpsertInput,
} from '../../api/client';
import {
  useAdminProject,
  useAdminProjects,
  useCreateAdminProject,
  useDeleteAdminProject,
  useUpdateAdminProject,
} from '../../api/hooks';
import {
  ADMIN_PROJECT_PREVIEW_UPDATE_MESSAGE,
  isAdminProjectPreviewReadyMessage,
} from '../../model/preview';
import { AdminProjectUpsertInputSchema } from '../../model/schemas';

type Notice = { type: 'success' | 'error' | 'neutral'; text: string } | null;

type EditorImage = {
  path: string;
  width: number | null;
  height: number | null;
  no: string;
  isLandCover: boolean;
  isPortCover: boolean;
  mime: string;
  alt: string;
};

type EditorState = {
  name: string;
  category: string;
  descriptionPrimary: string;
  descriptionSecondary: string;
  area: string;
  location: string;
  type: string;
  photo: string;
  year: string;
  slug: string;
  blogUrl: string;
  published: boolean;
  images: EditorImage[];
};

type ImageOrientation = 'landscape' | 'portrait';
type PreviewViewport = 'desktop' | 'mobile';

const panelClass = `rounded-[24px] p-5 md:p-6 ${adminTheme.panel}`;
const labelClass = 'font-pretendard text-[13px] font-semibold text-white/75';
const inputClass = `h-[48px] w-full rounded-2xl px-4 text-[15px] font-medium transition ${adminTheme.input}`;
const textareaClass = `min-h-[128px] w-full rounded-2xl px-4 py-3 text-[15px] font-medium transition ${adminTheme.input}`;
const invalidFieldClass =
  'border-[#ff6c6c]/80 focus:border-[#ff6c6c] focus:ring-[#ff6c6c]/30';
const DESCRIPTION_SEPARATOR = '<br/>';

const emptyEditorState = (): EditorState => ({
  name: '',
  category: '',
  descriptionPrimary: '',
  descriptionSecondary: '',
  area: '',
  location: '',
  type: '',
  photo: '',
  year: '',
  slug: '',
  blogUrl: '',
  published: true,
  images: [],
});

function splitDescription(description: string | null | undefined): [string, string] {
  if (!description) return ['', ''];

  const [primary = '', ...secondaryParts] = description.split(DESCRIPTION_SEPARATOR);
  return [primary, secondaryParts.join(DESCRIPTION_SEPARATOR)];
}

function joinDescription(primary: string, secondary: string) {
  const trimmedPrimary = primary.trim();
  const trimmedSecondary = secondary.trim();

  if (!trimmedPrimary && !trimmedSecondary) return '';
  if (trimmedPrimary && trimmedSecondary) {
    return `${trimmedPrimary}${DESCRIPTION_SEPARATOR}${trimmedSecondary}`;
  }
  return trimmedPrimary || trimmedSecondary;
}

function toEditorState(project: AdminProjectDetail): EditorState {
  const [descriptionPrimary, descriptionSecondary] = splitDescription(
    project.description,
  );

  return {
    name: project.name ?? '',
    category: project.category ?? '',
    descriptionPrimary,
    descriptionSecondary,
    area: project.area === null ? '' : String(project.area),
    location: project.location ?? '',
    type: project.type ?? '',
    photo: project.photo ?? '',
    year: project.year === null ? '' : String(project.year),
    slug: project.slug ?? '',
    blogUrl: project.blogUrl ?? '',
    published: project.published,
    images: (project.images ?? []).map((image, index) => ({
      path: image.path,
      width: image.width,
      height: image.height,
      no: image.no === null ? String(index + 1) : String(image.no),
      isLandCover: image.isLandCover,
      isPortCover: image.isPortCover,
      mime: image.mime ?? '',
      alt: image.alt ?? '',
    })),
  };
}

function toNullableText(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function toNullableNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function toNullableNumberForPayload(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return Number(trimmed);
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

function resolveImageOrientation(
  image: Pick<EditorImage, 'width' | 'height'>,
): ImageOrientation {
  if (image.width === 1) return 'portrait';
  if (image.width === 2) return 'landscape';
  if (image.width !== null && image.height !== null) {
    return image.height > image.width ? 'portrait' : 'landscape';
  }
  return 'landscape';
}

function getImageEntriesByOrientation(
  images: EditorImage[],
  orientation: ImageOrientation,
) {
  return images
    .map((image, index) => ({ image, index }))
    .filter((entry) => resolveImageOrientation(entry.image) === orientation);
}

function toPayload(editor: EditorState): AdminProjectUpsertInput {
  return {
    name: editor.name.trim(),
    category: editor.category.trim(),
    description: toNullableText(
      joinDescription(editor.descriptionPrimary, editor.descriptionSecondary),
    ),
    area: toNullableNumberForPayload(editor.area),
    location: toNullableText(editor.location),
    type: toNullableText(editor.type),
    photo: toNullableText(editor.photo),
    year: toNullableNumberForPayload(editor.year),
    slug: toNullableText(editor.slug),
    blogUrl: toNullableText(editor.blogUrl),
    published: editor.published,
    images: editor.images
      .filter((image) => image.path.trim().length > 0)
      .map((image, index) => {
        const normalized = normalizeImageDimensionsForStorage(image.width, image.height);

        return {
          path: image.path.trim(),
          width: normalized.width,
          height: normalized.height,
          no: Number.isFinite(Number(image.no)) ? Number(image.no) : index + 1,
          isLandCover: image.isLandCover,
          isPortCover: image.isPortCover,
          mime: toNullableText(image.mime),
          alt: toNullableText(image.alt),
        };
      }),
  };
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) {
    const details = error.details;

    if (details && typeof details === 'object') {
      const maybeFlattened = details as {
        formErrors?: unknown;
        fieldErrors?: Record<string, unknown>;
      };

      if (Array.isArray(maybeFlattened.formErrors)) {
        const firstFormError = maybeFlattened.formErrors.find(
          (entry): entry is string => typeof entry === 'string' && entry.length > 0,
        );
        if (firstFormError) return firstFormError;
      }

      if (maybeFlattened.fieldErrors && typeof maybeFlattened.fieldErrors === 'object') {
        for (const value of Object.values(maybeFlattened.fieldErrors)) {
          if (!Array.isArray(value)) continue;
          const firstFieldError = value.find(
            (entry): entry is string => typeof entry === 'string' && entry.length > 0,
          );
          if (firstFieldError) return firstFieldError;
        }
      }
    }

    return error.message;
  }
  if (error instanceof Error) return error.message;
  return '요청 처리 중 오류가 발생했습니다.';
}

function swap<T>(items: T[], from: number, to: number) {
  const copied = [...items];
  const temp = copied[from];
  copied[from] = copied[to];
  copied[to] = temp;
  return copied;
}

function normalizeNumbering(images: EditorImage[]) {
  return images.map((image, index) => ({
    ...image,
    no: String(index + 1),
  }));
}

function loadImageSize(
  file: File,
): Promise<{ width: number | null; height: number | null }> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({ width: image.naturalWidth || null, height: image.naturalHeight || null });
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      resolve({ width: null, height: null });
      URL.revokeObjectURL(objectUrl);
    };

    image.src = objectUrl;
  });
}

function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string | null;
}) {
  const helperMessage = error ?? hint;
  const helperToneClass = error
    ? adminTheme.dangerText
    : hint
      ? 'text-white/45'
      : 'text-transparent';

  return (
    <label className="grid gap-2">
      <span className={labelClass}>{label}</span>
      {children}
      <span className={`min-h-4 font-pretendard text-xs leading-4 ${helperToneClass}`}>
        {helperMessage ?? '\u00A0'}
      </span>
    </label>
  );
}

export default function AdminProjectsDashboardPage() {
  const {
    data: projects,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useAdminProjects();
  const createMutation = useCreateAdminProject();
  const updateMutation = useUpdateAdminProject();
  const deleteMutation = useDeleteAdminProject();

  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const { data: selectedProject, isFetching: isProjectLoading } =
    useAdminProject(selectedProjectId);

  const [editor, setEditor] = useState<EditorState>(emptyEditorState);
  const [loadedProjectId, setLoadedProjectId] = useState<number | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [activeImageOrientation, setActiveImageOrientation] =
    useState<ImageOrientation>('landscape');
  const [previewViewport, setPreviewViewport] = useState<PreviewViewport>('desktop');
  const previewFrameRef = useRef<HTMLIFrameElement | null>(null);

  const totalCount = projects?.length ?? 0;
  const publishedCount = useMemo(
    () => (projects ?? []).filter((project) => project.published).length,
    [projects],
  );
  const categoryOptions = useMemo(() => {
    const uniqueCategories = new Set<string>();

    for (const project of projects ?? []) {
      const category = project.category?.trim();
      if (category) uniqueCategories.add(category);
    }

    return [...uniqueCategories].sort((a, b) => a.localeCompare(b, 'ko-KR'));
  }, [projects]);
  const payloadValidation = useMemo(() => {
    const payload = toPayload(editor);
    return AdminProjectUpsertInputSchema.safeParse(payload);
  }, [editor]);
  const issueEntries = useMemo(() => {
    if (payloadValidation.success) return [] as Array<{ path: string; message: string }>;

    return payloadValidation.error.issues
      .filter((issue) => issue.path.length > 0)
      .map((issue) => ({
        path: issue.path.map((segment) => String(segment)).join('.'),
        message: issue.message,
      }));
  }, [payloadValidation]);
  const submitValidationMessage = payloadValidation.success
    ? null
    : (payloadValidation.error.issues[0]?.message ?? '입력 값을 확인해 주세요.');
  const hasIssue = (path: string) => {
    for (const issue of issueEntries) {
      if (issue.path === path || issue.path.startsWith(`${path}.`)) return true;
    }
    return false;
  };
  const getIssueMessage = (path: string) => {
    const exactMatch = issueEntries.find((issue) => issue.path === path);
    if (exactMatch) return exactMatch.message;

    const nestedMatch = issueEntries.find((issue) => issue.path.startsWith(`${path}.`));
    return nestedMatch?.message ?? null;
  };
  const getExactIssueMessage = (path: string) => {
    return issueEntries.find((issue) => issue.path === path)?.message ?? null;
  };
  const advancedFieldPaths = ['type', 'photo', 'year', 'area', 'blogUrl'];
  const hasAdvancedFieldIssue = advancedFieldPaths.some((path) => hasIssue(path));
  const firstAdvancedIssueMessage =
    issueEntries.find((issue) =>
      advancedFieldPaths.some(
        (path) => issue.path === path || issue.path.startsWith(`${path}.`),
      ),
    )?.message ?? null;
  const advancedFieldFilledCount = advancedFieldPaths.reduce((count, path) => {
    const value =
      editor[
        path as keyof Pick<EditorState, 'type' | 'photo' | 'year' | 'area' | 'blogUrl'>
      ];
    return value.trim().length > 0 ? count + 1 : count;
  }, 0);
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const isSubmitDisabled = isSaving || isUploadingImage || !payloadValidation.success;
  const submitStatusMessage = isUploadingImage
    ? '이미지 업로드가 끝나면 저장할 수 있어요.'
    : submitValidationMessage
      ? `저장 전에 확인해 주세요: ${submitValidationMessage}`
      : '저장할 준비가 완료되었습니다.';

  useEffect(() => {
    if (mode !== 'edit' || !selectedProject) return;
    if (loadedProjectId === selectedProject.projectId) return;

    setEditor(toEditorState(selectedProject));
    setLoadedProjectId(selectedProject.projectId);
  }, [loadedProjectId, mode, selectedProject]);

  const landscapeImageEntries = useMemo(
    () => getImageEntriesByOrientation(editor.images, 'landscape'),
    [editor.images],
  );
  const portraitImageEntries = useMemo(
    () => getImageEntriesByOrientation(editor.images, 'portrait'),
    [editor.images],
  );
  const activeImageEntries =
    activeImageOrientation === 'landscape' ? landscapeImageEntries : portraitImageEntries;
  const activeImageTitle =
    activeImageOrientation === 'landscape' ? '가로 이미지' : '세로 이미지';

  useEffect(() => {
    const hasActiveEntries =
      (activeImageOrientation === 'landscape' && landscapeImageEntries.length > 0) ||
      (activeImageOrientation === 'portrait' && portraitImageEntries.length > 0);
    if (hasActiveEntries) return;

    const fallbackOrientation: ImageOrientation =
      landscapeImageEntries.length > 0
        ? 'landscape'
        : portraitImageEntries.length > 0
          ? 'portrait'
          : 'landscape';
    if (activeImageOrientation !== fallbackOrientation) {
      setActiveImageOrientation(fallbackOrientation);
    }
  }, [activeImageOrientation, landscapeImageEntries.length, portraitImageEntries.length]);

  const startCreate = () => {
    setMode('create');
    setSelectedProjectId(null);
    setLoadedProjectId(null);
    setEditor(emptyEditorState());
    setShowAdvancedFields(false);
    setNotice({ type: 'neutral', text: '새 프로젝트 등록 모드입니다.' });
  };

  const startEdit = (projectId: number) => {
    setMode('edit');
    setSelectedProjectId(projectId);
    setLoadedProjectId(null);
    setShowAdvancedFields(false);
    setNotice(null);
  };

  const setImageCover = (
    index: number,
    key: 'isLandCover' | 'isPortCover',
    value: boolean,
  ) => {
    setEditor((prev) => ({
      ...prev,
      images: prev.images.map((image, imageIndex) => {
        if (!value) {
          return imageIndex === index ? { ...image, [key]: false } : image;
        }
        if (imageIndex === index) return { ...image, [key]: true };
        return { ...image, [key]: false };
      }),
    }));
  };

  const moveImageInOrientation = (
    orientation: ImageOrientation,
    orientationIndex: number,
    direction: 'up' | 'down',
  ) => {
    const nextOrientationIndex =
      direction === 'up' ? orientationIndex - 1 : orientationIndex + 1;

    setEditor((prev) => {
      const entries = getImageEntriesByOrientation(prev.images, orientation);
      if (nextOrientationIndex < 0 || nextOrientationIndex >= entries.length) return prev;

      const sourceIndex = entries[orientationIndex]?.index;
      const targetIndex = entries[nextOrientationIndex]?.index;
      if (sourceIndex === undefined || targetIndex === undefined) return prev;

      const nextImages = swap(prev.images, sourceIndex, targetIndex);
      return { ...prev, images: normalizeNumbering(nextImages) };
    });
  };

  const removeImageInOrientation = (
    orientation: ImageOrientation,
    orientationIndex: number,
  ) => {
    setEditor((prev) => {
      const entries = getImageEntriesByOrientation(prev.images, orientation);
      const targetIndex = entries[orientationIndex]?.index;
      if (targetIndex === undefined) return prev;

      return {
        ...prev,
        images: normalizeNumbering(
          prev.images.filter((_, imageIndex) => imageIndex !== targetIndex),
        ),
      };
    });
  };

  const handleUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setNotice(null);
    setIsUploadingImage(true);

    try {
      const uploadedImages: EditorImage[] = [];

      for (const file of files) {
        const [uploadResult, size] = await Promise.all([
          uploadAdminProjectImage(file),
          loadImageSize(file),
        ]);
        const normalized = normalizeImageDimensionsForStorage(size.width, size.height);

        uploadedImages.push({
          path: uploadResult.path,
          width: normalized.width,
          height: normalized.height,
          no: '0',
          isLandCover: false,
          isPortCover: false,
          mime: uploadResult.mime ?? '',
          alt: '',
        });
      }

      setEditor((prev) => ({
        ...prev,
        images: normalizeNumbering([...prev.images, ...uploadedImages]),
      }));

      setNotice({
        type: 'success',
        text: `${uploadedImages.length}장의 이미지 업로드가 완료되었습니다.`,
      });
    } catch (error) {
      setNotice({ type: 'error', text: errorMessage(error) });
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    const payload = toPayload(editor);
    const parsedPayload = AdminProjectUpsertInputSchema.safeParse(payload);
    if (!parsedPayload.success) {
      const hasAdvancedIssueInSubmit = parsedPayload.error.issues.some((issue) => {
        const issuePath = issue.path.map((segment) => String(segment)).join('.');
        return advancedFieldPaths.some(
          (path) => issuePath === path || issuePath.startsWith(`${path}.`),
        );
      });
      if (hasAdvancedIssueInSubmit) setShowAdvancedFields(true);

      setNotice({
        type: 'error',
        text: parsedPayload.error.issues[0]?.message ?? '입력 값을 확인해 주세요.',
      });
      return;
    }

    try {
      if (mode === 'create') {
        const created = await createMutation.mutateAsync(parsedPayload.data);
        setMode('edit');
        setSelectedProjectId(created.projectId);
        setLoadedProjectId(null);
        setNotice({ type: 'success', text: '프로젝트가 등록되었습니다.' });
        return;
      }

      if (!selectedProjectId) {
        setNotice({ type: 'error', text: '수정할 프로젝트를 선택해 주세요.' });
        return;
      }

      await updateMutation.mutateAsync({
        projectId: selectedProjectId,
        input: parsedPayload.data,
      });
      setNotice({ type: 'success', text: '프로젝트가 수정되었습니다.' });
    } catch (error) {
      setNotice({ type: 'error', text: errorMessage(error) });
    }
  };

  const handleDelete = async () => {
    if (!selectedProjectId) {
      setNotice({ type: 'error', text: '삭제할 프로젝트를 먼저 선택해 주세요.' });
      return;
    }

    const shouldDelete = window.confirm(
      '선택한 프로젝트를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.',
    );
    if (!shouldDelete) return;

    try {
      await deleteMutation.mutateAsync(selectedProjectId);
      startCreate();
      setNotice({ type: 'success', text: '프로젝트가 삭제되었습니다.' });
    } catch (error) {
      setNotice({ type: 'error', text: errorMessage(error) });
    }
  };

  const renderImageGroup = (
    title: string,
    orientation: ImageOrientation,
    entries: Array<{ image: EditorImage; index: number }>,
  ) => {
    const coverKey = orientation === 'landscape' ? 'isLandCover' : 'isPortCover';
    const aspectClass = orientation === 'landscape' ? 'aspect-[16/10]' : 'aspect-[4/5]';

    return (
      <section className={`rounded-2xl p-3 ${adminTheme.cardSurface}`}>
        <div className="flex items-center justify-between">
          <h4 className="font-pretendard text-sm font-semibold text-white">{title}</h4>
          <span className="font-pretendard text-xs text-white/60">
            {entries.length}장
          </span>
        </div>

        {entries.length === 0 ? (
          <p className="mt-3 font-pretendard text-sm text-white/55">
            등록된 이미지가 없습니다.
          </p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, orientationIndex) => {
              const image = entry.image;
              const index = entry.index;
              const imageRowError = getExactIssueMessage(`images.${index}`);
              const isCover =
                coverKey === 'isLandCover' ? image.isLandCover : image.isPortCover;
              const removeAriaLabel = `${title} ${orientationIndex + 1}번 이미지 삭제`;

              return (
                <div
                  key={`${image.path}-${index}`}
                  className={`rounded-2xl p-2 ${adminTheme.surface} ${
                    hasIssue(`images.${index}`) ? 'border-[#ff6c6c]/80' : ''
                  }`}
                >
                  <div
                    className={`relative overflow-hidden rounded-xl border border-white/10 bg-black/70 ${aspectClass}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.path}
                      alt={`project-image-${index + 1}`}
                      className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                    <span className="absolute left-2 top-2 rounded-full border border-white/30 bg-black/45 px-2 py-1 font-pretendard text-[11px] font-semibold text-white/85">
                      {orientationIndex + 1} / {entries.length}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        removeImageInOrientation(orientation, orientationIndex)
                      }
                      aria-label={removeAriaLabel}
                      title="이미지 삭제"
                      className={`absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border bg-black/55 transition ${adminTheme.dangerBadge}`}
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setImageCover(index, coverKey, true)}
                        className={`inline-flex h-8 items-center gap-1 rounded-full border px-3 font-pretendard text-[11px] font-semibold transition ${
                          isCover
                            ? adminTheme.accentSoftStrong
                            : 'border-white/25 bg-black/45 text-white/80 hover:border-white/45'
                        }`}
                      >
                        {isCover ? <Check className="h-3.5 w-3.5" /> : null}
                        {isCover ? '대표 이미지' : '대표 선택'}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            moveImageInOrientation(orientation, orientationIndex, 'up')
                          }
                          disabled={orientationIndex === 0}
                          aria-label="이전 순서로 이동"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white/80 transition hover:border-white/45 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            moveImageInOrientation(orientation, orientationIndex, 'down')
                          }
                          disabled={orientationIndex === entries.length - 1}
                          aria-label="다음 순서로 이동"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white/80 transition hover:border-white/45 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p
                    className={`mt-2 min-h-4 px-1 font-pretendard text-xs leading-4 ${
                      imageRowError ? adminTheme.dangerText : 'text-transparent'
                    }`}
                  >
                    {imageRowError ?? '\u00A0'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  const previewProject = useMemo<ProjectDetail>(() => {
    const projectId = selectedProjectId ?? 0;
    const mappedImages = editor.images
      .filter((image) => image.path.trim().length > 0)
      .map((image, index) => ({
        imageId: index + 1,
        projectId,
        path: image.path.trim(),
        width: image.width,
        height: image.height,
        no: Number.isFinite(Number(image.no)) ? Number(image.no) : index + 1,
        isLandCover: image.isLandCover,
        isPortCover: image.isPortCover,
        mime: toNullableText(image.mime),
        alt: toNullableText(image.alt),
      }))
      .sort((a, b) => {
        const aOrder = a.no ?? Number.MAX_SAFE_INTEGER;
        const bOrder = b.no ?? Number.MAX_SAFE_INTEGER;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.imageId - b.imageId;
      });

    return {
      projectId,
      name: editor.name.trim() || '프로젝트명 미입력',
      category: toNullableText(editor.category),
      description: toNullableText(
        joinDescription(editor.descriptionPrimary, editor.descriptionSecondary),
      ),
      area: toNullableNumber(editor.area),
      location: toNullableText(editor.location),
      type: toNullableText(editor.type),
      photo: toNullableText(editor.photo),
      year: toNullableNumber(editor.year),
      slug: toNullableText(editor.slug),
      blogUrl: toNullableText(editor.blogUrl),
      images: mappedImages,
    };
  }, [editor, selectedProjectId]);

  const postPreviewProject = useCallback(() => {
    const previewFrameWindow = previewFrameRef.current?.contentWindow;
    if (!previewFrameWindow) return;

    previewFrameWindow.postMessage(
      {
        type: ADMIN_PROJECT_PREVIEW_UPDATE_MESSAGE,
        payload: previewProject,
      },
      window.location.origin,
    );
  }, [previewProject]);

  useEffect(() => {
    postPreviewProject();
  }, [postPreviewProject]);

  useEffect(() => {
    const onPreviewReady = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin) return;
      if (!isAdminProjectPreviewReadyMessage(event.data)) return;
      if (event.source !== previewFrameRef.current?.contentWindow) return;

      postPreviewProject();
    };

    window.addEventListener('message', onPreviewReady);
    return () => {
      window.removeEventListener('message', onPreviewReady);
    };
  }, [postPreviewProject]);

  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className={`${panelClass} h-fit`}>
        <div className="flex items-center justify-between">
          <h2 className="font-pretendard text-[22px] font-bold tracking-[-0.02em] text-white">
            프로젝트 목록
          </h2>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isRefetching}
            className="inline-flex h-9 items-center rounded-full border border-white/20 px-3 font-pretendard text-xs font-semibold text-white/75 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            새로고침
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <article className={`rounded-2xl px-3 py-3 ${adminTheme.surface}`}>
            <p className="font-pretendard text-xs font-semibold text-white/55">전체</p>
            <p className="mt-1 font-pretendard text-[22px] font-bold text-white">
              {totalCount}
            </p>
          </article>
          <article className={`rounded-2xl px-3 py-3 ${adminTheme.surface}`}>
            <p className="font-pretendard text-xs font-semibold text-white/55">게시됨</p>
            <p
              className={`mt-1 font-pretendard text-[22px] font-bold ${adminTheme.accentText}`}
            >
              {publishedCount}
            </p>
          </article>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className={`mt-4 inline-flex h-[48px] w-full items-center justify-center rounded-2xl font-pretendard text-[15px] font-semibold ${adminTheme.primaryButton}`}
        >
          새 프로젝트 등록
        </button>

        <div className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto pr-1">
          {isLoading ? (
            <p className="font-pretendard text-sm text-white/60">
              프로젝트 목록을 불러오는 중...
            </p>
          ) : null}
          {isError ? (
            <p className={`font-pretendard text-sm ${adminTheme.dangerText}`}>
              목록을 불러오지 못했습니다. 새로고침해 주세요.
            </p>
          ) : null}
          {(projects ?? []).map((project) => {
            const isSelected = mode === 'edit' && selectedProjectId === project.projectId;
            return (
              <button
                key={project.projectId}
                type="button"
                onClick={() => startEdit(project.projectId)}
                className={`w-full rounded-2xl px-3 py-3 text-left transition ${
                  isSelected
                    ? adminTheme.accentSoftSelection
                    : `${adminTheme.surface} hover:border-white/25`
                }`}
              >
                <p className="font-pretendard text-sm font-semibold text-white">
                  {project.name}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/15 px-2 py-0.5 font-pretendard text-[11px] font-semibold text-white/70">
                    #{project.projectId}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-pretendard text-[11px] font-semibold ${
                      project.published
                        ? adminTheme.accentSoft
                        : 'border border-white/20 bg-white/[0.04] text-white/65'
                    }`}
                  >
                    {project.published ? '게시중' : '비공개'}
                  </span>
                  <span className="font-pretendard text-[11px] text-white/45">
                    이미지 {project.imageCount}장
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="space-y-6">
        <article className={panelClass}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3">
              <h2 className="mt-2 font-pretendard text-[30px] leading-[1.2] font-bold tracking-[-0.02em] text-white">
                {mode === 'create'
                  ? '새 프로젝트 등록'
                  : `#${selectedProjectId} ${editor.name.trim() ? `${editor.name.trim()} 프로젝트 관리` : ''}`}
              </h2>
              {mode === 'edit' && selectedProjectId ? (
                editor.published ? (
                  <Link
                    href={`/projects/${selectedProjectId}`}
                    target="_blank"
                    aria-label="게시 페이지 열기"
                    title="게시 페이지 열기"
                    className="mt-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    aria-label="비공개 상태에서는 게시 페이지를 열 수 없습니다."
                    title="비공개 상태에서는 게시 페이지를 열 수 없습니다."
                    className="mt-2 inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full border border-white/15 text-white/35"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                )
              ) : null}
            </div>
          </div>

          {notice ? (
            <div
              className={`mt-5 rounded-2xl px-4 py-3 ${
                notice.type === 'error'
                  ? `${adminNoticeTone.error.box} ${adminNoticeTone.error.text}`
                  : notice.type === 'success'
                    ? `${adminNoticeTone.success.box} ${adminNoticeTone.success.text}`
                    : `${adminNoticeTone.neutral.box} ${adminNoticeTone.neutral.text}`
              }`}
            >
              <p className="font-pretendard text-[14px] font-medium">{notice.text}</p>
            </div>
          ) : null}

          {isProjectLoading && mode === 'edit' ? (
            <p className="mt-4 font-pretendard text-sm text-white/60">
              프로젝트 상세 정보를 불러오는 중...
            </p>
          ) : null}

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <section className={`rounded-2xl p-4 ${adminTheme.surface}`}>
              <h3 className="font-pretendard text-[18px] font-bold text-white">
                1. 기본 정보
              </h3>
              <p className="mt-1 font-pretendard text-xs text-white/55">
                먼저 방문자가 가장 먼저 보게 되는 내용을 입력해 주세요.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field
                  label="프로젝트 이름은 무엇인가요? *"
                  error={getIssueMessage('name')}
                >
                  <input
                    value={editor.name}
                    onChange={(event) =>
                      setEditor((prev) => ({ ...prev, name: event.target.value }))
                    }
                    placeholder="예: 서교동 하우스 리모델링"
                    className={`${inputClass} ${hasIssue('name') ? invalidFieldClass : ''}`}
                    required
                  />
                </Field>

                <Field
                  label="어떤 카테고리인가요? *"
                  hint="기존 목록에서 고르거나 새 이름을 직접 입력할 수 있어요."
                  error={getIssueMessage('category')}
                >
                  <input
                    value={editor.category}
                    onChange={(event) =>
                      setEditor((prev) => ({ ...prev, category: event.target.value }))
                    }
                    placeholder="예: Residential"
                    className={`${inputClass} ${hasIssue('category') ? invalidFieldClass : ''}`}
                    list="admin-project-category-options"
                    required
                  />
                  <datalist id="admin-project-category-options">
                    {categoryOptions.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </Field>

                <Field
                  label="어디에 있는 프로젝트인가요?"
                  error={getIssueMessage('location')}
                >
                  <input
                    value={editor.location}
                    onChange={(event) =>
                      setEditor((prev) => ({ ...prev, location: event.target.value }))
                    }
                    placeholder="예: 서울 마포구"
                    className={`${inputClass} ${hasIssue('location') ? invalidFieldClass : ''}`}
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field
                  label="프로젝트를 소개해 주세요"
                  error={getIssueMessage('description')}
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <textarea
                      value={editor.descriptionPrimary}
                      onChange={(event) =>
                        setEditor((prev) => ({
                          ...prev,
                          descriptionPrimary: event.target.value,
                        }))
                      }
                      placeholder="첫 번째 소개 문구"
                      className={`${textareaClass} ${hasIssue('description') ? invalidFieldClass : ''}`}
                    />
                    <textarea
                      value={editor.descriptionSecondary}
                      onChange={(event) =>
                        setEditor((prev) => ({
                          ...prev,
                          descriptionSecondary: event.target.value,
                        }))
                      }
                      placeholder="두 번째 소개 문구"
                      className={`${textareaClass} ${hasIssue('description') ? invalidFieldClass : ''}`}
                    />
                  </div>
                </Field>
              </div>

              <div className="mt-5 grid gap-2">
                <span className={labelClass}>공개 설정</span>
                <div
                  className="grid gap-2 md:max-w-[340px]"
                  role="radiogroup"
                  aria-label="공개 설정 선택"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={editor.published}
                    onClick={() => setEditor((prev) => ({ ...prev, published: true }))}
                    className={`rounded-2xl border px-3 py-2 text-left transition ${
                      editor.published
                        ? adminTheme.accentSoftSelection
                        : `${adminTheme.inputSurface} hover:border-white/25`
                    }`}
                  >
                    <p className="font-pretendard text-sm font-semibold text-white">
                      지금 공개
                    </p>
                    <p className="mt-1 font-pretendard text-[11px] text-white/60">
                      저장하면 사이트 방문자에게 바로 보여요.
                    </p>
                  </button>

                  <button
                    type="button"
                    role="radio"
                    aria-checked={!editor.published}
                    onClick={() => setEditor((prev) => ({ ...prev, published: false }))}
                    className={`rounded-2xl border px-3 py-2 text-left transition ${
                      !editor.published
                        ? adminTheme.accentSoftSelection
                        : `${adminTheme.inputSurface} hover:border-white/25`
                    }`}
                  >
                    <p className="font-pretendard text-sm font-semibold text-white">
                      임시 저장(비공개)
                    </p>
                    <p className="mt-1 font-pretendard text-[11px] text-white/60">
                      방문자에게는 숨기고 관리자 화면에서만 수정할 수 있어요.
                    </p>
                  </button>
                </div>
              </div>
            </section>

            <section
              className={`rounded-2xl p-4 ${adminTheme.surface} ${
                hasAdvancedFieldIssue ? 'border-[#ff6c6c]/80' : ''
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-pretendard text-[18px] font-bold text-white">
                    2. 추가 정보 (선택)
                  </h3>
                  <p className="mt-1 font-pretendard text-xs text-white/55">
                    입력된 항목 {advancedFieldFilledCount}개
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdvancedFields((prev) => !prev)}
                  className={`inline-flex h-10 items-center rounded-full border border-white/20 px-4 font-pretendard text-sm font-semibold text-white/80 transition ${adminTheme.accentBorderHover} ${adminTheme.accentTextHover}`}
                >
                  {showAdvancedFields ? '추가 정보 접기' : '추가 정보 입력하기'}
                </button>
              </div>

              <p
                className={`mt-2 min-h-4 font-pretendard text-xs leading-4 ${
                  hasAdvancedFieldIssue ? adminTheme.dangerText : 'text-white/45'
                }`}
              >
                {hasAdvancedFieldIssue
                  ? (firstAdvancedIssueMessage ??
                    '추가 정보에서 확인이 필요한 항목이 있어요.')
                  : '필요할 때만 입력해도 괜찮아요.'}
              </p>

              {showAdvancedFields ? (
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <Field label="공간 타입은 무엇인가요?" error={getIssueMessage('type')}>
                    <input
                      value={editor.type}
                      onChange={(event) =>
                        setEditor((prev) => ({ ...prev, type: event.target.value }))
                      }
                      placeholder="예: 아파트, 상가, 오피스"
                      className={`${inputClass} ${hasIssue('type') ? invalidFieldClass : ''}`}
                    />
                  </Field>

                  <Field
                    label="사진 작가 이름이 있나요?"
                    error={getIssueMessage('photo')}
                  >
                    <input
                      value={editor.photo}
                      onChange={(event) =>
                        setEditor((prev) => ({ ...prev, photo: event.target.value }))
                      }
                      placeholder="예: 홍길동"
                      className={`${inputClass} ${hasIssue('photo') ? invalidFieldClass : ''}`}
                    />
                  </Field>

                  <Field
                    label="완료 연도는 언제인가요?"
                    hint="숫자만 입력해 주세요. 예: 2025"
                    error={getIssueMessage('year')}
                  >
                    <input
                      value={editor.year}
                      onChange={(event) =>
                        setEditor((prev) => ({ ...prev, year: event.target.value }))
                      }
                      placeholder="예: 2025"
                      inputMode="numeric"
                      className={`${inputClass} ${hasIssue('year') ? invalidFieldClass : ''}`}
                    />
                  </Field>

                  <Field
                    label="면적은 몇 평인가요?"
                    hint="숫자만 입력해 주세요. 예: 33"
                    error={getIssueMessage('area')}
                  >
                    <input
                      value={editor.area}
                      onChange={(event) =>
                        setEditor((prev) => ({ ...prev, area: event.target.value }))
                      }
                      placeholder="예: 33"
                      inputMode="numeric"
                      className={`${inputClass} ${hasIssue('area') ? invalidFieldClass : ''}`}
                    />
                  </Field>

                  <Field
                    label="관련 블로그 주소가 있나요?"
                    error={getIssueMessage('blogUrl')}
                  >
                    <input
                      value={editor.blogUrl}
                      onChange={(event) =>
                        setEditor((prev) => ({ ...prev, blogUrl: event.target.value }))
                      }
                      placeholder="https://blog.example.com/post"
                      className={`${inputClass} ${hasIssue('blogUrl') ? invalidFieldClass : ''}`}
                    />
                  </Field>
                </div>
              ) : null}
            </section>

            <section
              className={`rounded-2xl p-4 ${adminTheme.surface} ${
                hasIssue('images') ? 'border-[#ff6c6c]/80' : ''
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-pretendard text-[18px] font-bold text-white">
                  3. 이미지 등록 *
                </h3>
                <label
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-3 py-2 font-pretendard text-xs font-semibold text-white/80 transition ${adminTheme.accentBorderHover} ${adminTheme.accentTextHover}`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleUploadImages}
                    disabled={isUploadingImage}
                  />
                  {isUploadingImage ? '업로드 중...' : '이미지 업로드'}
                </label>
              </div>

              <p className="mt-2 font-pretendard text-xs text-white/50">
                1) 이미지를 올리고 2) 가로 대표 1장, 세로 대표 1장을 선택해 주세요.
              </p>
              <p className="mt-1 font-pretendard text-xs text-white/50">
                대표 이미지가 없으면 상세 페이지 메인 화면에 반영되지 않아요.
              </p>
              <p
                className={`mt-1 min-h-4 font-pretendard text-xs leading-4 ${
                  getExactIssueMessage('images')
                    ? adminTheme.dangerText
                    : 'text-transparent'
                }`}
              >
                {getExactIssueMessage('images') ?? '\u00A0'}
              </p>

              <div className="mt-4 space-y-4">
                <div className={`rounded-2xl p-1 ${adminTheme.cardSurface}`}>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveImageOrientation('landscape')}
                      aria-pressed={activeImageOrientation === 'landscape'}
                      className={`rounded-xl px-3 py-2 text-left transition ${
                        activeImageOrientation === 'landscape'
                          ? adminTheme.accentSoftSelection
                          : `${adminTheme.surface} hover:border-white/25`
                      }`}
                    >
                      <p className="font-pretendard text-sm font-semibold text-white">
                        가로 이미지
                      </p>
                      <p className="mt-1 font-pretendard text-[11px] text-white/60">
                        {landscapeImageEntries.length}장
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveImageOrientation('portrait')}
                      aria-pressed={activeImageOrientation === 'portrait'}
                      className={`rounded-xl px-3 py-2 text-left transition ${
                        activeImageOrientation === 'portrait'
                          ? adminTheme.accentSoftSelection
                          : `${adminTheme.surface} hover:border-white/25`
                      }`}
                    >
                      <p className="font-pretendard text-sm font-semibold text-white">
                        세로 이미지
                      </p>
                      <p className="mt-1 font-pretendard text-[11px] text-white/60">
                        {portraitImageEntries.length}장
                      </p>
                    </button>
                  </div>
                </div>

                {renderImageGroup(
                  activeImageTitle,
                  activeImageOrientation,
                  activeImageEntries,
                )}
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`inline-flex h-[52px] items-center justify-center rounded-2xl px-6 font-pretendard text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${adminTheme.primaryButton}`}
              >
                {isSaving
                  ? mode === 'create'
                    ? '등록 중...'
                    : '수정 중...'
                  : mode === 'create'
                    ? '등록하기'
                    : '수정하기'}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={mode === 'create' || isDeleting || !selectedProjectId}
                className={`inline-flex h-[52px] items-center justify-center rounded-2xl px-6 font-pretendard text-[15px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${adminTheme.dangerAction}`}
              >
                {isDeleting ? '삭제 중...' : '프로젝트 삭제'}
              </button>
            </div>
            {submitValidationMessage || isUploadingImage ? (
              <p className={`font-pretendard text-xs ${adminTheme.dangerText}`}>
                {submitStatusMessage}
              </p>
            ) : (
              <p className={`font-pretendard text-xs ${adminTheme.accentText}`}>
                {submitStatusMessage}
              </p>
            )}
          </form>
        </article>

        <article className={panelClass}>
          <h3 className="font-pretendard text-[22px] font-bold tracking-[-0.01em] text-white">
            미리보기
          </h3>
          <p className="mt-2 font-pretendard text-[14px] text-white/60">
            실제 프로젝트 상세 페이지와 동일한 구성으로 표시됩니다.
          </p>
          <div className="mt-4 inline-flex rounded-xl border border-white/15 bg-white/[0.03] p-1">
            <button
              type="button"
              onClick={() => setPreviewViewport('desktop')}
              aria-pressed={previewViewport === 'desktop'}
              className={`rounded-lg px-3 py-1.5 font-pretendard text-xs font-semibold transition ${
                previewViewport === 'desktop'
                  ? adminTheme.accentSoftSelection
                  : 'text-white/70 hover:text-white'
              }`}
            >
              데스크톱
            </button>
            <button
              type="button"
              onClick={() => setPreviewViewport('mobile')}
              aria-pressed={previewViewport === 'mobile'}
              className={`rounded-lg px-3 py-1.5 font-pretendard text-xs font-semibold transition ${
                previewViewport === 'mobile'
                  ? adminTheme.accentSoftSelection
                  : 'text-white/70 hover:text-white'
              }`}
            >
              모바일
            </button>
          </div>

          <div
            className={`mt-4 ${
              previewViewport === 'mobile'
                ? 'mx-auto w-full max-w-[430px] rounded-[28px] border border-white/15 bg-black/35 p-2'
                : ''
            }`}
          >
            <iframe
              ref={previewFrameRef}
              title={`프로젝트 상세 ${previewViewport === 'mobile' ? '모바일' : '데스크톱'} 미리보기`}
              src="/admin/projects/preview"
              onLoad={postPreviewProject}
              className={`w-full rounded-2xl ${adminTheme.previewSurface} ${
                previewViewport === 'mobile' ? 'h-[80vh]' : 'h-[85vh]'
              }`}
            />
          </div>
        </article>
      </div>
    </section>
  );
}
