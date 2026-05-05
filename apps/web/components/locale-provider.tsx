'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Dictionary, Locale } from '@/lib/i18n';

interface LocaleContextValue {
  locale: Locale;
  dictionary: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}

export function LocaleProvider({ locale, dictionary, children }: LocaleProviderProps) {
  return <LocaleContext.Provider value={{ locale, dictionary }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error('useLocale must be used inside LocaleProvider');
  }
  return value;
}
