import { PageShell } from '@/components/page-shell';
import { PartnerModerationDashboard } from '@/components/partner-moderation-dashboard';
import { AdminOperationalClarityPanel } from '@/components/admin-operational-clarity-panel';
import { getDictionary } from '@/lib/i18n';
import { getCurrentLocale } from '@/lib/locale.server';
import { getPartnerModerationDocument } from '@/lib/partners.server';

export const dynamic = 'force-dynamic';

const adminPartnerPageCopy = {
  en: {
    heroChips: ['Application review', 'Public directory', 'Ecosystem sync'],
    heroNote:
      'Partner approval stays official and separate from community popularity. Approved services also sync into the ecosystem layer.',
  },
  bg: {
    heroChips: ['Преглед на кандидатури', 'Публичен каталог', 'Синхронизация с екосистемата'],
    heroNote:
      'Одобрението на партньор остава официално и отделно от оценките на общността. Одобрените услуги се синхронизират и към екосистемата.',
  },
  it: {
    heroChips: ['Revisione candidature', 'Catalogo pubblico', 'Sync ecosystem'],
    heroNote:
      'L’approvazione partner resta ufficiale e separata dalla popolarità community. I servizi approvati si sincronizzano anche nell’ecosystem.',
  },
} as const;

export default async function AdminPartnersPage() {
  const locale = await getCurrentLocale();
  const t = getDictionary(locale);
  const document = await getPartnerModerationDocument();
  const pageCopy = adminPartnerPageCopy[locale] ?? adminPartnerPageCopy.en;

  return (
    <PageShell
      eyebrow={t.pages.adminPartners.eyebrow}
      title={t.pages.adminPartners.title}
      description={
        locale === 'bg'
          ? 'Зона за одобрение на партньорски кандидатури, проверки за доверие и поддържане на доверена партньорска мрежа.'
          : t.pages.adminPartners.description
      }
      accentLabel={t.pageShell.accentLabel}
      helpHref="/guide?topic=partners#partners"
      helpLabel={t.common.help}
      heroChips={pageCopy.heroChips}
      heroNote={pageCopy.heroNote}
    >
      <AdminOperationalClarityPanel locale={locale} surface="partners" />
      <PartnerModerationDashboard document={document} locale={locale} />
    </PageShell>
  );
}
