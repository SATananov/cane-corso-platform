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
  const isOwnerViewer = Boolean(currentSession?.user.profileId && currentSession.user.profileId === document?.entry.owner.profileId);

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
        isOwnerViewer || isAdminViewer
          ? locale === 'bg' ? 'Пълен защитен изглед' : locale === 'it' ? 'Vista protetta completa' : 'Full protected view'
          : locale === 'bg' ? 'Публичен основен изглед' : locale === 'it' ? 'Vista pubblica essenziale' : 'Public essentials view',
      ]}
      heroNote={locale === 'bg'
        ? 'Публичният профил показва само одобреното безопасно ядро: снимки, име, дата на раждане и публично име на собственика. Пълните данни остават за собственика и админ.'
        : locale === 'it'
          ? 'Il profilo pubblico mostra solo il nucleo sicuro approvato: foto, nome, data di nascita e nome pubblico del proprietario. I dati completi restano al proprietario e all’admin.'
          : 'The public profile shows only the approved safe core: photos, name, birth date, and public owner name. Full data stays with the owner and admin.'}
    >
      <PublicRegistryProfile
        document={document}
        locale={locale}
        hasMemberAccess={Boolean(currentSession)}
        isOwnerViewer={isOwnerViewer}
        isAdminViewer={isAdminViewer}
        ratingStatus={ratingStatus}
      />
    </PageShell>
  );
}
