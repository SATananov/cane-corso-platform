import { PageShell, type PageShellHeroChip } from '@/components/page-shell';
import { ReviewQueueDashboard } from '@/components/review-queue-dashboard';
import { AdminOperationalClarityPanel } from '@/components/admin-operational-clarity-panel';
import { RoleAwareActionPanel } from '@/components/role-aware-action-panel';
import { getCurrentLocale } from '@/lib/locale.server';
import { getDictionary } from '@/lib/i18n';
import { getReviewQueueDocument } from '@/lib/review.server';
import { SectionContentGuidePanel } from '@/components/section-content-guide-panel';
import { UsgAdminVisualReviewPanel } from '@/components/usg-standard-knowledge-panel';

export const dynamic = 'force-dynamic';

const reviewPageCopy = {
  en: {
    heroChips: [
      { label: 'Registry review', href: '#review-queue', title: 'Pending profiles', description: 'Jump directly to the submitted profiles and decisions.', actionLabel: 'Open queue' },
      { label: 'Photo control', href: '#admin-photo-assistant', title: 'Photo assistant', description: 'Jump directly to photo readiness, labels, and image choices.', actionLabel: 'Open photos' },
      { label: 'USG certificate', href: '#admin-certificate-flow', title: 'Certificate flow', description: 'Jump directly to the separate certificate decision lane.', actionLabel: 'Open certificate flow' },
    ] satisfies readonly PageShellHeroChip[],
    heroNote:
      'Registry approval and USG certification stay separate. Publish only the profile first, then issue a certificate only when the admin decision is clear.',
  },
  bg: {
    heroChips: [
      { label: 'Преглед за Регистър', href: '#review-queue', title: 'Чакащи профили', description: 'Отиди директно към изпратените профили и решенията.', actionLabel: 'Към опашката' },
      { label: 'Контрол на снимки', href: '#admin-photo-assistant', title: 'Асистент за снимки', description: 'Отиди директно към готовност, етикети и избор на снимки.', actionLabel: 'Към снимките' },
      { label: 'USG сертификат', href: '#admin-certificate-flow', title: 'Сертификатен поток', description: 'Отиди директно към отделното решение за сертификат.', actionLabel: 'Към сертификата' },
    ] satisfies readonly PageShellHeroChip[],
    heroNote:
      'Одобрението за Регистъра и USG сертификатът остават отделни решения. Първо прегледай заявката, после публикувай профила и издай сертификат само при ясна администраторска преценка.',
  },
  it: {
    heroChips: [
      { label: 'Revisione Registro', href: '#review-queue', title: 'Profili in attesa', description: 'Vai direttamente ai profili inviati e alle decisioni.', actionLabel: 'Apri coda' },
      { label: 'Controllo foto', href: '#admin-photo-assistant', title: 'Assistente foto', description: 'Vai direttamente a prontezza, etichette e scelta immagini.', actionLabel: 'Apri foto' },
      { label: 'Certificato USG', href: '#admin-certificate-flow', title: 'Flusso certificato', description: 'Vai direttamente alla decisione separata sul certificato.', actionLabel: 'Apri certificato' },
    ] satisfies readonly PageShellHeroChip[],
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
      <UsgAdminVisualReviewPanel locale={locale} />
      <ReviewQueueDashboard document={document} locale={locale} />
      <SectionContentGuidePanel locale={locale} surface="review" />
      <AdminOperationalClarityPanel locale={locale} surface="review" />
    </PageShell>
  );
}
