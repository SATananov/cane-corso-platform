import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

const copyByLocale = {
  en: {
    eyebrow: 'Admin review path',
    title: 'Make the decision in the right order',
    description:
      'Use the rail as a compact checklist. Photo guidance supports the review, but Registry publication and USG certificate remain human admin decisions.',
    steps: [
      { label: 'Review profile', href: '#review-queue', note: 'identity, data, origin' },
      { label: 'Check photos', href: '#admin-photo-assistant', note: 'readiness and evidence' },
      { label: 'Read guidance', href: '#admin-photo-assistant', note: 'assistant support only' },
      { label: 'Confirm decision', href: '#review-queue', note: 'human judgement' },
      { label: 'Registry / Certificate', href: '#admin-certificate-flow', note: 'separate authority lanes' },
    ],
  },
  bg: {
    eyebrow: 'Админ път за преглед',
    title: 'Вземи решението в правилния ред',
    description:
      'Използвай тази компактна лента като checklist. Насоките за снимки помагат при прегледа, но Регистърът и USG сертификатът остават човешки админ решения.',
    steps: [
      { label: 'Прегледай профила', href: '#review-queue', note: 'идентичност, данни, произход' },
      { label: 'Провери снимките', href: '#admin-photo-assistant', note: 'готовност и доказателства' },
      { label: 'Виж насоките', href: '#admin-photo-assistant', note: 'само помощ за админа' },
      { label: 'Потвърди решение', href: '#review-queue', note: 'човешка преценка' },
      { label: 'Регистър / Сертификат', href: '#admin-certificate-flow', note: 'отделни авторитетни потоци' },
    ],
  },
  it: {
    eyebrow: 'Percorso revisione admin',
    title: 'Prendi la decisione nell’ordine giusto',
    description:
      'Usa questa barra come checklist compatta. La guida foto supporta la revisione, ma Registro e certificato USG restano decisioni umane dell’admin.',
    steps: [
      { label: 'Rivedi profilo', href: '#review-queue', note: 'identità, dati, origine' },
      { label: 'Controlla foto', href: '#admin-photo-assistant', note: 'prontezza ed evidenza' },
      { label: 'Leggi guida', href: '#admin-photo-assistant', note: 'solo supporto admin' },
      { label: 'Conferma decisione', href: '#review-queue', note: 'giudizio umano' },
      { label: 'Registro / Certificato', href: '#admin-certificate-flow', note: 'percorsi separati' },
    ],
  },
} as const;

export function UsgReviewStepsRail({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <section className="usg-review-steps-rail" aria-label={copy.title} data-step130="review-steps-rail">
      <div className="usg-review-steps-rail__head">
        <span className="eyebrow-label">{copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        <p>{copy.description}</p>
      </div>
      <ol className="usg-review-steps-rail__list">
        {copy.steps.map((step, index) => (
          <li key={`${step.label}-${index}`}>
            <Link href={step.href}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step.label}</strong>
              <em>{step.note}</em>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
