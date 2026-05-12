import type { Locale } from '@/lib/i18n';

const DEMO_DATA_PATTERN = /\b(softuni|demo|seeded by step|testing|test profile|example owner|sample data|fixture|qa)\b/i;
const DEMO_CODE_PATTERN = /\b(USG-DEMO|SOFTUNI-DEMO|DEMO-\d|TEST-\d)\b/i;

const demoCopyByLocale = {
  en: {
    badge: 'Controlled example',
    profile: 'Controlled example profile for admin verification. Treat it as a test record, not as a live owner submission.',
    note: 'Controlled example note for admin verification. It is not shown as a public owner statement.',
    owner: 'Controlled example owner',
    dog: 'Example Cane Corso',
    hidden: 'Hidden in production wording',
  },
  bg: {
    badge: 'Контролен пример',
    profile: 'Контролен примерен профил за администраторска проверка. Третирай го като тестов запис, не като реална заявка от собственик.',
    note: 'Контролна бележка за администраторска проверка. Не се представя като публично изказване на собственик.',
    owner: 'Контролен примерен собственик',
    dog: 'Примерен Cane Corso',
    hidden: 'Скрито от production текста',
  },
  it: {
    badge: 'Esempio controllato',
    profile: 'Profilo di esempio controllato per verifica amministrativa. Trattalo come record di test, non come richiesta reale del proprietario.',
    note: 'Nota di esempio controllata per verifica amministrativa. Non viene presentata come dichiarazione pubblica del proprietario.',
    owner: 'Proprietario di esempio controllato',
    dog: 'Cane Corso di esempio',
    hidden: 'Nascosto dal testo production',
  },
} as const;

export function isDemoLikeValue(value: string | null | undefined): boolean {
  if (!value) return false;
  return DEMO_DATA_PATTERN.test(value) || DEMO_CODE_PATTERN.test(value);
}

export function hasDemoLikeValues(values: readonly (string | null | undefined)[]): boolean {
  return values.some(isDemoLikeValue);
}

export function getDemoDataPresentationCopy(locale: Locale) {
  return demoCopyByLocale[locale] ?? demoCopyByLocale.en;
}

export function cleanDemoDogName(value: string | null | undefined, locale: Locale): string {
  const copy = getDemoDataPresentationCopy(locale);
  if (!value) return copy.dog;
  if (!isDemoLikeValue(value)) return value;

  const cleaned = value
    .replace(/softuni/gi, '')
    .replace(/demo/gi, '')
    .replace(/test profile/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return cleaned || copy.dog;
}

export function cleanDemoOwnerName(value: string | null | undefined, locale: Locale): string {
  const copy = getDemoDataPresentationCopy(locale);
  if (!value) return copy.owner;
  if (!isDemoLikeValue(value)) return value;

  const cleaned = value
    .replace(/softuni/gi, '')
    .replace(/demo/gi, '')
    .replace(/example owner/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return cleaned || copy.owner;
}

export function cleanDemoProductionText(value: string | null | undefined, locale: Locale, kind: 'profile' | 'note' = 'profile'): string {
  const copy = getDemoDataPresentationCopy(locale);
  if (!value) return kind === 'note' ? copy.note : copy.profile;
  if (!isDemoLikeValue(value)) return value;

  return kind === 'note' ? copy.note : copy.profile;
}
