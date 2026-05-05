import type { Config } from 'tailwindcss';
import { uiTokens } from './tokens';

export const tailwindPreset: Pick<Config, 'theme'> = {
  theme: {
    extend: {
      colors: {
        brand: {
          ink: uiTokens.colors.ink,
          ivory: uiTokens.colors.ivory,
          gold: uiTokens.colors.gold,
          panel: uiTokens.colors.panel,
        },
      },
      borderRadius: {
        card: uiTokens.radius.card,
        pill: uiTokens.radius.button,
      },
      boxShadow: {
        card: uiTokens.shadow.card,
      },
    },
  },
};
