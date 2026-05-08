
import Link from 'next/link';
import type { ReviewQueueSummary } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';

interface AdminModerationActionFlowPanelProps {
  locale: Locale;
  summary: ReviewQueueSummary;
}

const copyByLocale = {
  en: {
    eyebrow: 'Admin action flow',
    title: 'Moderate owner submissions through one controlled sequence',
    description:
      'This admin panel keeps the operational path explicit: review the owner profile, save the official assessment, approve or request changes, publish to Registry, and only then issue or revoke certificate trust. It does not change Auth, session, or public verification authority.',
    counts: {
      intake: 'Intake queue',
      decision: 'Decision-ready',
      public: 'Public trust layer',
    },
    steps: [
      ['Owner submission', 'Submitted profiles are read from the admin review queue only after the member sends them for review.'],
      ['Admin assessment', 'Official USG notes, scores, Registry readiness, and Certificate readiness stay separated from community votes.'],
      ['Decision action', 'Admin can approve the profile or request owner changes without exposing unfinished work publicly.'],
      ['Publication and trust', 'Registry publication, certificate issuance, and Gallery curation remain separate admin-controlled actions.'],
    ],
    actions: {
      registry: 'Open Registry admin',
      guide: 'Open review guide',
    },
  },
  bg: {
    eyebrow: 'Администраторска последователност',
    title: 'Модерирай заявките от собственици през една контролирана последователност',
    description:
      'Този администраторски панел държи работния път ясен: преглед на профила на собственика, официална оценка, одобрение или връщане за корекции, публикация в Регистъра и чак след това сертификатно доверие. Не променя удостоверяването, сесията или публичната проверка.',
    counts: {
      intake: 'Входяща опашка',
      decision: 'Готови за решение',
      public: 'Публичен слой на доверие',
    },
    steps: [
      ['Заявка от собственик', 'Изпратените профили влизат в администраторския преглед само след действие от потребителя.'],
      ['Администраторска оценка', 'Официалните USG бележки, оценки, готовност за Регистъра и готовност за сертификат остават отделени от гласовете на общността.'],
      ['Решение', 'Администраторът може да одобри профила или да върне корекции, без незавършеният профил да става публичен.'],
      ['Публикация и доверие', 'Публикацията в Регистъра, сертификатът и изборът за Галерията остават отделни администраторски действия.'],
    ],
    actions: {
      registry: 'Отвори админ Регистър',
      guide: 'Отвори ръководството за преглед',
    },
  },
  it: {
    eyebrow: 'Flusso amministrativo',
    title: 'Modera le richieste dei proprietari con una sequenza controllata',
    description:
      'Questo pannello amministrativo mantiene chiaro il percorso: revisione del profilo del proprietario, valutazione ufficiale, approvazione o richiesta di modifiche, pubblicazione nel Registro e solo dopo fiducia del certificato. Non modifica autenticazione, sessione o verifica pubblica.',
    counts: {
      intake: 'Coda in ingresso',
      decision: 'Pronti per la decisione',
      public: 'Livello pubblico di fiducia',
    },
    steps: [
      ['Richiesta del proprietario', 'I profili inviati entrano nella revisione amministrativa solo dopo l’azione dell’utente.'],
      ['Valutazione amministrativa', 'Note ufficiali USG, punteggi, prontezza per il Registro e prontezza per il certificato restano separati dai voti della comunità.'],
      ['Decisione', 'L’amministratore può approvare il profilo o richiedere modifiche senza esporre pubblicamente un lavoro incompleto.'],
      ['Pubblicazione e fiducia', 'Pubblicazione nel Registro, certificato e selezione per la Galleria restano azioni amministrative separate.'],
    ],
    actions: {
      registry: 'Apri Registro amministrativo',
      guide: 'Apri guida alla revisione',
    },
  },
} as const;

export function AdminModerationActionFlowPanel({ locale, summary }: AdminModerationActionFlowPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const decisionReady = summary.submitted + summary.approved + summary.needsChanges;
  const publicTrustCount = summary.published;

  return (
    <section className="admin-moderation-action-flow" aria-label={copy.title}>
      <div className="admin-moderation-action-flow__head">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h3>{copy.title}</h3>
          <p>{copy.description}</p>
        </div>
        <div className="admin-moderation-action-flow__metrics" aria-label="Admin moderation counters">
          <span><strong>{summary.submitted}</strong>{copy.counts.intake}</span>
          <span><strong>{decisionReady}</strong>{copy.counts.decision}</span>
          <span><strong>{publicTrustCount}</strong>{copy.counts.public}</span>
        </div>
      </div>

      <div className="admin-moderation-action-flow__steps">
        {copy.steps.map(([label, description], index) => (
          <article key={label}>
            <span>{index + 1}</span>
            <div>
              <strong>{label}</strong>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="admin-moderation-action-flow__actions">
        <Link href="/admin/registry" className="button-secondary small">{copy.actions.registry}</Link>
        <Link href="/guide?topic=review#review" className="button-ghost small">{copy.actions.guide}</Link>
      </div>
    </section>
  );
}
