import { Platform } from 'react-native';

export const Colors = {
  // Base
  bg: '#080B14',
  bgSecondary: '#0F1320',

  // Glass surfaces
  glass: 'rgba(255, 255, 255, 0.07)',
  glassMedium: 'rgba(255, 255, 255, 0.11)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassBorderStrong: 'rgba(255, 255, 255, 0.22)',
  glassHighlight: 'rgba(255, 255, 255, 0.25)',

  // Primary — indigo suave
  primary: '#7B6CF8',
  primaryDark: '#5B4FE0',
  primaryLight: 'rgba(123, 108, 248, 0.15)',
  primaryGlow: 'rgba(123, 108, 248, 0.25)',

  // Status
  danger: '#F87171',
  dangerLight: 'rgba(248, 113, 113, 0.15)',
  success: '#34D399',
  successLight: 'rgba(52, 211, 153, 0.15)',

  // Text
  text: '#FFFFFF',
  textSub: 'rgba(255, 255, 255, 0.55)',
  textMuted: 'rgba(255, 255, 255, 0.28)',

  // Badges
  shared: 'rgba(167, 139, 250, 0.18)',
  sharedText: '#C4B5FD',
  sharedBorder: 'rgba(167, 139, 250, 0.30)',
  personal: 'rgba(96, 165, 250, 0.18)',
  personalText: '#93C5FD',
  personalBorder: 'rgba(96, 165, 250, 0.30)',

  // Tab bar
  tabBg: 'rgba(12, 15, 26, 0.92)',
  tabActive: '#7B6CF8',
  tabInactive: 'rgba(255, 255, 255, 0.35)',
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
