'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import {
  createAuthClient,
  getSession,
  setSessionFromTokens,
} from '@/features/admin/auth/api/client';
import {
  adminAuthNoticeTone,
  adminAuthUi,
} from '@/features/admin/auth/components/pages/uiTokens';
import {
  type CallbackState,
  defaultTargetByType,
  getSafeNextPath,
} from '@/features/admin/auth/model/schemas';

export default function AuthCallbackPageClient() {
  const supabase = useMemo(() => createAuthClient(), []);
  const router = useRouter();

  const [state, setState] = useState<CallbackState>({
    status: 'loading',
    message: '인증 정보를 확인하는 중입니다...',
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const url = new URL(window.location.href);
      const query = url.searchParams;
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));

      const nextPath = getSafeNextPath(query.get('next'));
      const type = hash.get('type') ?? query.get('type');

      const hashError = hash.get('error') ?? hash.get('error_code');
      const hashErrorDescription =
        hash.get('error_description') ?? query.get('error_description');

      if (hashError || hashErrorDescription) {
        if (cancelled) return;
        setState({
          status: 'error',
          message: hashErrorDescription ?? '인증 링크가 유효하지 않거나 만료되었습니다.',
        });
        return;
      }

      const accessToken = hash.get('access_token');
      const refreshToken = hash.get('refresh_token');

      if (accessToken && refreshToken) {
        const { error } = await setSessionFromTokens(supabase, accessToken, refreshToken);

        if (error) {
          if (cancelled) return;
          setState({
            status: 'error',
            message: error.message,
          });
          return;
        }
      } else {
        const { data } = await getSession(supabase);
        if (!data.session) {
          if (cancelled) return;
          setState({
            status: 'error',
            message: '인증 세션을 찾지 못했습니다. 초대 메일 링크를 다시 열어 주세요.',
          });
          return;
        }
      }

      const target = nextPath ?? defaultTargetByType(type);
      router.replace(target);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  return (
    <main className={adminAuthUi.main}>
      <div aria-hidden className={adminAuthUi.backdrop}>
        <div className={adminAuthUi.blurTop} />
        <div className={adminAuthUi.blurLeft} />
        <div className={adminAuthUi.blurRight} />
      </div>

      <div className={adminAuthUi.shell}>
        <section className={adminAuthUi.card}>
          <h1 className={adminAuthUi.title}>인증 처리</h1>
          <div
            className={`${adminAuthUi.notice} ${
              state.status === 'error'
                ? adminAuthNoticeTone.error.box
                : adminAuthNoticeTone.neutral.box
            }`}
          >
            <p
              className={`${adminAuthUi.noticeText} ${
                state.status === 'error'
                  ? adminAuthNoticeTone.error.text
                  : adminAuthNoticeTone.neutral.text
              }`}
            >
              {state.message}
            </p>
          </div>

          {state.status === 'error' && (
            <div className={adminAuthUi.divider}>
              <Link href="/admin/login" className={adminAuthUi.link}>
                관리자 로그인으로 이동
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
