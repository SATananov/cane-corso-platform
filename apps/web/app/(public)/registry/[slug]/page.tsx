import { notFound } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { PublicRegistryProfile } from '@/components/public-registry-profile';
import { canAccessAdminArea } from '@/lib/access-control';
import { getDictionary } from '@/lib/i18n';
import { getCurrentLocale } from '@/lib/locale.server';
import { getPublishedRegistryProfileDocument } from '@/lib/registry.server';
import { getOptionalCookieMemberSession } from '@/lib/session.server';

interface RegistryProfilePageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ rating?: string }> | { rating?: string };
}

export const dynamic = 'force-dynamic';

export default async function RegistryProfilePage({ params, searchParams }: RegistryProfilePageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const ratingStatus = typeof resolvedSearchParams?.rating === 'string' ? resolvedSearchParams.rating : null;
  const locale = await getCurrentLocale();
  const t = getDictionary(locale);
  const currentSession = await getOptionalCookieMemberSession();
  const document = await getPublishedRegistryProfileDocument(slug, currentSession?.user.profileId ?? null);
  const isAdminViewer = canAccessAdminArea(currentSession?.user.role ?? null);

  if (!document) {
    notFound();
  }

  return (
    <PageShell
      eyebrow={t.pages.registry.eyebrow}
      title={document.entry.title}
      description={document.entry.summary || t.pages.registry.description}
      accentLabel={t.pageShell.accentLabel}
      helpHref="/guide?topic=registry#registry"
      helpLabel={t.common.help}
      visualSrc={document.entry.heroImageUrl ?? '/brand/seal/usg-seal-wide.png'}
      visualAlt={document.entry.title}
      visualFit={document.entry.heroImageUrl ? 'cover' : 'contain'}
      heroChips={[
        locale === 'bg' ? 'Публикуван профил' : locale === 'it' ? 'Profilo pubblicato' : 'Published profile',
        document.entry.certificate
          ? locale === 'bg'
            ? 'USG сертификат'
            : locale === 'it'
              ? 'Certificato USG'
              : 'USG certificate'
          : locale === 'bg'
            ? 'Без активен сертификат'
            : locale === 'it'
              ? 'Senza certificato attivo'
              : 'No active certificate',
        locale === 'bg' ? 'Детайлен профил' : locale === 'it' ? 'Profilo dettagliato' : 'Detailed profile',
      ]}
      heroNote={locale === 'bg'
        ? 'Тук старият project spirit се връща като по-богат публичен профил, но без да смесва registry и certificate.'
        : locale === 'it'
          ? 'Qui lo spirito del vecchio progetto ritorna come profilo pubblico più ricco, senza confondere registro e certificato.'
          : 'The older project spirit returns here as a richer public profile without mixing registry and certificate.'}
    >
      <PublicRegistryProfile
        document={document}
        locale={locale}
        hasMemberAccess={Boolean(currentSession)}
        isAdminViewer={isAdminViewer}
        ratingStatus={ratingStatus}
      />
    </PageShell>
  );
}
