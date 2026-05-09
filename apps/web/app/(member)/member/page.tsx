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
    eyebrow: 'Private start',
    title: 'What do you want to do now?',
    description: 'This is your working area. Start with your Cane Corso profile, owner data, requests, or the knowledge you need.',
    primary: { href: '/my-dogs', label: 'Open My Cane Corso', meta: 'profiles, photos, measurements, status' },
    secondary: [
      { href: '/my-dogs/new', label: 'Add Cane Corso', meta: 'new private profile' },
      { href: '/profile', label: 'Owner profile', meta: 'your details' },
      { href: '/ecosystem', label: 'My requests', meta: 'community and services' },
      { href: '/knowledge', label: 'Learn first', meta: 'standard, care, USG' },
    ],
    statusTitle: 'Current status',
    statusText: 'Below you see real next actions from your account. Long explanations are kept in Knowledge and FAQ.',
  },
  bg: {
    eyebrow: 'Личен старт',
    title: 'Какво искаш да направиш сега?',
    description: 'Това е работната ти зона. Започни от профила на твоето Cane Corso, данните за собственика, заявките или нужната информация.',
    primary: { href: '/my-dogs', label: 'Към моето Cane Corso', meta: 'профили, снимки, измервания, статус' },
    secondary: [
      { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'нов личен профил' },
      { href: '/profile', label: 'Профил на собственика', meta: 'твоите данни' },
      { href: '/ecosystem', label: 'Моите заявки', meta: 'общност и услуги' },
      { href: '/knowledge', label: 'Научи първо', meta: 'стандарт, грижа, USG' },
    ],
    statusTitle: 'Текущ статус',
    statusText: 'По-долу виждаш реалните следващи действия от твоя акаунт. Дългите обяснения са в Знания и Помощ.',
  },
  it: {
    eyebrow: 'Start privato',
    title: 'Cosa vuoi fare adesso?',
    description: 'Questa è la tua area di lavoro. Inizia dal profilo del tuo Cane Corso, dai dati proprietario, dalle richieste o dalle informazioni utili.',
    primary: { href: '/my-dogs', label: 'Vai al mio Cane Corso', meta: 'profili, foto, misure, stato' },
    secondary: [
      { href: '/my-dogs/new', label: 'Aggiungi Cane Corso', meta: 'nuovo profilo privato' },
      { href: '/profile', label: 'Profilo proprietario', meta: 'i tuoi dati' },
      { href: '/ecosystem', label: 'Le mie richieste', meta: 'comunità e servizi' },
      { href: '/knowledge', label: 'Prima informati', meta: 'standard, cura, USG' },
    ],
    statusTitle: 'Stato attuale',
    statusText: 'Sotto trovi le prossime azioni reali del tuo account. Le spiegazioni lunghe restano in Conoscenze e Aiuto.',
  },
} as const;

export default async function MemberCommandCenterPage() {
  try {
    const locale = await getCurrentLocale();
    const document = await getCurrentOwnerCenterDocument();
    const copy = copyByLocale[locale] ?? copyByLocale.en;

    return (
      <main className="member-route-stack member-home-reset">
        <section className="route-hero-card route-hero-card--member route-hero-card--user-first">
          <div>
            <span className="eyebrow-label">{copy.eyebrow}</span>
            <h1 className="route-title">{copy.title}</h1>
            <p className="route-copy">{copy.description}</p>
          </div>
          <div className="route-hero-actions route-hero-actions--vertical">
            <Link href={copy.primary.href} className="button-primary">
              {copy.primary.label}
              <small>{copy.primary.meta}</small>
            </Link>
          </div>
        </section>

        <section className="member-start-grid" aria-label={copy.title}>
          {copy.secondary.map((item) => (
            <Link href={item.href} className="member-start-card" key={item.href}>
              <strong>{item.label}</strong>
              <span>{item.meta}</span>
            </Link>
          ))}
        </section>

        <section className="content-card member-status-card">
          <span className="eyebrow-label">{copy.statusTitle}</span>
          <p>{copy.statusText}</p>
        </section>

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
