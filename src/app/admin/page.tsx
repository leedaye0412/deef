import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { supabaseServer } from '@lib/supabase/server';
import { Button } from '@shared/components/ui/button';

import {
  adminAuthNoticeTone,
  adminAuthUi,
} from '@/features/admin/auth/components/pages/uiTokens';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const sb = await supabaseServer();
  const { data, error } = await sb.auth.getUser();

  if (error || !data.user) {
    redirect('/admin/login');
  }

  const handleSignOut = async () => {
    'use server';

    const signOutClient = await supabaseServer();
    await signOutClient.auth.signOut();
    redirect('/admin/login');
  };

  const projectSummary = [
    { label: '전체 프로젝트', value: '12', description: '최근 30일 기준' },
    { label: '진행 중', value: '5', description: '현재 활성 작업' },
    { label: '검수 대기', value: '3', description: '리뷰 필요' },
    { label: '완료', value: '4', description: '이번 분기 누적' },
  ] as const;

  const projectQueue = [
    {
      name: '브랜드 리뉴얼 랜딩',
      owner: '디자인팀',
      status: '진행 중',
      updatedAt: '2시간 전',
    },
    {
      name: '모바일 온보딩 개선',
      owner: '프로덕트팀',
      status: '검수 대기',
      updatedAt: '오늘',
    },
    { name: '결제 플로우 개편', owner: '개발팀', status: '진행 중', updatedAt: '어제' },
    {
      name: 'CMS 권한 구조 정리',
      owner: '운영팀',
      status: '백로그',
      updatedAt: '3일 전',
    },
  ] as const;

  return (
    <main className={adminAuthUi.main}>
      <div className="mx-auto w-full max-w-7xl">
        <section className="rounded-[28px] border border-white/10 bg-[#121212] px-6 py-7 shadow-[0_20px_50px_rgba(0,0,0,0.45)] md:px-8 md:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-pretendard text-[13px] font-semibold tracking-[0.08em] text-white/50">
                ADMIN DASHBOARD
              </p>
              <h1 className="mt-3 font-pretendard text-[34px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                프로젝트 관리 대시보드
              </h1>
              <p className="mt-3 font-pretendard text-[16px] font-medium text-white/70">
                프로젝트 진행 현황과 운영 상태를 한 화면에서 관리합니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/reset-password"
                className="inline-flex h-10 items-center rounded-full border border-white/20 px-4 font-pretendard text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white"
              >
                비밀번호 변경
              </Link>
              <form action={handleSignOut}>
                <Button
                  type="submit"
                  className="h-10 cursor-pointer rounded-full bg-[#ff4d5e] px-4 font-semibold text-white hover:bg-[#ff6473]"
                >
                  로그아웃
                </Button>
              </form>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {projectSummary.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-white/10 bg-[#161616] px-5 py-4"
            >
              <p className="font-pretendard text-[13px] font-semibold text-white/60">
                {item.label}
              </p>
              <p className="mt-2 font-pretendard text-[30px] font-bold tracking-[-0.02em] text-white">
                {item.value}
              </p>
              <p className="mt-1 font-pretendard text-[13px] text-white/55">
                {item.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.8fr_1fr]">
          <article className="rounded-[24px] border border-white/10 bg-[#121212] p-6 md:p-7">
            <div className="flex items-center justify-between">
              <h2 className="font-pretendard text-[22px] font-bold tracking-[-0.01em] text-white">
                프로젝트 리스트
              </h2>
              <span className="rounded-full border border-white/15 px-3 py-1 font-pretendard text-[12px] font-semibold text-white/70">
                관리 예정
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full border-collapse">
                <thead className="bg-white/[0.04]">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-pretendard text-xs font-semibold text-white/60">
                      프로젝트
                    </th>
                    <th className="px-4 py-3 font-pretendard text-xs font-semibold text-white/60">
                      담당
                    </th>
                    <th className="px-4 py-3 font-pretendard text-xs font-semibold text-white/60">
                      상태
                    </th>
                    <th className="px-4 py-3 font-pretendard text-xs font-semibold text-white/60">
                      업데이트
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projectQueue.map((project) => (
                    <tr key={project.name} className="border-t border-white/10">
                      <td className="px-4 py-3 font-pretendard text-sm font-medium text-white">
                        {project.name}
                      </td>
                      <td className="px-4 py-3 font-pretendard text-sm text-white/75">
                        {project.owner}
                      </td>
                      <td className="px-4 py-3 font-pretendard text-sm text-[#ff5c6b]">
                        {project.status}
                      </td>
                      <td className="px-4 py-3 font-pretendard text-sm text-white/65">
                        {project.updatedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <div className="space-y-6">
            <article className="rounded-2xl border border-white/10 bg-[#121212] p-5">
              <h2 className="font-pretendard text-lg font-bold text-white">
                로그인 상태
              </h2>
              <div className={`${adminAuthUi.notice} ${adminAuthNoticeTone.success.box}`}>
                <p
                  className={`${adminAuthUi.noticeText} ${adminAuthNoticeTone.success.text}`}
                >
                  로그인됨
                </p>
                <p
                  className={`mt-1 ${adminAuthUi.noticeText} ${adminAuthNoticeTone.neutral.text}`}
                >
                  {data.user.email ?? 'unknown'}
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-[#121212] p-5">
              <h2 className="font-pretendard text-lg font-bold text-white">운영 메모</h2>
              <ul className="mt-4 space-y-3 font-pretendard text-sm text-white/75">
                <li>새 프로젝트 등록 폼 추가 예정</li>
                <li>상태 변경 워크플로우 연결 예정</li>
                <li>담당자/권한 설정 기능 확장 예정</li>
              </ul>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
