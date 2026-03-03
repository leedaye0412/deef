'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@shared/components/ui/button';

import { updatePassword } from '@/features/admin/auth/api/client';
import { useAuthSession } from '@/features/admin/auth/api/hooks';
import {
  adminAuthNoticeTone,
  adminAuthUi,
} from '@/features/admin/auth/components/pages/uiTokens';
import {
  type Notice,
  ResetPasswordFormSchema,
} from '@/features/admin/auth/model/schemas';

export default function ResetPasswordPageClient() {
  const { client: supabase, session, sessionLoading, sessionError } = useAuthSession();
  const [notice, setNotice] = useState<Notice>(null);

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const effectiveNotice: Notice =
    notice ?? (sessionError ? { type: 'error', text: sessionError } : null);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotice(null);

    if (!session) {
      setNotice({
        type: 'error',
        text: '재설정 세션이 없습니다. 비밀번호 찾기 메일의 링크로 다시 접속해 주세요.',
      });
      return;
    }

    const parsed = ResetPasswordFormSchema.safeParse({
      password: newPassword,
      confirmPassword: newPasswordConfirm,
    });

    if (!parsed.success) {
      setNotice({
        type: 'error',
        text: parsed.error.issues[0]?.message ?? '새 비밀번호 입력 값을 확인해 주세요.',
      });
      return;
    }

    setIsUpdatingPassword(true);
    const { error } = await updatePassword(supabase, parsed.data.password);
    setIsUpdatingPassword(false);

    if (error) {
      setNotice({ type: 'error', text: error.message });
      return;
    }

    setNewPassword('');
    setNewPasswordConfirm('');
    setNotice({
      type: 'success',
      text: '비밀번호가 변경되었습니다. 다시 로그인해 주세요.',
    });
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
          <h1 className={adminAuthUi.title}>비밀번호 재설정</h1>
          <p className={adminAuthUi.description}>
            메일 링크로 접속했다면 새 비밀번호를 설정할 수 있습니다.
          </p>

          {sessionLoading ? (
            <div className={`${adminAuthUi.notice} ${adminAuthNoticeTone.neutral.box}`}>
              <p
                className={`${adminAuthUi.noticeText} ${adminAuthNoticeTone.neutral.text}`}
              >
                세션 확인 중...
              </p>
            </div>
          ) : session ? (
            <div className={`${adminAuthUi.notice} ${adminAuthNoticeTone.success.box}`}>
              <p
                className={`${adminAuthUi.noticeText} ${adminAuthNoticeTone.success.text}`}
              >
                인증됨: {session.user.email}
              </p>
            </div>
          ) : (
            <div className={`${adminAuthUi.notice} ${adminAuthNoticeTone.error.box}`}>
              <p
                className={`${adminAuthUi.noticeText} ${adminAuthNoticeTone.error.text}`}
              >
                재설정 링크 세션을 찾지 못했습니다.
              </p>
            </div>
          )}

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

          <form className="mt-7 space-y-5" onSubmit={handleResetPassword}>
            <label className="block space-y-2">
              <span className={adminAuthUi.label}>새 비밀번호</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8자 이상 입력"
                autoComplete="new-password"
                className={adminAuthUi.input}
                minLength={8}
                required
              />
            </label>

            <label className="block space-y-2">
              <span className={adminAuthUi.label}>새 비밀번호 확인</span>
              <input
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                placeholder="비밀번호 다시 입력"
                autoComplete="new-password"
                className={adminAuthUi.input}
                minLength={8}
                required
              />
            </label>

            <Button
              type="submit"
              disabled={sessionLoading || !session || isUpdatingPassword}
              className={adminAuthUi.submitButton}
            >
              {isUpdatingPassword ? '변경 중...' : '새 비밀번호 저장'}
            </Button>
          </form>

          <div className={adminAuthUi.divider}>
            <Link href="/admin/login" className={adminAuthUi.link}>
              로그인 화면으로
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
