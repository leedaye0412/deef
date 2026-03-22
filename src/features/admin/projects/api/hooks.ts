'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createAdminProject,
  deleteAdminProject,
  getAdminProject,
  getAdminProjects,
  updateAdminProject,
  type AdminProjectUpsertInput,
} from './client';

export const adminProjectQueryKeys = {
  projects: ['admin-projects'] as const,
  project: (projectId: number) => ['admin-projects', projectId] as const,
};

export function useAdminProjects() {
  return useQuery({
    queryKey: adminProjectQueryKeys.projects,
    queryFn: getAdminProjects,
  });
}

export function useAdminProject(projectId: number | null) {
  return useQuery({
    queryKey: adminProjectQueryKeys.project(projectId ?? 0),
    queryFn: () => getAdminProject(projectId as number),
    enabled: typeof projectId === 'number',
  });
}

export function useCreateAdminProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminProjectUpsertInput) => createAdminProject(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminProjectQueryKeys.projects });
    },
  });
}

export function useUpdateAdminProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      input,
    }: {
      projectId: number;
      input: AdminProjectUpsertInput;
    }) => updateAdminProject(projectId, input),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminProjectQueryKeys.projects }),
        queryClient.invalidateQueries({
          queryKey: adminProjectQueryKeys.project(variables.projectId),
        }),
      ]);
    },
  });
}

export function useDeleteAdminProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: number) => deleteAdminProject(projectId),
    onSuccess: async (_data, projectId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminProjectQueryKeys.projects }),
        queryClient.invalidateQueries({
          queryKey: adminProjectQueryKeys.project(projectId),
        }),
      ]);
    },
  });
}
