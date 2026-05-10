import Link from 'next/link';
import { redirect } from 'next/navigation';
import { OwnerCenterWorkspace } from '@/components/owner-center-workspace';
import { buildAccessPath } from '@/lib/access-control';
import { getCurrentLocale } from '@/lib/locale.server';
import { getCurrentOwnerCenterDocument } from '@/lib/owner-center.server';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

const copyByLocale = {
  en: {
    eyebrow: 'Private Cane Corso center',
    title: 'Your Cane Corso center',
    description:
      'Add a profile, follow health and growth, keep your owner data ready, and use the community layer when you need trusted places or services.',
    primaryNoDogs: { href: '/my-dogs/new', label: 'Add Cane Corso', meta: 'start with a private profile' },
    primaryWithDogs: { href: '/my-dogs', label: 'Open My Cane Corso', meta: 'profiles, photos, health, status' },
    healthAction: { label: 'Health and growth', meta: 'weight, vaccines, vet notes' },
    cardsLabel: 'Main member actions',
    cards: {
      myDogs: { href: '/my-dogs', label: 'My Cane Corso', meta: 'profiles, photos, measurements, review status' },
      health: { label: 'Health and growth', meta: 'weight, vaccines, deworming, vet notes', noDogMeta: 'add a Cane Corso profile first' },
      profile: { href: '/profile', label: 'Owner profile', meta: 'identity and private contact details' },
      ecosystem: { href: '/ecosystem', label: 'Community and services', meta: 'requests, places, services, matching' },
    },
  },
  bg: {
    eyebrow: 'Личен Cane Corso център',
    title: 'Твоят Cane Corso център',
    description:
      'Добави профил, следи здраве и растеж, поддържай данните на собственика и използвай общността, когато търсиш доверени места или услуги.',
    primaryNoDogs: { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'започни с личен профил' },
    primaryWithDogs: { href: '/my-dogs', label: 'Отвори „Моите Cane Corso“', meta: 'профили, снимки, здраве, статус' },
    healthAction: { label: 'Здраве и растеж', meta: 'тегло, ваксини, бележки от ветеринар' },
    cardsLabel: 'Какво искаш да направиш сега?',
    cards: {
      myDogs: { href: '/my-dogs', label: 'Моите Cane Corso', meta: 'профили, снимки, измервания, статус на преглед' },
      health: { label: 'Здраве и растеж', meta: 'тегло, ваксини, обезпаразитяване, прегледи', noDogMeta: 'първо добави Cane Corso профил' },
      profile: { href: '/profile', label: 'Профил на собственика', meta: 'идентичност и лични контактни данни' },
      ecosystem: { href: '/ecosystem', label: 'Общност и услуги', meta: 'заявки, места, услуги, свързване' },
    },
  },
  it: {
    eyebrow: 'Centro Cane Corso privato',
    title: 'Il tuo centro Cane Corso',
    description:
      'Aggiungi un profilo, segui salute e crescita, mantieni pronti i dati proprietario e usa la community quando cerchi luoghi o servizi affidabili.',
    primaryNoDogs: { href: '/my-dogs/new', label: 'Aggiungi Cane Corso', meta: 'inizia da un profilo privato' },
    primaryWithDogs: { href: '/my-dogs', label: 'Apri I miei Cane Corso', meta: 'profili, foto, salute, stato' },
    healthAction: { label: 'Salute e crescita', meta: 'peso, vaccini, note veterinarie' },
    cardsLabel: 'Azioni principali membro',
    cards: {
      myDogs: { href: '/my-dogs', label: 'I miei Cane Corso', meta: 'profili, foto, misure, stato revisione' },
      health: { label: 'Salute e crescita', meta: 'peso, vaccini, sverminazione, visite', noDogMeta: 'aggiungi prima un profilo Cane Corso' },
      profile: { href: '/profile', label: 'Profilo proprietario', meta: 'identità e contatti privati' },
      ecosystem: { href: '/ecosystem', label: 'Community e servizi', meta: 'richieste, luoghi, servizi, connessioni' },
    },
  },
} as const;

export default async function MemberCommandCenterPage() {
  try {
    const locale = await getCurrentLocale();
    const document = await getCurrentOwnerCenterDocument();
    const copy = copyByLocale[locale] ?? copyByLocale.en;
    const firstDog = document.dogs.items[0] ?? null;
    const hasDogs = document.dogs.total > 0;
    const primary = hasDogs ? copy.primaryWithDogs : copy.primaryNoDogs;
    const healthHref = firstDog ? `/my-dogs/${firstDog.id}/health` : '/my-dogs/new';
    const startCards = [
      copy.cards.myDogs,
      {
        href: healthHref,
        label: copy.cards.health.label,
        meta: hasDogs ? copy.cards.health.meta : copy.cards.health.noDogMeta,
      },
      copy.cards.profile,
      copy.cards.ecosystem,
    ];

    return (
      <main className="member-route-stack member-home-reset member-home-reset--real-user">
        <section className="route-hero-card route-hero-card--member route-hero-card--user-first member-home-hero">
          <div>
            <span className="eyebrow-label">{copy.eyebrow}</span>
            <h1 className="route-title">{copy.title}</h1>
            <p className="route-copy">{copy.description}</p>
          </div>
          <div className="route-hero-actions route-hero-actions--vertical member-home-primary-actions">
            <Link href={primary.href} className="button-primary">
              {primary.label}
              <small>{primary.meta}</small>
            </Link>
            <Link href={healthHref} className="button-secondary">
              {copy.healthAction.label}
              <small>{copy.healthAction.meta}</small>
            </Link>
          </div>
        </section>

        <section className="member-start-grid" data-layout="priority" aria-label={copy.cardsLabel}>
          {startCards.map((item, index) => (
            <Link href={item.href} className={`member-start-card ${index === 0 ? 'member-start-card--primary' : ''}`} key={item.href}>
              <strong>{item.label}</strong>
              <span>{item.meta}</span>
            </Link>
          ))}
        </section>

        {/* read-only orchestration: /member consumes the owner document and routes the user to the right workspace without mutating authority data. */}
        <OwnerCenterWorkspace document={document} locale={locale} />
      </main>
    );
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      redirect(buildAccessPath({ intent: 'member', notice: 'member_required', next: '/member' }));
    }

    throw error;
  }
}
