import { PageShell } from '@/components/page-shell';
import { EcosystemModerationDashboard } from '@/components/ecosystem-moderation-dashboard';
import { AdminOperationalClarityPanel } from '@/components/admin-operational-clarity-panel';
import { getCurrentLocale } from '@/lib/locale.server';
import { getEcosystemModerationDocument } from '@/lib/ecosystem.server';

export const dynamic = 'force-dynamic';

const copyByLocale = {
  en: {
    eyebrow: 'Admin moderation',
    title: 'Official vs community ecosystem review',
    description:
      'Moderation surface for deciding whether an ecosystem item is an official listing, a community listing, or only an internal suggestion signal.',
    heroChips: ['Official listing', 'Community listing', 'Suggestion'],
    heroNote:
      'This queue protects the public platform: nothing from the ecosystem becomes visible before admin review.',
  },
  bg: {
    eyebrow: 'Админ модерация',
    title: 'Преглед на официални и общностни записи',
    description:
      'Модерационна зона за преценка дали даден запис е официален, общностен или само вътрешно предложение.',
    heroChips: ['Официален запис', 'Общностен запис', 'Предложение'],
    heroNote:
      'Тази опашка пази публичната платформа: нищо от екосистемата не става видимо преди админ преглед.',
  },
  it: {
    eyebrow: 'Moderazione admin',
    title: 'Revisione ecosystem official vs community',
    description:
      'Superficie di moderazione per decidere se un elemento ecosystem è una scheda ufficiale, una scheda community o solo un segnale interno.',
    heroChips: ['Scheda ufficiale', 'Scheda community', 'Suggerimento'],
    heroNote:
      'Questa coda protegge la piattaforma pubblica: niente diventa visibile senza revisione admin.',
  },
} as const;

export default async function AdminEcosystemPage() {
  const locale = await getCurrentLocale();
  const document = await getEcosystemModerationDocument();
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      accentLabel={locale === 'bg' ? 'Модерация на екосистемата' : 'Ecosystem moderation'}
      heroChips={copy.heroChips}
      heroNote={copy.heroNote}
    >
      <AdminOperationalClarityPanel locale={locale} surface="ecosystem" />
      <EcosystemModerationDashboard document={document} locale={locale} />
    </PageShell>
  );
}
