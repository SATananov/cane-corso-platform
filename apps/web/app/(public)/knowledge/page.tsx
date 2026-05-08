import { KnowledgeCenter } from '@/components/knowledge-center';
import { PageShell } from '@/components/page-shell';
import { RoleAwareActionPanel } from '@/components/role-aware-action-panel';
import type { PageShellCard } from '@/components/page-shell';
import { getKnowledgeCenterContent } from '@/lib/knowledge-center-content';
import { getPublishedKnowledgeArticles } from '@/lib/knowledge-articles';
import { getCurrentLocale } from '@/lib/locale.server';
import { getOptionalCookieMemberSession } from '@/lib/session.server';
import { SectionContentGuidePanel } from '@/components/section-content-guide-panel';

export const dynamic = 'force-dynamic';

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
      heroChips={copy.hero.chips}
      heroNote={copy.hero.note}
      variant="knowledge"
    >
      <RoleAwareActionPanel locale={locale} surface="knowledge" role={currentSession?.user.role ?? null} />
      <SectionContentGuidePanel locale={locale} surface="knowledge" />
      <section id="knowledge-center" aria-label="Cane Corso Knowledge Center">
        <KnowledgeCenter copy={copy} actionLabel={actionLabel} articles={articles} locale={locale} />
      </section>
    </PageShell>
  );
}
