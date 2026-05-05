import { notFound } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { EcosystemProfileDetail } from '@/components/ecosystem-profile-detail';
import { getCurrentLocale } from '@/lib/locale.server';
import { getPublishedEcosystemProfileDocument } from '@/lib/ecosystem.server';
import { getEcosystemListingTypeLabels, getEcosystemSubmissionChannelLabels } from '@/lib/ecosystem-ui';

export const dynamic = 'force-dynamic';

interface EcosystemProfilePageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

const copyByLocale = {
  en: {
    eyebrow: 'Public ecosystem profile',
    description: 'A published Cane Corso ecosystem profile with practical information, moderation context, and a clear public visibility boundary.',
    helpLabel: 'Help',
    heroNote: 'Only published real ecosystem listings can open here. Drafts, pending records, approved-only records, and internal suggestions remain private or admin-only.',
    featured: 'Featured',
    published: 'Published',
  },
  bg: {
    eyebrow: 'Публичен профил от екосистемата',
    description: 'Публикуван Cane Corso профил от екосистемата с практична информация, модерационен контекст и ясна граница за публична видимост.',
    helpLabel: 'Помощ',
    heroNote: 'Тук се отварят само реални публикувани записи. Чернови, чакащи записи, само одобрени записи и вътрешни предложения остават частни или admin-only.',
    featured: 'Отличен',
    published: 'Публикуван',
  },
  it: {
    eyebrow: 'Profilo pubblico ecosystem',
    description: 'Un profilo Cane Corso ecosystem pubblicato con informazioni pratiche, contesto di moderazione e confine pubblico chiaro.',
    helpLabel: 'Aiuto',
    heroNote: 'Qui si aprono solo schede reali e pubblicate. Bozze, schede in revisione, approvate ma non pubblicate e suggerimenti interni restano privati o admin-only.',
    featured: 'In evidenza',
    published: 'Pubblicata',
  },
} as const;

export default async function EcosystemProfilePage({ params }: EcosystemProfilePageProps) {
  const locale = await getCurrentLocale();
  const resolvedParams = await Promise.resolve(params);
  const document = await getPublishedEcosystemProfileDocument(resolvedParams.slug);

  if (!document) {
    notFound();
  }

  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const listing = document.listing;
  const typeLabels = getEcosystemListingTypeLabels(locale);
  const channelLabels = getEcosystemSubmissionChannelLabels(locale);

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={listing.title}
      description={listing.shortDescription || copy.description}
      accentLabel={listing.title}
      helpHref="/guide?topic=community#community"
      helpLabel={copy.helpLabel}
      visualSrc="/brand/seal/usg-seal-wide.png"
      visualAlt="UNICO SUO GENERE seal"
      visualFit="contain"
      heroChips={[
        typeLabels[listing.listingType],
        channelLabels[listing.submissionChannel],
        listing.isFeatured ? copy.featured : copy.published,
      ]}
      heroNote={copy.heroNote}
    >
      <EcosystemProfileDetail document={document} locale={locale} />
    </PageShell>
  );
}
