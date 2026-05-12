import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import type { VerificationDocument } from '@cane-corso-platform/contracts';
import { VerifyCertificateTrustContinuityPanel } from '@/components/verify-certificate-trust-continuity-panel';

const copyByLocale = {
  en: {
    labels: {
      result: 'Verification result',
      notFoundTitle: 'Verification record not found',
      notFoundDescription: 'The code you opened does not match an active public Cane Corso certificate in the current registry.',
      verifiedTitle: 'Active public Cane Corso certificate',
      certificate: 'Certificate code',
      status: 'Status',
      dog: 'Cane Corso',
      owner: 'Owner',
      location: 'Location',
      publishedAt: 'Published',
      communityRating: 'Community rating',
      adminAssessment: 'USG assessment',
      noCommunityVotes: 'No community votes yet',
      awaitingAdminAssessment: 'Awaiting USG assessment',
      votes: 'votes',
      openProfile: 'Open public profile',
      backToRegistry: 'Back to registry',
      openGuide: 'Open guide',
      unknown: 'Unknown',
      trustEyebrow: 'What was verified',
      trustTitle: 'This page confirms an active certificate record',
      trustBullets: [
        'The code is tied to an active public certificate.',
        'The certificate belongs to a published Cane Corso profile in the registry.',
        'Verify confirms trust visibility for visitors, but does not replace the full public profile.',
      ],
      distinctionEyebrow: 'Trust distinction',
      distinctionTitle: 'A registry profile and a certificate record remain separate layers',
      distinctionBody:
        'Public registry visibility can exist without automatic certificate issuance. Verify remains reserved for the active certificate layer only.',
    },
  },
  bg: {
    labels: {
      result: 'Резултат от проверката',
      notFoundTitle: 'Не е намерен запис за проверка',
      notFoundDescription: 'Кодът, който отвори, не съвпада с активен публичен Cane Corso сертификат в текущия регистър.',
      verifiedTitle: 'Активен публичен Cane Corso сертификат',
      certificate: 'Код на сертификата',
      status: 'Статус',
      dog: 'Cane Corso',
      owner: 'Собственик',
      location: 'Локация',
      publishedAt: 'Публикуван',
      communityRating: 'Оценка от общността',
      adminAssessment: 'USG оценка',
      noCommunityVotes: 'Все още няма оценки от общността',
      awaitingAdminAssessment: 'Очаква USG оценка',
      votes: 'гласа',
      openProfile: 'Отвори публичния профил',
      backToRegistry: 'Назад към регистъра',
      openGuide: 'Отвори наръчника',
      unknown: 'Неизвестно',
      trustEyebrow: 'Какво беше потвърдено',
      trustTitle: 'Тази страница потвърждава активен сертификатен запис',
      trustBullets: [
        'Кодът е свързан с активен публичен сертификат.',
        'Сертификатът принадлежи на публикуван Cane Corso профил в регистъра.',
        'Проверката потвърждава доверието за посетителя, но не заменя целия публичен профил.',
      ],
      distinctionEyebrow: 'Разграничение на доверието',
      distinctionTitle: 'Профилът в регистъра и сертификатният запис остават отделни слоеве',
      distinctionBody:
        'Публичната видимост в регистъра може да съществува и без автоматично издаден сертификат. Проверката остава запазена само за активния сертификатен слой.',
    },
  },
  it: {
    labels: {
      result: 'Risultato verifica',
      notFoundTitle: 'Record di verifica non trovato',
      notFoundDescription: 'Il codice aperto non corrisponde a un certificato pubblico Cane Corso attivo nel registro corrente.',
      verifiedTitle: 'Certificato pubblico Cane Corso attivo',
      certificate: 'Codice certificato',
      status: 'Stato',
      dog: 'Cane Corso',
      owner: 'Proprietario',
      location: 'Località',
      publishedAt: 'Pubblicato',
      communityRating: 'Valutazione community',
      adminAssessment: 'Valutazione USG',
      noCommunityVotes: 'Nessun voto della community',
      awaitingAdminAssessment: 'In attesa della valutazione USG',
      votes: 'voti',
      openProfile: 'Apri il profilo pubblico',
      backToRegistry: 'Torna al registro',
      openGuide: 'Apri guida',
      unknown: 'Sconosciuto',
      trustEyebrow: 'Cosa è stato verificato',
      trustTitle: 'Questa pagina conferma un record certificato attivo',
      trustBullets: [
        'Il codice è collegato a un certificato pubblico attivo.',
        'Il certificato appartiene a un profilo Cane Corso pubblicato nel registro.',
        'Verify conferma la fiducia per il visitatore, ma non sostituisce il profilo pubblico completo.',
      ],
      distinctionEyebrow: 'Distinzione di fiducia',
      distinctionTitle: 'Profilo del registro e record certificato restano layer separati',
      distinctionBody:
        'La visibilità pubblica nel registro può esistere senza emissione automatica del certificato. Verify resta riservato solo al layer certificato attivo.',
    },
  },
} as const;

interface VerificationResultPanelProps {
  document: VerificationDocument | null;
  locale: Locale;
  code: string;
}

function formatDateLabel(locale: Locale, value: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(new Date(value));
}

