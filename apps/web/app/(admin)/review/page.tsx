import { PageShell } from '@/components/page-shell';
import { ReviewQueueDashboard } from '@/components/review-queue-dashboard';
import { AdminOperationalClarityPanel } from '@/components/admin-operational-clarity-panel';
import { RoleAwareActionPanel } from '@/components/role-aware-action-panel';
import { getCurrentLocale } from '@/lib/locale.server';
import { getDictionary } from '@/lib/i18n';
import { getReviewQueueDocument } from '@/lib/review.server';
import { SectionContentGuidePanel } from '@/components/section-content-guide-panel';

export const dynamic = 'force-dynamic';

const reviewPageCopy = {
  en: {
    heroChips: ['Registry review', 'Photo control', 'USG certificate'],
    heroNote:
      'Registry approval and USG certification stay separate. Publish only the profile first, then issue a certificate only when the admin decision is clear.',
  },
  bg: {
    heroChips: ['Преглед за Регистър', 'Контрол на снимки', 'USG сертификат'],
    heroNote:
      'Одобрението за Регистъра и USG сертификатът остават отделни решения. Първо прегледай заявката, после публикувай профила и издай сертификат само при ясна администраторска преценка.',
  },
  it: {
    heroChips: ['Revisione Registro', 'Controllo foto', 'Certificato USG'],
    heroNote:
      'Approvazione del Registro e certificazione USG restano decisioni separate. Prima pubblica il profilo, poi emetti il certificato solo con una decisione amministrativa chiara.',
  },
} as const;

export default async function ReviewQueuePage() {
  const locale = await getCurrentLocale();
  const t = getDictionary(locale);
  const document = await getReviewQueueDocument();
  const pageCopy = reviewPageCopy[locale] ?? reviewPageCopy.en;

  return (
    <PageShell
      eyebrow={t.pages.review.eyebrow}
      title={t.pages.review.title}
      description={t.pages.review.description}
      accentLabel={t.pageShell.accentLabel}
      helpHref="/guide?topic=review#review"
      helpLabel={t.common.help}
      heroChips={pageCopy.heroChips}
      heroNote={pageCopy.heroNote}
    >
      <RoleAwareActionPanel locale={locale} surface="review" role="admin" />
      <SectionContentGuidePanel locale={locale} surface="review" />
      <ReviewQueueDashboard document={document} locale={locale} />
      <AdminOperationalClarityPanel locale={locale} surface="review" />
    </PageShell>
  );
}
