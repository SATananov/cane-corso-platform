import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

interface OwnerOnboardingFinalPanelProps {
  locale: Locale;
  surface: 'access' | 'profile' | 'member';
}

const copyByLocale = {
  en: {
    eyebrow: 'Owner onboarding clarity',
    title: 'One path from account to public trust',
    body: 'The owner journey stays simple: create the account, complete the owner profile, add a Cane Corso, prepare the profile, submit for review, then follow Registry, Certificate, Verify, and Gallery status without mixing the layers.',
    actions: ['Open member center', 'Open My Dogs', 'Read the guide'],
    steps: ['Account', 'Profile', 'Cane Corso profile', 'Review readiness', 'Registry publication', 'USG certificate', 'Gallery / showcase'],
  },
  bg: {
    eyebrow: 'Ясен път на собственика',
    title: 'Един път от акаунт до публично доверие',
    body: 'Пътят на собственика остава прост: създай акаунт, попълни профила, добави Cane Corso, подготви профила, изпрати за преглед и следи Registry, Certificate, Verify и Gallery статусите без смесване на слоевете.',
    actions: ['Отвори центъра', 'Отвори My Dogs', 'Виж наръчника'],
    steps: ['Акаунт', 'Профил', 'Cane Corso профил', 'Готовност за преглед', 'Публикация в регистъра', 'USG сертификат', 'Галерия / showcase'],
  },
  it: {
    eyebrow: 'Chiarezza onboarding owner',
    title: 'Un percorso dall’account alla fiducia pubblica',
    body: 'Il percorso owner resta semplice: crea account, completa profilo, aggiungi Cane Corso, prepara il profilo, invia in review e segui Registry, Certificate, Verify e Gallery senza confondere i layer.',
    actions: ['Apri centro membro', 'Apri My Dogs', 'Leggi la guida'],
    steps: ['Account', 'Profilo', 'Profilo Cane Corso', 'Review readiness', 'Pubblicazione Registry', 'Certificato USG', 'Gallery / showcase'],
  },
} as const;

const links = ['/member', '/my-dogs', '/guide?topic=member-workspace#member-workspace'] as const;

export function OwnerOnboardingFinalPanel({ locale, surface }: OwnerOnboardingFinalPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <section className={`content-card owner-onboarding-final-panel owner-onboarding-final-panel--${surface}`} aria-label={copy.title}>
      <div className="owner-onboarding-final-panel__copy">
        <span className="eyebrow-label">{copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
        <div className="owner-onboarding-final-panel__actions">
          {copy.actions.map((action, index) => (
            <Link className={index === 0 ? 'button-primary small' : 'button-secondary small'} href={links[index]} key={action}>
              {action}
            </Link>
          ))}
        </div>
      </div>
      <ol className="owner-onboarding-final-panel__steps">
        {copy.steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
    </section>
  );
}
