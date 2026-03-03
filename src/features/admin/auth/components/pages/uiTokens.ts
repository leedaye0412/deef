export const adminAuthUi = {
  main: 'relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#1c1c1c_0%,#121212_42%,#000000_100%)] px-layout-x-mobile pt-24 pb-14 md:px-layout-x-desktop',
  backdrop: 'hidden',
  blurTop:
    'absolute -top-24 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-white/80 blur-3xl',
  blurLeft: 'absolute -left-28 bottom-8 h-56 w-56 rounded-full bg-black/5 blur-3xl',
  blurRight:
    'absolute -right-20 bottom-[-88px] h-72 w-72 rounded-full bg-black/8 blur-3xl',
  shell: 'mx-auto flex min-h-[70vh] w-full max-w-md items-center',
  card: 'w-full rounded-[28px] border border-white/10 bg-[#121212] px-6 py-7 shadow-[0_20px_50px_rgba(0,0,0,0.45)] md:px-8 md:py-8',
  title:
    'mt-5 font-pretendard text-[32px] leading-[1.2] font-bold tracking-[-0.02em] text-white',
  description: 'mt-3 font-pretendard text-[17px] font-medium text-white/70',
  label: 'font-pretendard text-[14px] font-semibold text-white/75',
  input:
    'h-[52px] w-full rounded-2xl border border-white/15 bg-[#181818] px-4 text-[16px] font-medium text-white placeholder:text-white/35 transition focus:border-[#ff4d5e] focus:bg-[#181818] focus:outline-none focus:ring-4 focus:ring-[#ff4d5e]/20',
  notice: 'mt-5 rounded-[20px] border px-4 py-3',
  noticeText: 'font-pretendard text-[15px] font-medium',
  submitButton:
    'h-[56px] w-full cursor-pointer rounded-2xl bg-[#ff4d5e] text-[17px] font-semibold text-white shadow-[0_14px_28px_rgba(255,77,94,0.3)] hover:bg-[#ff6473]',
  divider: 'mt-7 border-t border-white/10 pt-5',
  link: 'font-pretendard text-[15px] font-semibold text-[#ff5c6b] transition-colors hover:text-[#ff7b87]',
} as const;

export const adminAuthNoticeTone = {
  neutral: {
    box: 'border-white/15 bg-white/[0.04]',
    text: 'text-white/75',
  },
  error: {
    box: 'border-[#ff4d5e]/45 bg-[#ff4d5e]/16',
    text: 'text-[#ffe1e4]',
  },
  success: {
    box: 'border-[#ff6b7a]/45 bg-[#ff6b7a]/12',
    text: 'text-[#ffd5da]',
  },
} as const;
