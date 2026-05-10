import Image from 'next/image';
import Link from 'next/link';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { HeaderNavLink } from '@/components/header-nav-link';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { getCurrentLocale } from '@/lib/locale.server';
import { getPublicNavigation } from '@/lib/navigation';
import type { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n';
import { SignOutButton } from '@/components/sign-out-button';
import { AdminTaskMenu } from '@/components/admin-task-menu';
import { canAccessAdminArea } from '@/lib/access-control';
import { getOptionalCookieMemberSession } from '@/lib/session.server';

function resolveHeaderIdentityName(currentSession: Awaited<ReturnType<typeof getOptionalCookieMemberSession>>) {
  if (!currentSession) {
    return null;
  }

  const firstName = currentSession.firstName?.trim() ?? '';
  const lastName = currentSession.lastName?.trim() ?? '';
  const fullName = `${firstName} ${lastName}`.trim();
  if (fullName) {
    return fullName;
  }

  const displayName = currentSession.user.displayName?.trim();
  if (displayName) {
    return displayName;
  }

  const emailAlias = currentSession.user.email.split('@')[0]?.trim();
  return emailAlias || null;
}

type HeaderWorkspaceLink = {
  href: string;
  label: string;
  accent?: boolean;
  quiet?: boolean;
  soft?: boolean;
  tone?: 'workspace' | 'account' | 'support';
};

function resolveHeaderIdentityStatement(locale: Locale, statement: string, brandEyebrow: string) {
  if (locale === 'it') {
    return brandEyebrow;
  }

  return statement;
}

export async function SiteHeader() {
  const locale = await getCurrentLocale();
  const t = getDictionary(locale);
  const publicNavigation = getPublicNavigation(locale);
  const currentSession = await getOptionalCookieMemberSession();
  const showAdminLink = canAccessAdminArea(currentSession?.user.role);
  const identityName = resolveHeaderIdentityName(currentSession);
  const identityStatement = resolveHeaderIdentityStatement(locale, t.site.brandStatement, t.site.brandEyebrow);
  const primaryNavigationLabel = locale === 'bg' ? 'Основна навигация' : locale === 'it' ? 'Navigazione principale' : 'Primary navigation';
  const workspaceControlsLabel = locale === 'bg' ? 'Контроли на профила' : locale === 'it' ? 'Controlli area personale' : 'Workspace controls';
  const memberCenterLabel = locale === 'bg' ? 'Център' : locale === 'it' ? 'Centro' : 'Center';
  const memberRequestsLabel = locale === 'bg' ? 'Заявки' : locale === 'it' ? 'Richieste' : 'Requests';

  const workspaceLinks: HeaderWorkspaceLink[] = currentSession
    ? [
        { href: '/my-dogs', label: t.navigation.myDogs, accent: true, tone: 'workspace' },
        { href: '/member', label: memberCenterLabel, tone: 'workspace' },
        { href: '/ecosystem', label: memberRequestsLabel, tone: 'workspace' },
        { href: '/profile', label: t.navigation.profile, quiet: true, tone: 'account' },
      ]
    : [
        { href: '/access?intent=member', label: t.common.signIn, soft: true, tone: 'support' },
        { href: '/access?intent=member', label: t.common.joinMember, accent: true, tone: 'workspace' },
        { href: '/knowledge', label: t.navigation.knowledge, quiet: true, tone: 'support' },
      ];

  return (
    <header className="site-header">
      <div className="site-header__bar site-header__bar--stacked site-header__bar--premium-two-row">
        <div className="site-header__row site-header__row--primary site-header__row--topline">
          <Link className="brand-mark brand-mark--compact" href="/platform">
            <span className="brand-mark__icon-wrap">
              <Image src="/brand/seal/usg-official-seal-compact.png" alt="Official UNICO SUO GENERE seal" width={40} height={40} />
            </span>
            <span className="brand-mark__copy">
              <span className="brand-mark__eyebrow">{t.site.brandEyebrow}</span>
              <span className="brand-mark__title">{t.site.brandTitle}</span>
              <span className="brand-mark__statement">{t.site.brandStatement}</span>
            </span>
          </Link>

          <nav className="site-nav site-nav--primary site-nav--topline" aria-label={primaryNavigationLabel}>
            {publicNavigation.map((item) => (
              <HeaderNavLink className="site-nav__link site-nav__link--topline" href={item.href} key={item.href}>
                {item.label}
              </HeaderNavLink>
            ))}
          </nav>
        </div>

        <div className="site-header__row site-header__row--secondary site-header__row--workline">
          <div className="site-utility site-utility--stacked site-utility--workline" aria-label={workspaceControlsLabel}>
            <div className="site-utility__lead site-utility__lead--workline">
              {currentSession ? (
                <div className="header-identity-panel header-identity-panel--workline" title={identityName ?? t.navigation.profile}>
                  <span className="header-identity-panel__eyebrow">{identityStatement}</span>
                  <strong className="header-identity-panel__name">{identityName ?? t.navigation.profile}</strong>
                </div>
              ) : (
                <div className="site-utility__brand-note site-utility__brand-note--workline">
                  <span className="site-utility__brand-note-label">USG</span>
                  <span className="site-utility__brand-note-copy">{t.site.brandStatement}</span>
                </div>
              )}
            </div>

            <div className="site-utility__menus site-utility__menus--secondary site-utility__menus--workline">
              {workspaceLinks.map((link) => (
                <HeaderNavLink
                  className={[
                    'header-direct-link',
                    'header-direct-link--workline',
                    link.accent ? 'header-direct-link--accent' : '',
                    link.soft ? 'header-direct-link--soft' : '',
                    link.quiet ? 'header-direct-link--quiet' : '',
                    link.tone ? `header-direct-link--${link.tone}` : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  href={link.href}
                  key={`${link.href}-${link.label}`}
                >
                  {link.label}
                </HeaderNavLink>
              ))}
              {showAdminLink ? <AdminTaskMenu locale={locale} /> : null}
            </div>

            <div className="site-utility__preferences site-utility__preferences--cluster site-utility__preferences--workline">
              <LocaleSwitcher />
              <ThemeSwitcher />
              {currentSession ? <SignOutButton label={t.site.exit} variant="header" /> : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
