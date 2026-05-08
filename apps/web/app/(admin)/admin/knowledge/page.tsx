import { KnowledgeAdminDashboard } from '@/components/knowledge-admin-dashboard';
import { PageShell } from '@/components/page-shell';
import { AdminOperationalClarityPanel } from '@/components/admin-operational-clarity-panel';
import { getAdminKnowledgeArticles } from '@/lib/knowledge-articles';
import { getCurrentLocale } from '@/lib/locale.server';
import { SectionContentGuidePanel } from '@/components/section-content-guide-panel';

export const dynamic = 'force-dynamic';

const copyByLocale = {
  en: {
    eyebrow: 'Admin Knowledge foundation',
    title: 'Knowledge articles',
    description:
      'Read-only foundation for the future admin-managed Knowledge CMS. Step 30 introduces article records, statuses, source discipline, and public-only publishing boundaries without adding database writes.',
    helpLabel: 'Help',
    note:
      'This page is intentionally read-only in Step 30. It prepares the content model before the future editor, database migration, and write actions are added.',
    chips: ['Articles', 'Statuses', 'Sources', 'Draft guardrail'],
  },
  bg: {
    eyebrow: 'Админ основа за знания',
    title: 'Статии в знанията',
    description:
      'Основа само за преглед за бъдещата администраторски управлявана система за знания. Този етап добавя записи за статии, статуси, дисциплина на източниците и публична граница само за публикувани статии, без записи към базата данни.',
    helpLabel: 'Помощ',
    note:
      'Тази страница умишлено е само за преглед. Тя подготвя модела преди бъдещия редактор, миграция към база данни и действия за запис.',
    chips: ['Статии', 'Статуси', 'Източници', 'Защита на чернови'],
  },
  it: {
    eyebrow: 'Fondazione Admin Knowledge',
    title: 'Articoli Knowledge',
    description:
      'Fondazione solo in lettura per la futura gestione amministrativa delle Conoscenze. Questo passaggio introduce record articolo, stati, disciplina delle fonti e confine pubblico solo per gli articoli pubblicati, senza scritture nel database.',
    helpLabel: 'Aiuto',
    note:
      'Questa pagina è volutamente solo in lettura. Prepara il modello prima del futuro editor, della migrazione del database e delle azioni di scrittura.',
    chips: ['Articoli', 'Stati', 'Fonti', 'Protezione bozze'],
  },
} as const;

export default async function AdminKnowledgePage() {
  const locale = await getCurrentLocale();
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const articles = getAdminKnowledgeArticles(locale);

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      cards={[]}
      accentLabel={copy.eyebrow}
      helpHref="/guide?topic=knowledge#knowledge"
      helpLabel={copy.helpLabel}
      visualSrc="/brand/primary/welcome-logo.jpg"
      visualAlt={copy.title}
      heroChips={copy.chips}
      heroNote={copy.note}
      variant="knowledge"
    >
      <AdminOperationalClarityPanel locale={locale} surface="knowledge" />
      <SectionContentGuidePanel locale={locale} surface="adminKnowledge" />
      <KnowledgeAdminDashboard articles={articles} locale={locale} />
    </PageShell>
  );
}
