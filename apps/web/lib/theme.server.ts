import { cookies } from 'next/headers';
import { isTheme, THEME_COOKIE, type Theme } from '@/lib/theme';

export async function getCurrentTheme(): Promise<Theme> {
  const cookieStore = await cookies();
  const value = cookieStore.get(THEME_COOKIE)?.value;
  return isTheme(value) ? value : 'dark';
}
