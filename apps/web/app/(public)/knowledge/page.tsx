import { AskMarkIPanel } from '@/components/ask-mark-i-panel';
import { KnowledgeCenter } from '@/components/knowledge-center';
import { PageShell } from '@/components/page-shell';
import type { PageShellCard, PageShellHeroChip } from '@/components/page-shell';
import { getKnowledgeCenterContent } from '@/lib/knowledge-center-content';
import { getPublishedKnowledgeArticles } from '@/lib/knowledge-articles';
import { getCurrentLocale } from '@/lib/locale.server';
import { getOptionalCookieMemberSession } from '@/lib/session.server';
import { RoleAwareActionPanel } from '@/components/role-aware-action-panel';

export const dynamic = 'force-dynamic';

function getKnowledgeHeroChips(locale: string, labels: readonly string[], actionLabel: string): readonly PageShellHeroChip[] {
  const routes = [
    '/knowledge/cane-corso-history-and-identity',
    '/knowledge/official-standard-owner-reading',
    '/knowledge/training-socialization-and-public-safety',
    '/knowledge/health-screening-and-responsible-care',
    '/knowledge/training-socialization-and-public-safety',
    '/knowledge/cane-corso-pregnancy-birth-puppy-growth-calendar',
  ];

  const descriptions = locale === 'bg'
    ? [
        'Произход, идентичност и как USG разделя исторически факти от наблюдения.',
        'Официалният FCI ориентир, размери, пропорции и граници за четене от собственик.',
        'Характер, социализация и безопасно поведение при силна молосоидна порода.',
        'Здравна осведоменост, скрининг и граници: информацията не заменя ветеринар.',
        'Практична грижа, обучение, снимки и подготовка за профил/преглед.',
        'Разплод, бременност, раждане и първите 40 дни при малките Cane Corso.',
      ]
    : locale === 'it'
      ? [
          'Origine, identità e separazione tra fatti storici e osservazioni USG.',
          'Orientamento FCI ufficiale, taglia, proporzioni e limiti per proprietari.',
          'Temperamento, socializzazione e sicurezza per una razza molossoide forte.',
          'Consapevolezza sanitaria, screening e limiti: non sostituisce il veterinario.',
          'Cura pratica, formazione, foto e preparazione del profilo/revisione.',
          'Riproduzione, gravidanza, parto e primi 40 giorni dei cuccioli Cane Corso.',
        ]
      : [
          'Origin, identity, and how USG separates historical facts from observations.',
          'Official FCI orientation, size, proportions, and owner-readable boundaries.',
          'Temperament, socialization, and safe handling for a strong molosser breed.',
          'Health awareness, screening, and boundaries: content does not replace a vet.',
          'Practical care, training, photos, and preparation for profile/review.',
          'Breeding, pregnancy, birth, and the first 40 days of Cane Corso puppies.',
        ];

  return labels.map((label, index) => ({
    label,
    href: routes[index] ?? '/knowledge',
    title: label,
    description: descriptions[index],
    actionHref: routes[index] ?? '/knowledge',
    actionLabel,
  }));
}

export default async function KnowledgePage() {
  const locale = await getCurrentLocale();
  const copy = getKnowledgeCenterContent(locale);
  const articles = getPublishedKnowledgeArticles(locale);
  const currentSession = await getOptionalCookieMemberSession();
  const actionLabel = locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open';
  const helpLabel = locale === 'bg' ? 'Помощ' : locale === 'it' ? 'Aiuto' : 'Help';
  const cards = copy.hero.cards.map((card) => ({
    eyebrow: card.eyebrow,
    title: card.title,
    description: card.description,
    meta: card.meta,
    icon: 'knowledge' as const,
  })) satisfies readonly PageShellCard[];

  return (
    <PageShell
      eyebrow={copy.hero.eyebrow}
      title={copy.hero.title}
      description={copy.hero.description}
      cards={cards}
      actionLabel={actionLabel}
      accentLabel={copy.hero.eyebrow}
      helpHref="/guide?topic=knowledge#knowledge"
      helpLabel={helpLabel}
      visualSrc="/brand/primary/welcome-logo.jpg"
      visualAlt="USG Cane Corso Knowledge Center"
      heroChips={getKnowledgeHeroChips(locale, copy.hero.chips, actionLabel)}
      heroNote={copy.hero.note}
      variant="knowledge"
    >
      <RoleAwareActionPanel locale={locale} surface="knowledge" role={currentSession?.user.role ?? null} />

      <AskMarkIPanel locale={locale} variant="knowledge" className="knowledge-ask-mark-i" />

      <section id="knowledge-center" aria-label="Cane Corso Knowledge Center">
        <KnowledgeCenter copy={copy} actionLabel={actionLabel} articles={articles} locale={locale} />
      </section>
    </PageShell>
  );
}
