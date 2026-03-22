import { adminNoticeTone, adminTheme } from '@/features/admin/shared/styles/adminTheme';

export const adminAuthUi = {
  main: `relative min-h-screen overflow-hidden ${adminTheme.pageBackground} px-layout-x-mobile pt-24 pb-14 md:px-layout-x-desktop`,
  backdrop: 'hidden',
  blurTop: `absolute -top-24 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full blur-3xl ${adminTheme.topGlow}`,
  blurLeft: 'absolute -left-28 bottom-8 h-56 w-56 rounded-full bg-black/5 blur-3xl',
  blurRight:
    'absolute -right-20 bottom-[-88px] h-72 w-72 rounded-full bg-black/8 blur-3xl',
  shell: 'mx-auto flex min-h-[70vh] w-full max-w-md items-center',
  card: `w-full rounded-[28px] ${adminTheme.card} px-6 py-7 md:px-8 md:py-8`,
  title:
    'mt-5 font-pretendard text-[32px] leading-[1.2] font-bold tracking-[-0.02em] text-white',
  description: 'mt-3 font-pretendard text-[17px] font-medium text-white/70',
  label: 'font-pretendard text-[14px] font-semibold text-white/75',
  input: `h-[52px] w-full rounded-2xl px-4 text-[16px] font-medium transition ${adminTheme.input}`,
  notice: 'mt-5 rounded-[20px] border px-4 py-3',
  noticeText: 'font-pretendard text-[15px] font-medium',
  submitButton: `h-[56px] w-full cursor-pointer rounded-2xl text-[17px] font-semibold shadow-[0_14px_28px_rgba(29,185,84,0.28)] ${adminTheme.primaryButton}`,
  divider: 'mt-7 border-t border-white/10 pt-5',
  link: `font-pretendard text-[15px] font-semibold ${adminTheme.primaryLink}`,
} as const;

export const adminAuthNoticeTone = adminNoticeTone;
