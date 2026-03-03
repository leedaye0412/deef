'use client';

import Link from 'next/link';

import { Button } from '@shared/components/ui/button';

import { useAdminRecoveryActions, useAuthSession } from '@/features/admin/auth/api/hooks';
import {
  adminAuthNoticeTone,
  adminAuthUi,
} from '@/features/admin/auth/components/pages/uiTokens';
import type { Notice } from '@/features/admin/auth/model/schemas';

export default function AdminForgotPasswordPageClient() {
  const { client: supabase, sessionError } = useAuthSession();
  const {
    notice,
    recoverEmail,
    setRecoverEmail,
    isSendingRecoveryEmail,
    isRecoveryLocked,
    recoverWaitTimeText,
    handleSendRecoveryEmail,
  } = useAdminRecoveryActions(supabase);

  const effectiveNotice: Notice =
    notice ?? (sessionError ? { type: 'error', text: sessionError } : null);

  return (
    <main className={adminAuthUi.main}>
      <div aria-hidden className={adminAuthUi.backdrop}>
        <div className={adminAuthUi.blurTop} />
        <div className={adminAuthUi.blurLeft} />
        <div className={adminAuthUi.blurRight} />
      </div>

      <div className={adminAuthUi.shell}>
        <section className={adminAuthUi.card}>
          <h1 className={adminAuthUi.title}>비밀번호 찾기</h1>
          <p className={adminAuthUi.description}>
            가입한 이메일로 비밀번호 재설정 링크를 보냅니다.
          </p>

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

          <form className="mt-7 space-y-5" onSubmit={handleSendRecoveryEmail}>
            <label className="block space-y-2">
              <span className={adminAuthUi.label}>가입한 이메일</span>
              <input
                type="email"
                value={recoverEmail}
                onChange={(e) => setRecoverEmail(e.target.value)}
                placeholder="admin@company.com"
                autoComplete="email"
                className={adminAuthUi.input}
                required
              />
            </label>

            <Button
              type="submit"
              disabled={isSendingRecoveryEmail || isRecoveryLocked}
              className={adminAuthUi.submitButton}
            >
              {isSendingRecoveryEmail
                ? '메일 발송 중...'
                : isRecoveryLocked
                  ? `다시 시도까지 ${recoverWaitTimeText}`
                  : '비밀번호 재설정 메일 보내기'}
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
