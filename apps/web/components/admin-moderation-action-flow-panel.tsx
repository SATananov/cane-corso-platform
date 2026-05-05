
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
    eyebrow: 'Admin action flow',
    title: 'Модерирай owner заявките през една контролирана последователност',
    description:
      'Този админ панел държи operational пътя ясен: преглед на owner профила, официална оценка, одобрение или връщане за корекции, публикация в Registry и чак след това сертификатно доверие. Не променя Auth, session или публичната Verify authority.',
    counts: {
      intake: 'Входяща опашка',
      decision: 'Готови за решение',
      public: 'Публичен trust слой',
    },
    steps: [
      ['Owner submission', 'Изпратените профили влизат в admin review queue само след действие от member.'],
      ['Admin assessment', 'Официалните USG бележки, оценки, Registry readiness и Certificate readiness остават отделени от community vote.'],
      ['Decision action', 'Admin може да одобри профила или да върне корекции без незавършеният профил да става публичен.'],
      ['Publication and trust', 'Registry публикация, сертификат и Gallery selection остават отделни admin-controlled действия.'],
    ],
    actions: {
      registry: 'Отвори Registry admin',
      guide: 'Отвори review guide',
    },
  },
  it: {
    eyebrow: 'Admin action flow',
    title: 'Modera le submission owner con una sequenza controllata',
    description:
      'Questo pannello admin mantiene chiaro il percorso: review del profilo owner, assessment ufficiale, approvazione o richiesta modifiche, pubblicazione Registry e solo dopo fiducia certificato. Non modifica Auth, sessione o autorita pubblica Verify.',
    counts: {
      intake: 'Coda intake',
      decision: 'Pronti decisione',
      public: 'Layer fiducia pubblico',
    },
    steps: [
      ['Owner submission', 'I profili inviati entrano nella coda admin solo dopo l’azione member.'],
      ['Admin assessment', 'Note USG ufficiali, score, Registry readiness e Certificate readiness restano separati dai voti community.'],
      ['Decision action', 'Admin puo approvare il profilo o richiedere modifiche senza esporre lavoro non finito.'],
      ['Publication and trust', 'Pubblicazione Registry, certificato e Gallery curation restano azioni admin separate.'],
    ],
    actions: {
      registry: 'Apri Registry admin',
      guide: 'Apri review guide',
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
