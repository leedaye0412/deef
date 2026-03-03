'use client';

import type { AuthError, Session } from '@supabase/supabase-js';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { type Notice, LoginFormSchema, RecoveryFormSchema } from '../model/schemas';

import {
  createAuthClient,
  getSession,
  sendRecoveryEmail,
  signInWithPassword,
  signOut,
  subscribeAuthSession,
  type AuthClient,
} from './client';

type UseAuthSessionResult = {
  client: AuthClient;
  session: Session | null;
  sessionLoading: boolean;
  sessionError: string | null;
};

type UseAdminLoginActionsResult = {
  notice: Notice;
  clearNotice: () => void;
  loginEmail: string;
  loginPassword: string;
  setLoginEmail: (value: string) => void;
  setLoginPassword: (value: string) => void;
  isSigningIn: boolean;
  isSigningOut: boolean;
  handleSignIn: (e: FormEvent<HTMLFormElement>) => Promise<boolean>;
  handleSignOut: () => Promise<void>;
};

type UseAdminRecoveryActionsResult = {
  notice: Notice;
  clearNotice: () => void;
  recoverEmail: string;
  setRecoverEmail: (value: string) => void;
  isSendingRecoveryEmail: boolean;
  isRecoveryLocked: boolean;
  recoverWaitTimeText: string;
  handleSendRecoveryEmail: (e: FormEvent<HTMLFormElement>) => Promise<void>;
};

const DEFAULT_EMAIL_RATE_LIMIT_RETRY_SECONDS = 60;

function extractRetryAfterSecondsFromMessage(message: string): number | null {
  const secondMatch = message.match(/(\d+)\s*(?:s|sec|secs|second|seconds|초)/i);
  if (secondMatch) {
    return Number(secondMatch[1]);
  }

  const minuteMatch = message.match(/(\d+)\s*(?:m|min|mins|minute|minutes|분)/i);
  if (minuteMatch) {
    return Number(minuteMatch[1]) * 60;
  }

  return null;
}

function getEmailRateLimitRetrySeconds(error: AuthError): number | null {
  const isRateLimitError =
    error.status === 429 || /rate limit exceeded|too many requests/i.test(error.message);

  if (!isRateLimitError) return null;

  return (
    extractRetryAfterSecondsFromMessage(error.message) ??
    DEFAULT_EMAIL_RATE_LIMIT_RETRY_SECONDS
  );
}

function formatWaitTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}초`;
  return `${mins}분 ${secs}초`;
}

function getLocalizedLoginErrorMessage(error: AuthError): string {
  const isInvalidCredentials =
    error.code === 'invalid_credentials' ||
    /invalid login credentials/i.test(error.message);

  if (isInvalidCredentials) {
    return '이메일 또는 비밀번호가 올바르지 않습니다.';
  }

  return error.message;
}

// 공통 세션 조회 + 상태 변경 구독 훅
export function useAuthSession(): UseAuthSessionResult {
  const client = useMemo(() => createAuthClient(), []);

  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    void getSession(client)
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          setSessionError(error.message);
        }
        setSession(data.session ?? null);
      })
      .finally(() => {
        if (mounted) setSessionLoading(false);
      });

    const subscription = subscribeAuthSession(client, (nextSession) => {
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [client]);

  return { client, session, sessionLoading, sessionError };
}

// 로그인/로그아웃 액션과 관련 상태를 묶은 훅
export function useAdminLoginActions(client: AuthClient): UseAdminLoginActionsResult {
  const [notice, setNotice] = useState<Notice>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const clearNotice = () => setNotice(null);

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearNotice();

    const parsed = LoginFormSchema.safeParse({
      email: loginEmail,
      password: loginPassword,
    });

    if (!parsed.success) {
      setNotice({
        type: 'error',
        text: '로그인 이메일/비밀번호를 올바르게 입력해 주세요.',
      });
      return false;
    }

    setIsSigningIn(true);
    const { error } = await signInWithPassword(
      client,
      parsed.data.email,
      parsed.data.password,
    );
    setIsSigningIn(false);

    if (error) {
      setNotice({ type: 'error', text: getLocalizedLoginErrorMessage(error) });
      return false;
    }

    setLoginPassword('');
    setNotice({ type: 'success', text: '로그인되었습니다.' });
    return true;
  };

  const handleSignOut = async () => {
    clearNotice();
    setIsSigningOut(true);

    const { error } = await signOut(client);
    setIsSigningOut(false);

    if (error) {
      setNotice({ type: 'error', text: error.message });
      return;
    }

    setNotice({ type: 'success', text: '로그아웃되었습니다.' });
  };

  return {
    notice,
    clearNotice,
    loginEmail,
    loginPassword,
    setLoginEmail,
    setLoginPassword,
    isSigningIn,
    isSigningOut,
    handleSignIn,
    handleSignOut,
  };
}

// 비밀번호찾기 액션과 관련 상태를 묶은 훅
export function useAdminRecoveryActions(
  client: AuthClient,
): UseAdminRecoveryActionsResult {
  const [notice, setNotice] = useState<Notice>(null);
  const [recoverEmail, setRecoverEmail] = useState('');
  const [isSendingRecoveryEmail, setIsSendingRecoveryEmail] = useState(false);
  const [recoverRetryAfterSeconds, setRecoverRetryAfterSeconds] = useState(0);
  const isRecoveryLocked = recoverRetryAfterSeconds > 0;
  const recoverWaitTimeText = formatWaitTime(recoverRetryAfterSeconds);

  const clearNotice = () => setNotice(null);

  const handleSendRecoveryEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearNotice();

    if (recoverRetryAfterSeconds > 0) {
      setNotice({
        type: 'error',
        text: `이메일 전송 요청 허용 횟수를 초과했습니다. ${formatWaitTime(
          recoverRetryAfterSeconds,
        )} 후 다시 시도해 주세요.`,
      });
      return;
    }

    const parsed = RecoveryFormSchema.safeParse({ email: recoverEmail });

    if (!parsed.success) {
      setNotice({
        type: 'error',
        text: '비밀번호 재설정 메일을 받을 올바른 이메일을 입력해 주세요.',
      });
      return;
    }

    setIsSendingRecoveryEmail(true);
    const nextPath = encodeURIComponent('/admin/reset-password');
    const { error } = await sendRecoveryEmail(
      client,
      parsed.data.email,
      `${window.location.origin}/auth/callback?next=${nextPath}`,
    );
    setIsSendingRecoveryEmail(false);

    if (error) {
      const retrySeconds = getEmailRateLimitRetrySeconds(error);

      if (retrySeconds) {
        setRecoverRetryAfterSeconds(retrySeconds);
        setNotice({
          type: 'error',
          text: `이메일 전송 요청 허용 횟수를 초과했습니다. ${formatWaitTime(
            retrySeconds,
          )} 후 다시 시도해 주세요.`,
        });
        return;
      }

      setNotice({ type: 'error', text: error.message });
      return;
    }

    setRecoverRetryAfterSeconds(DEFAULT_EMAIL_RATE_LIMIT_RETRY_SECONDS);
    setNotice({
      type: 'success',
      text: '비밀번호 재설정 메일을 보냈습니다. 메일의 링크를 눌러 새 비밀번호를 설정해 주세요.',
    });
  };

  // 재전송 제한 카운트다운
  useEffect(() => {
    if (recoverRetryAfterSeconds <= 0) return;
    const timer = window.setTimeout(() => {
      setRecoverRetryAfterSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [recoverRetryAfterSeconds]);

  return {
    notice,
    clearNotice,
    recoverEmail,
    setRecoverEmail,
    isSendingRecoveryEmail,
    isRecoveryLocked,
    recoverWaitTimeText,
    handleSendRecoveryEmail,
  };
}
