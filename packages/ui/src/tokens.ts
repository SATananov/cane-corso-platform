export const uiTokens = {
  colors: {
    ink: '#0e0e10',
    ivory: '#f8f5ef',
    gold: '#d4af37',
    goldSoft: '#c8a852',
    panel: '#17171c',
    line: 'rgba(212, 175, 55, 0.18)',
  },
  radius: {
    card: '28px',
    button: '999px',
  },
  shadow: {
    card: '0 24px 80px rgba(0, 0, 0, 0.28)',
  },
} as const;

export type UiTokens = typeof uiTokens;
