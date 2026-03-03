'use client';

import Link from 'next/link';

import { Button } from '@shared/components/ui/button';

import { useAdminLoginActions, useAuthSession } from '@/features/admin/auth/api/hooks';
import {
  adminAuthNoticeTone,
  adminAuthUi,
} from '@/features/admin/auth/components/pages/uiTokens';
import type { Notice } from '@/features/admin/auth/model/schemas';

export default function AdminLoginPageClient() {
  const { client: supabase, sessionError } = useAuthSession();
  const {
    notice,
    loginEmail,
    loginPassword,
    setLoginEmail,
    setLoginPassword,
    isSigningIn,
    handleSignIn,
  } = useAdminLoginActions(supabase);

  const effectiveNotice: Notice =
    notice ?? (sessionError ? { type: 'error', text: sessionError } : null);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const isSuccess = await handleSignIn(e);
    if (!isSuccess) return;
    window.location.assign('/admin');
  };

  return (
    <main className={adminAuthUi.main}>
      <div aria-hidden className={adminAuthUi.backdrop}>
        <div className={adminAuthUi.blurTop} />
        <div className={adminAuthUi.blurLeft} />
        <div className={adminAuthUi.blurRight} />
      </div>

      <div className={adminAuthUi.shell}>
        <section className={adminAuthUi.card}>
          <h1 className={adminAuthUi.title}>관리자 로그인</h1>
          <p className={adminAuthUi.description}>관리자만 로그인할 수 있습니다.</p>

          {effectiveNotice && (
            <div
              className={`${adminAuthUi.notice} ${
                effectiveNotice.type === 'error'
                  ? adminAuthNoticeTone.error.box
                  : adminAuthNoticeTone.success.box
              }`}
            >
              <p
                className={`${adminAuthUi.noticeText} ${effectiveNotice.type === 'error' ? adminAuthNoticeTone.error.text : adminAuthNoticeTone.success.text}`}
              >
                {effectiveNotice.text}
              </p>
            </div>
          )}

          <form className="mt-7 space-y-5" onSubmit={handleLoginSubmit}>
            <label className="block space-y-2">
              <span className={adminAuthUi.label}>이메일</span>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@company.com"
                autoComplete="email"
                className={adminAuthUi.input}
                required
              />
            </label>

            <label className="block space-y-2">
              <span className={adminAuthUi.label}>비밀번호</span>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="비밀번호 입력"
                autoComplete="current-password"
                className={adminAuthUi.input}
                required
              />
            </label>

            <Button
              type="submit"
              disabled={isSigningIn}
              className={adminAuthUi.submitButton}
            >
              {isSigningIn ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <div className={adminAuthUi.divider}>
            <Link href="/admin/forgot-password" className={adminAuthUi.link}>
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
