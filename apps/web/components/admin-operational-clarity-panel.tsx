import type { Locale } from '@/lib/i18n';

type AdminSurface = 'review' | 'registry' | 'partners' | 'ecosystem' | 'knowledge';

interface AdminOperationalClarityPanelProps {
  locale: Locale;
  surface: AdminSurface;
}

const copyByLocale = {
  en: {
    eyebrow: 'Decision guardrails',
    title: 'Keep every decision clear and traceable',
    body: 'Use this panel only when you need the rules behind a decision. The active queue and actions stay first.',
    pillars: ['Authority boundary', 'Evidence first', 'No hidden automation'],
    surfaces: {
      review: 'Use Review for profile readiness and Registry publication decisions.',
      registry: 'Use Admin Registry for published records and certificate actions only when the evidence is clear.',
      partners: 'Use Partner moderation for real service approval, separate from community popularity.',
      ecosystem: 'Use Ecosystem moderation to decide official, community, or internal suggestion visibility.',
      knowledge: 'Use Knowledge admin as read-only content governance until write actions are intentionally added.',
    },
  },
  bg: {
    eyebrow: 'Правила за решения',
    title: 'Всяко решение остава ясно и проследимо',
    body: 'Отваряй този панел само когато ти трябва контекст за решение. Реалната опашка и действията остават първи.',
    pillars: ['Граница на отговорност', 'Първо доказателства', 'Без скрита автоматизация'],
    surfaces: {
      review: 'Използвай Преглед за готовност на профила и решения за публикация в Регистъра.',
      registry: 'Използвай админ Регистър за публикувани записи и сертификатни действия само при ясни доказателства.',
      partners: 'Използвай партньорска модерация за реално одобрение на услуги, отделно от популярността.',
      ecosystem: 'Използвай екосистемната модерация за официална, общностна или вътрешна видимост.',
      knowledge: 'Използвай админ Знания като управление само за преглед, докато действията за запис не бъдат добавени целенасочено.',
    },
  },
  it: {
    eyebrow: 'Regole decisionali',
    title: 'Ogni decisione resta chiara e tracciabile',
    body: 'Apri questo pannello solo quando ti serve contesto per una decisione. La coda reale e le azioni restano al primo posto.',
    pillars: ['Confine di responsabilità', 'Prima le prove', 'Nessuna automazione nascosta'],
    surfaces: {
      review: 'Usa Revisione per la prontezza del profilo e le decisioni di pubblicazione nel Registro.',
      registry: 'Usa il Registro amministrativo per record pubblicati e certificati solo con prove chiare.',
      partners: 'Usa la moderazione dei partner per l’approvazione dei servizi, separata dalla popolarità della comunità.',
      ecosystem: 'Usa la moderazione dell’ecosistema per visibilità ufficiale, comunitaria o suggerimento interno.',
      knowledge: 'Usa l’amministrazione delle Conoscenze come gestione solo in lettura finché le azioni di scrittura non vengono aggiunte intenzionalmente.',
    },
  },
} as const;

function getPanelHint(locale: Locale) {
  if (locale === 'bg') return 'Помощ за решение';
  if (locale === 'it') return 'Aiuto decisionale';
  return 'Decision help';
}

export function AdminOperationalClarityPanel({ locale, surface }: AdminOperationalClarityPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <section className={`content-card admin-operational-clarity-panel admin-operational-clarity-panel--${surface}`} aria-label={copy.title}>
      <details className="admin-operational-clarity-panel__details">
        <summary className="admin-operational-clarity-panel__summary">
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <strong>{getPanelHint(locale)}</strong>
          <small>{copy.title}</small>
        </summary>
        <div className="admin-operational-clarity-panel__body">
          <div>
            <h2>{copy.title}</h2>
            <p>{copy.body}</p>
          </div>
          <div className="admin-operational-clarity-panel__surface">
            <strong>{copy.surfaces[surface]}</strong>
            <div className="admin-operational-clarity-panel__pillars">
              {copy.pillars.map((pillar) => <span key={pillar}>{pillar}</span>)}
            </div>
          </div>
        </div>
      </details>
    </section>
  );
}
