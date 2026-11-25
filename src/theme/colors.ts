export const colors = {
  // Backgrounds (Palette B: Minimal & Modern)
  background: '#FFFDFC',         // Warm White Canvas
  backgroundSubtle: '#F8F6F1',   // Soft Ivory White

  // Surfaces
  surface: '#FFFFFF',            // Crisp Card Surface
  surfaceHigh: '#F0ECE5',        // Palette B: Warm Stone Surface
  surfaceElevated: '#E5DFD5',    // Minimal Warm Muted Surface
  surfaceOverlay: 'rgba(255, 253, 252, 0.95)',
  surfaceModal: '#FFFFFF',

  // Borders & Dividers
  border: '#E3DDD4',
  borderLight: '#ECE7DF',
  borderFocus: '#E98B26',

  // Accents & Brand
  accent: '#E98B26',             // Palette B: Vivid Warm Amber Orange
  accentHover: '#D47A1A',
  accentSubtle: 'rgba(233, 139, 38, 0.12)',
  secondaryAccent: '#33302C',     // Palette B: Deep Charcoal
  secondarySubtle: 'rgba(51, 48, 44, 0.08)',

  // Typography
  textPrimary: '#33302C',        // Palette B: Deep Charcoal
  textSecondary: '#6E675F',      // Warm Muted Gray
  textMuted: '#999083',
  textDisabled: '#BCB4A7',
  textInverse: '#FFFDFC',
  textAccent: '#E98B26',

  // Semantic Status
  success: '#10B981',
  successSubtle: 'rgba(16, 185, 129, 0.12)',
  warning: '#F59E0B',
  warningSubtle: 'rgba(245, 158, 11, 0.12)',
  error: '#EF4444',
  errorSubtle: 'rgba(239, 68, 68, 0.12)',
  info: '#3B82F6',
  infoSubtle: 'rgba(59, 130, 246, 0.12)',

  // Badges & Tag Highlights
  tagDrama: '#E98B26',
  tagMovie: '#5C5449',
  tagGV: '#E98B26',
  tagStageGreeting: '#D97706',
  tagFestival: '#B45309',
  tagPopUp: '#78716C',

  // Overlays
  scrim: 'rgba(51, 48, 44, 0.45)',
  scrimDark: 'rgba(51, 48, 44, 0.75)',
} as const;

export type Colors = typeof colors;
