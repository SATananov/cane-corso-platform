import { cookies } from 'next/headers';
import { isLocale, LOCALE_COOKIE, type Locale } from '@/lib/i18n';

export async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(locale) ? locale : 'en';
}
