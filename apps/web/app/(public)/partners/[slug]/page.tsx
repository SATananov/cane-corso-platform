import { notFound } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { PartnerProfileDetail } from '@/components/partner-profile-detail';
import { getCurrentLocale } from '@/lib/locale.server';
import { getPartnerCategoryLabel, getPartnerUiCopy, localizePartnerText } from '@/lib/partner-copy';
import { getPartnerProfileDocument } from '@/lib/partners.server';
import { getOptionalCookieMemberSession } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

interface PartnerProfilePageProps {
  params: Promise<{
    slug: string;
  }> | {
    slug: string;
  };
  searchParams?: Promise<{ rating?: string }> | { rating?: string };
}

export default async function PartnerProfilePage({ params, searchParams }: PartnerProfilePageProps) {
  const locale = await getCurrentLocale();
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const ratingStatus = typeof resolvedSearchParams?.rating === 'string' ? resolvedSearchParams.rating : null;
  const currentSession = await getOptionalCookieMemberSession();
  const document = await getPartnerProfileDocument(resolvedParams.slug, currentSession?.user.profileId ?? null);

  if (!document) {
    notFound();
  }

  const partnerCopy = getPartnerUiCopy(locale);
  const localizedDescription = localizePartnerText(
    locale,
    document.entry.shortDescription || document.entry.longDescription,
    partnerCopy.labels.noDescription,
  );

  return (
    <PageShell
      eyebrow={getPartnerCategoryLabel(locale, document.entry.category)}
      title={document.entry.businessName}
      description={localizedDescription}
      accentLabel={document.entry.businessName}
      helpHref="/guide?topic=partners#partners"
      helpLabel={locale === 'bg' ? 'Помощ' : locale === 'it' ? 'Aiuto' : 'Help'}
      visualSrc={document.entry.coverImageUrl ?? document.entry.logoUrl ?? '/brand/seal/usg-seal-wide.png'}
      visualAlt={document.entry.businessName}
      visualFit={document.entry.coverImageUrl || document.entry.logoUrl ? 'cover' : 'contain'}
      heroChips={[
        getPartnerCategoryLabel(locale, document.entry.category),
        document.entry.isFeatured
          ? locale === 'bg'
            ? 'Препоръчан партньор'
            : locale === 'it'
              ? 'Partner in evidenza'
              : 'Featured partner'
          : locale === 'bg'
            ? 'Куриран профил'
            : locale === 'it'
              ? 'Profilo curato'
              : 'Curated profile',
        locale === 'bg' ? 'Публичен партньор' : locale === 'it' ? 'Partner pubblico' : 'Public partner',
      ]}
      heroNote={locale === 'bg'
        ? 'Одобрен партньорски профил с практична информация за собственици на Cane Corso и ясно отделяне от обикновените предложения от общността.'
        : locale === 'it'
          ? 'Profilo partner approvato con informazioni pratiche per proprietari di Cane Corso e separazione chiara dai suggerimenti ordinari della community.'
          : 'Approved partner profile with practical information for Cane Corso owners and a clear separation from ordinary community suggestions.'}
    >
      <PartnerProfileDetail document={document} locale={locale} ratingStatus={ratingStatus} />
    </PageShell>
  );
}
