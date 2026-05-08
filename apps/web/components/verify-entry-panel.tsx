"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/i18n';

const copyByLocale = {
  en: {
    labels: {
      panel: 'Verify certificate',
      title: 'Open a real certificate record',
      description:
        'Paste a certificate code or verification slug to load the public trust record for a published Cane Corso profile.',
      inputLabel: 'Certificate code or verification slug',
      placeholder: 'USG-20260416-3E7801',
      submit: 'Open verification',
      registry: 'Browse registry',
      helper: 'Use the exact code printed on the certificate, or open a profile from the public registry and continue from there.',
      trustEyebrow: 'What Verify confirms',
      trustTitle: 'Public trust works in clear steps',
      trustBullets: [
        'Verify confirms an active public certificate record, not just any private draft or owner workspace entry.',
        'The certificate must be active and tied to a published public profile to appear here.',
        'The goal is trust and clarity for visitors, breeders, and future owners.',
      ],
      distinctionEyebrow: 'Important distinction',
      distinctionTitle: 'Registry publication and certificate trust are not the same thing',
      distinctionBody:
        'A Cane Corso can be publicly visible in the registry without automatically receiving a certificate. Verify should stay reserved for active certificate trust.',
      guide: 'Open guide',
    },
  },
  bg: {
    labels: {
      panel: 'Провери сертификат',
      title: 'Отвори реален сертификатен запис',
      description:
        'Постави код на сертификат или код за проверка, за да заредиш публичния запис за доверие на публикуван Cane Corso профил.',
      inputLabel: 'Код на сертификат или код за проверка',
      placeholder: 'USG-20260416-3E7801',
      submit: 'Отвори проверката',
      registry: 'Разгледай регистъра',
      helper: 'Използвай точния код от сертификата или отвори профил от публичния регистър и продължи оттам.',
      trustEyebrow: 'Какво потвърждава проверката',
      trustTitle: 'Публичното доверие работи през ясни стъпки',
      trustBullets: [
        'Проверката потвърждава активен публичен сертификатен запис, а не просто която и да е чернова или личен запис.',
        'Сертификатът трябва да е активен и свързан с публикуван публичен профил, за да се появи тук.',
        'Целта е доверие и яснота за посетители, развъдници и бъдещи собственици.',
      ],
      distinctionEyebrow: 'Важно разграничение',
      distinctionTitle: 'Публикуването в регистъра и сертификатното доверие не са едно и също',
      distinctionBody:
        'Cane Corso може да е публично видим в регистъра, без автоматично да получава сертификат. Страницата за проверка трябва да остане запазена за активното сертификатно доверие.',
      guide: 'Отвори guide',
    },
  },
  it: {
    labels: {
      panel: 'Verifica certificato',
      title: 'Apri un record certificato reale',
      description:
        'Incolla un codice certificato o uno slug di verifica per caricare il record pubblico di fiducia di un profilo Cane Corso pubblicato.',
      inputLabel: 'Codice certificato o slug di verifica',
      placeholder: 'USG-20260416-3E7801',
      submit: 'Apri verifica',
      registry: 'Esplora il registro',
      helper: 'Usa il codice esatto stampato sul certificato, oppure apri un profilo dal registro pubblico e continua da lì.',
      trustEyebrow: 'Cosa conferma Verify',
      trustTitle: 'La fiducia pubblica funziona per passaggi chiari',
      trustBullets: [
        'La verifica conferma un record certificato pubblico attivo, non una bozza privata o una voce dello spazio del proprietario.',
        'Il certificato deve essere attivo e collegato a un profilo pubblico pubblicato per apparire qui.',
        'L’obiettivo è fiducia e chiarezza per visitatori, allevatori e futuri proprietari.',
      ],
      distinctionEyebrow: 'Distinzione importante',
      distinctionTitle: 'Pubblicazione nel registro e fiducia del certificato non sono la stessa cosa',
      distinctionBody:
        'Un Cane Corso può essere visibile pubblicamente nel registro senza ricevere automaticamente un certificato. La verifica dovrebbe restare riservata alla fiducia certificata attiva.',
      guide: 'Apri guida',
    },
  },
} as const;

interface VerifyEntryPanelProps {
  locale: Locale;
}

function normalizeCandidate(value: string) {
  return value.trim();
}

export function VerifyEntryPanel({ locale }: VerifyEntryPanelProps) {
  const router = useRouter();
  const [candidate, setCandidate] = useState('');
  const copy = useMemo(() => copyByLocale[locale] ?? copyByLocale.en, [locale]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCandidate = normalizeCandidate(candidate);

    if (!normalizedCandidate) {
      return;
    }

    router.push(`/verify/${encodeURIComponent(normalizedCandidate)}`);
  }

  return (
    <div className="content-grid two-columns-wide-right verify-entry-layout">
      <section className="content-card verify-result-card verify-entry-card">
        <span className="eyebrow-label">{copy.labels.panel}</span>
        <h2>{copy.labels.title}</h2>
        <p>{copy.labels.description}</p>

        <form className="verify-entry-form" onSubmit={handleSubmit}>
          <label className="verify-entry-form__label" htmlFor="verification-candidate">
            {copy.labels.inputLabel}
          </label>
          <div className="verify-entry-form__row">
            <input
              id="verification-candidate"
              name="verification-candidate"
              type="text"
              className="verify-entry-form__input"
              value={candidate}
              onChange={(event) => setCandidate(event.target.value)}
              placeholder={copy.labels.placeholder}
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className="button-primary">
              {copy.labels.submit}
            </button>
          </div>
        </form>

        <p className="verify-entry-form__helper">{copy.labels.helper}</p>

        <div className="verify-entry-card__codes">
          <span className="verify-entry-card__code-chip">USG-20260416-3E7801</span>
          <span className="verify-entry-card__code-chip">USG-20260421-1A90CF</span>
          <span className="verify-entry-card__code-chip">certificate code</span>
        </div>

        <div className="verify-result-card__actions">
          <Link href="/registry" className="button-secondary small">
            {copy.labels.registry}
          </Link>
          <Link href="/guide?topic=registry#registry" className="button-ghost small">
            {copy.labels.guide}
          </Link>
        </div>
      </section>

      <aside className="side-stack">
        <section className="side-info-card side-info-card--official-trust">
          <div className="official-trust-seal official-trust-seal--side" aria-label="Official UNICO SUO GENERE seal">
            <img src="/brand/seal/usg-official-seal-compact.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <span>USG</span>
            <small>Official seal</small>
          </div>
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
