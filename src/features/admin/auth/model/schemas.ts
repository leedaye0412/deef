import { z } from 'zod';

export const AuthContextSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email().nullable(),
});

export const LoginFormSchema = z.object({
  email: z.string().trim().email('유효한 이메일 주소를 입력해 주세요.'),
  password: z.string().min(1, '비밀번호를 입력해 주세요.'),
});

export const RecoveryFormSchema = z.object({
  email: z.string().trim().email('유효한 이메일 주소를 입력해 주세요.'),
});

export const ResetPasswordFormSchema = z
  .object({
    password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
    confirmPassword: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호 확인 값이 일치하지 않습니다.',
  });

export type AuthContext = z.infer<typeof AuthContextSchema>;

export type AuthMode = 'login' | 'recover';

export type Notice = {
  type: 'success' | 'error';
  text: string;
} | null;

export type CallbackState = {
  status: 'loading' | 'error';
  message: string;
};

export function getSafeNextPath(nextPath: string | null): string | null {
  if (!nextPath) return null;
  if (!nextPath.startsWith('/')) return null;
  if (nextPath.startsWith('//')) return null;
  return nextPath;
}

export function defaultTargetByType(type: string | null): string {
  if (type === 'invite' || type === 'recovery') return '/admin/reset-password';
  return '/admin';
}
