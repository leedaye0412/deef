import type { Session } from '@supabase/supabase-js';

import { supabaseBrowser } from '@lib/supabase/client';

// 브라우저에서 사용하는 Supabase Auth 클라이언트 타입
export type AuthClient = ReturnType<typeof supabaseBrowser>;

// 브라우저용 Auth 클라이언트 생성
export const createAuthClient = (): AuthClient => supabaseBrowser();

// 현재 로그인 세션 조회
export async function getSession(client: AuthClient) {
  return client.auth.getSession();
}

// Auth 상태 변경(로그인/로그아웃/토큰갱신) 구독 등록
export function subscribeAuthSession(
  client: AuthClient,
  onChange: (session: Session | null) => void,
) {
  const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
    onChange(nextSession);
  });
  return data.subscription;
}

// 이메일/비밀번호로 로그인
export async function signInWithPassword(
  client: AuthClient,
  email: string,
  password: string,
) {
  return client.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
}

// 현재 세션 로그아웃
export async function signOut(client: AuthClient) {
  return client.auth.signOut();
}

// 비밀번호 재설정 메일 발송
export async function sendRecoveryEmail(
  client: AuthClient,
  email: string,
  redirectTo: string,
) {
  return client.auth.resetPasswordForEmail(email.trim(), {
    redirectTo,
  });
}

// 콜백 URL의 access/refresh 토큰으로 세션 복원
export async function setSessionFromTokens(
  client: AuthClient,
  accessToken: string,
  refreshToken: string,
) {
  return client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
}

// 로그인 사용자 비밀번호 변경
export async function updatePassword(client: AuthClient, password: string) {
  return client.auth.updateUser({ password });
}
