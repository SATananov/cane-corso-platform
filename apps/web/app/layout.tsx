import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { AppShell } from '@/components/app-shell';
import { LocaleProvider } from '@/components/locale-provider';
import { SessionBootstrapSync } from '@/components/session-bootstrap-sync';
import { getDictionary } from '@/lib/i18n';
import { getCurrentLocale } from '@/lib/locale.server';
import { getCurrentTheme } from '@/lib/theme.server';
import './globals.css';
import './certificate-v2.css';

export const metadata: Metadata = {
  title: 'UNICO SUO GENERE — Cane Corso Platform',
  description:
    'Premium platform for Cane Corso, owners, trusted partners, breed knowledge, and verification flows.',
  icons: {
    icon: [
      { url: '/brand/icons/favicon-dark-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/icons/favicon-dark-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/icons/favicon-dark.png', type: 'image/png' },
    ],
    apple: [{ url: '/brand/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/brand/icons/favicon-dark-32.png'],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const theme = await getCurrentTheme();

  return (
    <html lang={locale} data-theme={theme}>
      <body data-theme={theme}>
        <LocaleProvider locale={locale} dictionary={dictionary}>
          <SessionBootstrapSync />
          <AppShell header={<SiteHeader />} footer={<SiteFooter />}>
            {children}
          </AppShell>
        </LocaleProvider>
      </body>
    </html>
  );
}
