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
    summary: 'How it works: complete the profile, add your Cane Corso, then follow the review and public trust status.',
    openLabel: 'How this works',
    actions: ['Open member center', 'Open My Dogs', 'Read the guide'],
    steps: ['Акаунт', 'Профил', 'Cane Corso профил', 'Готовност за преглед', 'Публикуване в Регистъра', 'USG сертификат', 'Галерия / представяне'],
  },
  bg: {
    eyebrow: 'Ясен път на собственика',
    title: 'Един път от акаунт до публично доверие',
    body: 'Пътят на собственика остава прост: създай акаунт, попълни профила, добави Cane Corso, подготви профила, изпрати за преглед и следи Регистър, Сертификат, Проверка и Галерия без смесване на частите.',
    summary: 'Как се работи: попълни профила, добави Cane Corso и следи прегледа и публичния статус.',
    openLabel: 'Как работи това',
    actions: ['Отвори центъра', 'Отвори Моите Cane Corso', 'Виж наръчника'],
    steps: ['Акаунт', 'Профил', 'Cane Corso профил', 'Готовност за преглед', 'Публикация в регистъра', 'USG сертификат', 'Галерия / showcase'],
  },
  it: {
    eyebrow: 'Chiarezza onboarding owner',
    title: 'Un percorso dall’account alla fiducia pubblica',
    body: 'Il percorso del proprietario resta semplice: crea account, completa il profilo, aggiungi Cane Corso, prepara il profilo, invia alla revisione e segui Registro, Certificato, Verifica e Galleria senza confondere le parti.',
    summary: 'Come funziona: completa il profilo, aggiungi il Cane Corso e segui review e stato pubblico.',
    openLabel: 'Come funziona',
    actions: ['Apri centro membri', 'Apri I miei Cane Corso', 'Leggi la guida'],
    steps: ['Account', 'Profilo', 'Profilo Cane Corso', 'Pronto per revisione', 'Pubblicazione nel Registro', 'Certificato USG', 'Galleria / presentazione'],
  },
} as const;

const links = ['/member', '/my-dogs', '/guide?topic=member-workspace#member-workspace'] as const;

export function OwnerOnboardingFinalPanel({ locale, surface }: OwnerOnboardingFinalPanelProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const shouldOpen = surface === 'access';

  return (
    <section className={`content-card owner-onboarding-final-panel owner-onboarding-final-panel--${surface}`} aria-label={copy.title}>
      <details className="owner-onboarding-final-panel__details" open={shouldOpen}>
        <summary className="owner-onboarding-final-panel__summary">
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <strong>{copy.title}</strong>
          <span>{copy.summary}</span>
          <em>{copy.openLabel}</em>
        </summary>
        <div className="owner-onboarding-final-panel__body">
          <div className="owner-onboarding-final-panel__copy">
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
        </div>
      </details>
    </section>
  );
}