function formatLocation(city: string | null, country: string | null, fallback: string) {
  const parts = [city, country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : fallback;
}

function formatVerificationCommunityRating(document: VerificationDocument, copy: (typeof copyByLocale)[keyof typeof copyByLocale]) {
  const rating = document.entry.communityRating;

  if (rating.averageRating == null || rating.totalRatings === 0) {
    return copy.labels.noCommunityVotes;
  }

  return `${rating.averageRating}/5 • ${rating.totalRatings} ${copy.labels.votes}`;
}

function formatVerificationAdminAssessment(document: VerificationDocument, copy: (typeof copyByLocale)[keyof typeof copyByLocale]) {
  const score = document.entry.adminAssessment?.overallScore;

  if (score == null) {
    return copy.labels.awaitingAdminAssessment;
  }

  return `${score}/5`;
}

export function VerificationResultPanel({ document, locale, code }: VerificationResultPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  if (!document) {
    return (
    <div className="content-grid two-columns-wide-right verify-entry-layout">
      <VerifyCertificateTrustContinuityPanel locale={locale} />
        <section className="content-card verify-result-card">
          <span className="eyebrow-label">{copy.labels.result}</span>
          <h2>{copy.labels.notFoundTitle}</h2>
          <p>{copy.labels.notFoundDescription}</p>
          <div className="verify-result-card__status-strip">
            <div>
              <span className="eyebrow-label">{copy.labels.certificate}</span>
              <strong>{code}</strong>
            </div>
            <div>
              <span className="eyebrow-label">{copy.labels.status}</span>
              <strong>{copy.labels.unknown}</strong>
            </div>
          </div>
          <div className="verify-result-card__actions">
            <Link href="/registry" className="button-secondary small">
              {copy.labels.backToRegistry}
            </Link>
            <Link href="/guide?topic=registry#registry" className="button-ghost small">
              {copy.labels.openGuide}
            </Link>
          </div>
        </section>

        <aside className="side-stack">
          <section className="side-info-card">
            <span className="eyebrow-label">{copy.labels.trustEyebrow}</span>
            <h3>{copy.labels.trustTitle}</h3>
            <ul className="side-bullet-list">
              {copy.labels.trustBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </section>

          <section className="side-info-card compact">
            <span className="eyebrow-label">{copy.labels.distinctionEyebrow}</span>
            <h3>{copy.labels.distinctionTitle}</h3>
            <p>{copy.labels.distinctionBody}</p>
          </section>
        </aside>
      </div>
    );
  }

  const entry = document.entry;

  return (
    <div className="content-grid two-columns-wide-right verify-entry-layout">
      <section className="content-card verify-result-card verify-result-card--verified verify-result-card--official">
        <div className="official-trust-seal official-trust-seal--verify" aria-label="Official UNICO SUO GENERE seal">
          <img src="/brand/seal/usg-official-seal-compact.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <span>USG</span>
          <small>Official seal</small>
        </div>
        <span className="eyebrow-label">{copy.labels.result}</span>
        <h2>{copy.labels.verifiedTitle}</h2>
        <p>{entry.summary || `${entry.dog.name} • ${code}`}</p>

        <div className="verify-result-card__status-strip">
          <div>
            <span className="eyebrow-label">{copy.labels.certificate}</span>
            <strong>{entry.certificate?.certificateCode ?? code}</strong>
          </div>
          <div>
            <span className="eyebrow-label">{copy.labels.status}</span>
            <strong>{entry.certificate?.status ?? copy.labels.unknown}</strong>
          </div>
          <div>
            <span className="eyebrow-label">{copy.labels.communityRating}</span>
            <strong>{formatVerificationCommunityRating(document, copy)}</strong>
          </div>
          <div>
            <span className="eyebrow-label">{copy.labels.adminAssessment}</span>
            <strong>{formatVerificationAdminAssessment(document, copy)}</strong>
          </div>
        </div>

        <dl className="registry-profile-card__meta-grid verify-result-card__meta-grid">
          <div>
            <dt>{copy.labels.certificate}</dt>
            <dd>{entry.certificate?.certificateCode ?? code}</dd>
          </div>
          <div>
            <dt>{copy.labels.status}</dt>
            <dd>{entry.certificate?.status ?? copy.labels.unknown}</dd>
          </div>
          <div>
            <dt>{copy.labels.dog}</dt>
            <dd>{entry.dog.name}</dd>
          </div>
          <div>
            <dt>{copy.labels.owner}</dt>
            <dd>{entry.owner.displayName}</dd>
          </div>
          <div>
            <dt>{copy.labels.location}</dt>
            <dd>{formatLocation(entry.owner.city, entry.owner.country, copy.labels.unknown)}</dd>
          </div>
          <div>
            <dt>{copy.labels.publishedAt}</dt>
            <dd>{formatDateLabel(locale, entry.publishedAt)}</dd>
          </div>
        </dl>

        <div className="verify-result-card__actions">
          <Link href={`/registry/${entry.publicSlug}`} className="button-primary small">
            {copy.labels.openProfile}
          </Link>
          <Link href="/registry" className="button-secondary small">
            {copy.labels.backToRegistry}
          </Link>
        </div>
      </section>

      <aside className="side-stack">
        <section className="side-info-card">
          <span className="eyebrow-label">{copy.labels.trustEyebrow}</span>
          <h3>{copy.labels.trustTitle}</h3>
          <ul className="side-bullet-list">
            {copy.labels.trustBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>

        <section className="side-info-card compact">
          <span className="eyebrow-label">{copy.labels.distinctionEyebrow}</span>
          <h3>{copy.labels.distinctionTitle}</h3>
          <p>{copy.labels.distinctionBody}</p>
        </section>
      </aside>
    </div>
  );
}
