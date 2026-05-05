import { redirect } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { OwnerCenterWorkspace } from '@/components/owner-center-workspace';
import { OwnerOnboardingFinalPanel } from '@/components/owner-onboarding-final-panel';
import { buildAccessPath } from '@/lib/access-control';
import { getCurrentLocale } from '@/lib/locale.server';
import { getCurrentOwnerCenterDocument } from '@/lib/owner-center.server';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

const copyByLocale = {
  en: {
    eyebrow: 'Member Command Center',
    title: 'Owner journey, registry preparation, and public trust in one place',
    description:
      'A calm member home: see what needs action first, then open My Cane Corso when you need to edit or submit.',
    accentLabel: 'USG member command center',
    helpLabel: 'Owner guide',
    heroChips: ['Private owner workspace', 'Review status clarity', 'Public trust readiness'],
    heroNote:
      'This page is a read-only orchestration layer. It does not publish, certify, revoke, verify, moderate, or change backend state.',
    cards: [
      {
        eyebrow: 'My Cane Corso',
        title: 'Manage private profiles and readiness',
        description: 'Open My Dogs when you need to edit profile data, media, pedigree, and preparation quality.',
        href: '/my-dogs',
        meta: 'Private preparation',
      },
      {
        eyebrow: 'Review path',
        title: 'Understand what happens before public trust',
        description: 'Review, publication, registry visibility, certificate trust, and gallery selection remain separate steps.',
        href: '/guide?topic=member-workspace#member-workspace',
        meta: 'Guide and status logic',
      },
      {
        eyebrow: 'Ecosystem',
        title: 'Track places, services, and community entries',
        description: 'Use the ecosystem workspace for trusted Cane Corso services, places, transport, events, and opportunities.',
        href: '/ecosystem',
        meta: 'Reviewed submissions',
      },
    ],
  },
  bg: {
    eyebrow: 'Команден център на члена',
    title: 'Пътят на собственика, подготовката за регистъра и публичното доверие на едно място',
    description:
      'Спокойна членска начална зона: първо виж какво чака действие, после отвори Моите Cane Corso за редакция или изпращане.',
    accentLabel: 'USG команден център на члена',
    helpLabel: 'Наръчник за собственика',
    heroChips: ['Лична зона на собственика', 'Ясен статус на прегледа', 'Готовност за публично доверие'],
    heroNote:
      'Тази страница е read-only orchestration слой. Тя не публикува, не сертифицира, не отнема сертификат, не променя проверката, модерацията или backend състояние.',
    cards: [
      {
        eyebrow: 'Моите Cane Corso',
        title: 'Управлявай личните профили и готовността',
        description: 'Отвори My Dogs, когато трябва да редактираш данни, медия, pedigree и качеството на подготовката.',
        href: '/my-dogs',
        meta: 'Лична подготовка',
      },
      {
        eyebrow: 'Път на прегледа',
        title: 'Разбери какво се случва преди публичното доверие',
        description: 'Прегледът, публикацията, регистърът, сертификатът и галерията остават отделни стъпки.',
        href: '/guide?topic=member-workspace#member-workspace',
        meta: 'Наръчник и статус логика',
      },
      {
        eyebrow: 'Екосистема',
        title: 'Следи места, услуги и общностни записи',
        description: 'Използвай екосистемната зона за доверени Cane Corso услуги, места, транспорт, събития и възможности.',
        href: '/ecosystem',
        meta: 'Прегледани submissions',
      },
    ],
  },
  it: {
    eyebrow: 'Centro comando membro',
    title: 'Percorso owner, preparazione registro e fiducia pubblica in un solo posto',
    description:
      'Una home membro più calma: vedi prima cosa richiede azione, poi apri I miei Cane Corso per modificare o inviare.',
    accentLabel: 'Centro comando membro USG',
    helpLabel: 'Guida owner',
    heroChips: ['Workspace owner privato', 'Chiarezza stato review', 'Prontezza fiducia pubblica'],
    heroNote:
      'Questa pagina è un layer di orchestrazione read-only. Non pubblica, certifica, revoca, verifica, modera o cambia stato backend.',
    cards: [
      {
        eyebrow: 'I miei Cane Corso',
        title: 'Gestisci profili privati e readiness',
        description: 'Apri My Dogs quando devi modificare dati, media, pedigree e qualità di preparazione.',
        href: '/my-dogs',
        meta: 'Preparazione privata',
      },
      {
        eyebrow: 'Percorso review',
        title: 'Capisci cosa avviene prima della fiducia pubblica',
        description: 'Review, pubblicazione, registro, certificato e gallery restano passaggi separati.',
        href: '/guide?topic=member-workspace#member-workspace',
        meta: 'Guida e logica status',
      },
      {
        eyebrow: 'Ecosistema',
        title: 'Segui luoghi, servizi e voci community',
        description: 'Usa il workspace ecosistema per servizi, luoghi, trasporto, eventi e opportunità Cane Corso affidabili.',
        href: '/ecosystem',
        meta: 'Submission revisionate',
      },
    ],
  },
} as const;

export default async function MemberCommandCenterPage() {
  try {
    const locale = await getCurrentLocale();
    const document = await getCurrentOwnerCenterDocument();
    const copy = copyByLocale[locale] ?? copyByLocale.en;

    return (
      <PageShell
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        accentLabel={copy.accentLabel}
        helpHref="/guide?topic=member-workspace#member-workspace"
        helpLabel={copy.helpLabel}
        heroChips={copy.heroChips}
        heroNote={copy.heroNote}
      >
        <OwnerOnboardingFinalPanel locale={locale} surface="member" />
        <OwnerCenterWorkspace document={document} locale={locale} />
      </PageShell>
    );
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      redirect(buildAccessPath({ intent: 'member', notice: 'member_required', next: '/member' }));
    }

    throw error;
  }
}
