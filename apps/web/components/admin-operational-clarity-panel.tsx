import type { Locale } from '@/lib/i18n';

type AdminSurface = 'review' | 'registry' | 'partners' | 'ecosystem' | 'knowledge';

interface AdminOperationalClarityPanelProps {
  locale: Locale;
  surface: AdminSurface;
}

const copyByLocale = {
  en: {
    eyebrow: 'Admin operational clarity',
    title: 'Decisions stay explicit, reversible only through the proper authority layer',
    body: 'This admin surface is a control point, not a shortcut. Review, publish, certify, revoke, approve, and archive actions must remain traceable and separate from public presentation polish.',
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
    eyebrow: 'Админ оперативна яснота',
    title: 'Решенията остават ясни и само в правилния слой на отговорност',
    body: 'Този администраторски екран е контролна точка, не пряк път. Преглед, публикация, сертификат, отнемане, одобрение и архивиране трябва да останат проследими и отделени от визуалното оформление.',
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
    eyebrow: 'Chiarezza operativa admin',
    title: 'Le decisioni restano esplicite nel livello di responsabilità corretto',
    body: 'Questa area amministrativa è un punto di controllo, non una scorciatoia. Revisione, pubblicazione, certificazione, revoca, approvazione e archiviazione devono restare tracciabili e separati dalla presentazione pubblica.',
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

export function AdminOperationalClarityPanel({ locale, surface }: AdminOperationalClarityPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <section className={`content-card admin-operational-clarity-panel admin-operational-clarity-panel--${surface}`} aria-label={copy.title}>
      <div>
        <span className="eyebrow-label">{copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <div className="admin-operational-clarity-panel__surface">
        <strong>{copy.surfaces[surface]}</strong>
        <div className="admin-operational-clarity-panel__pillars">
          {copy.pillars.map((pillar) => <span key={pillar}>{pillar}</span>)}
        </div>
      </div>
    </section>
  );
}
