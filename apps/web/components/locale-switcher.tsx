'use client';

import { useTransition } from 'react';
import { LOCALE_COOKIE, localeLabels, locales, type Locale } from '@/lib/i18n';
import { useLocale } from '@/components/locale-provider';

export function LocaleSwitcher() {
  const { locale, dictionary } = useLocale();
  const [isPending, startTransition] = useTransition();

  const setLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }

    startTransition(() => {
      document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
      window.location.reload();
    });
  };

  return (
    <div className="locale-switcher" aria-label={dictionary.site.locale}>
      {locales.map((entry) => (
        <button
          type="button"
          key={entry}
          className={`locale-switcher__button${entry === locale ? ' is-active' : ''}`}
          onClick={() => setLocale(entry)}
          disabled={isPending}
          aria-pressed={entry === locale}
        >
          {localeLabels[entry]}
        </button>
      ))}
    </div>
  );
}
