import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminProjectsDashboardPage from '@features/admin/projects/components/pages/AdminProjectsDashboardPage';
import { adminTheme } from '@features/admin/shared/styles/adminTheme';
import { supabaseServer } from '@lib/supabase/server';
import { Button } from '@shared/components/ui/button';

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

  return (
    <main
      className={`relative min-h-screen overflow-hidden px-layout-x-mobile pt-24 pb-14 md:px-layout-x-desktop ${adminTheme.pageBackground}`}
    >
      <div className="mx-auto w-full max-w-7xl">
        <section
          className={`rounded-[28px] px-6 py-7 md:px-8 md:py-8 ${adminTheme.card}`}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="rounded-full border border-white/20 px-3 py-1 font-pretendard text-xs font-semibold text-white/70">
                로그인: {data.user.email ?? 'unknown'}
              </span>
              <h1 className="mt-3 font-pretendard text-[34px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                프로젝트 관리 페이지
              </h1>
              <p className="mt-3 font-pretendard text-[16px] font-medium text-white/70">
                프로젝트 게시, 수정, 삭제가 가능합니다.
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
                  className={`h-10 cursor-pointer rounded-full px-4 font-semibold ${adminTheme.primaryButton}`}
                >
                  로그아웃
                </Button>
              </form>
            </div>
          </div>
        </section>

        <AdminProjectsDashboardPage />
      </div>
    </main>
  );
}
