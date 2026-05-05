'use client';

import { useEffect, useState, useTransition } from 'react';
import { useLocale } from '@/components/locale-provider';
import { THEME_COOKIE, themes, type Theme } from '@/lib/theme';

function MoonIcon() {
  return (
    <svg className="theme-switcher__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M19.2 14.6A8.6 8.6 0 0 1 9.4 4.8a.7.7 0 0 0-1-.8A9.6 9.6 0 1 0 20 15.6a.7.7 0 0 0-.8-1Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="theme-switcher__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function ThemeSwitcher() {
  const { dictionary } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === 'dark' || current === 'heritage') {
      setTheme(current);
    }
  }, []);

  const applyTheme = (nextTheme: Theme) => {
    if (nextTheme === theme) {
      return;
    }

    startTransition(() => {
      document.cookie = `${THEME_COOKIE}=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.dataset.theme = nextTheme;
      document.body.dataset.theme = nextTheme;
      setTheme(nextTheme);
    });
  };

  return (
    <div className="theme-switcher theme-switcher--iconic" aria-label={dictionary.site.theme}>
      {themes.map((entry) => {
        const isActive = entry === theme;
        const label = entry === 'dark' ? dictionary.site.darkTheme : dictionary.site.heritageTheme;

        return (
          <button
            type="button"
            key={entry}
            className={`theme-switcher__button${isActive ? ' is-active' : ''}`}
            onClick={() => applyTheme(entry)}
            disabled={isPending}
            aria-pressed={isActive}
            aria-label={label}
            title={label}
            data-theme-option={entry}
          >
            {entry === 'dark' ? <MoonIcon /> : <SunIcon />}
          </button>
        );
      })}
    </div>
  );
}
