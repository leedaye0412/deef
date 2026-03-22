export const adminTheme = {
  pageBackground:
    'bg-[radial-gradient(circle_at_top,#181818_0%,#121212_44%,#000000_100%)]',
  card: 'border border-white/10 bg-[#121212] shadow-[0_20px_50px_rgba(0,0,0,0.45)]',
  panel: 'border border-white/10 bg-[#121212] shadow-[0_16px_36px_rgba(0,0,0,0.35)]',
  cardSurface: 'border border-white/10 bg-[#121212]',
  surface: 'border border-white/10 bg-[#181818]',
  previewSurface: 'border border-white/10 bg-[#101010]',
  inputSurface: 'border border-white/15 bg-[#181818]',
  input:
    'border border-white/15 bg-[#181818] text-white placeholder:text-white/35 focus:border-[#1ED760] focus:outline-none focus:ring-4 focus:ring-[#1ED760]/25',
  accentSolid: 'bg-[#1DB954]',
  accentBorderHover: 'hover:border-[#1ED760]/60',
  accentTextHover: 'hover:text-[#d5ffe4]',
  topGlow: 'bg-[#1ED760]/14',
  primaryButton: 'bg-[#1DB954] text-black transition hover:bg-[#1ED760]',
  primaryLink: 'text-[#1ED760] transition-colors hover:text-[#6dffab]',
  accentText: 'text-[#1ED760]',
  accentSoft: 'border border-[#1ED760]/45 bg-[#1ED760]/15 text-[#b8ffd1]',
  accentSoftStrong: 'border border-[#1ED760]/60 bg-[#1ED760]/15 text-[#b8ffd1]',
  accentSoftSelection: 'border border-[#1ED760]/70 bg-[#1ED760]/10',
  dangerText: 'text-[#ffb7b7]',
  dangerAction: 'border border-[#ff6666]/45 text-[#ffd0d0] hover:bg-[#ff6666]/18',
  dangerBadge: 'border border-[#ff6666]/50 text-[#ffc8c8] hover:bg-[#ff6666]/18',
} as const;

export const adminNoticeTone = {
  neutral: {
    box: 'border-white/15 bg-white/[0.04]',
    text: 'text-white/75',
  },
  error: {
    box: 'border-[#ff6c6c]/45 bg-[#ff6c6c]/12',
    text: 'text-[#ffd5d5]',
  },
  success: {
    box: 'border-[#1ED760]/45 bg-[#1ED760]/14',
    text: 'text-[#bfffd7]',
  },
} as const;
