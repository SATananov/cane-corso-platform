export const themes = ['dark', 'heritage'] as const;

export type Theme = (typeof themes)[number];

export const THEME_COOKIE = 'usg-theme';

export function isTheme(value: string | null | undefined): value is Theme {
  return typeof value === 'string' && (themes as readonly string[]).includes(value);
}
