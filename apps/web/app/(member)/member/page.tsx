import { redirect } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { OwnerCenterWorkspace } from '@/components/owner-center-workspace';
import { OwnerOnboardingFinalPanel } from '@/components/owner-onboarding-final-panel';
import { RoleAwareActionPanel } from '@/components/role-aware-action-panel';
import { buildAccessPath } from '@/lib/access-control';
import { getCurrentLocale } from '@/lib/locale.server';
import { getCurrentOwnerCenterDocument } from '@/lib/owner-center.server';
import { SessionUnavailableError } from '@/lib/session.server';
import { SectionContentGuidePanel } from '@/components/section-content-guide-panel';

export const dynamic = 'force-dynamic';

const copyByLocale = {
  en: {
    eyebrow: 'Member Command Center',
    title: 'Your Cane Corso center: action, status, and next step',
    description:
      'Start with what needs action: add a profile, finish a draft, check review status, or continue to your owner workspace.',
    accentLabel: 'USG member command center',
    helpLabel: 'Owner guide',
    heroChips: ['Private owner workspace', 'Review status clarity', 'Public trust readiness'],
    heroNote:
      'Use this page as your personal starting point. Public Registry, Certificate, Verify, Gallery, and Admin decisions remain protected approval layers.',
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
    title: 'Твоят Cane Corso център: действие, статус и следваща стъпка',
    description:
      'Започни от това, което има смисъл сега: добави профил, довърши чернова, провери статус или продължи в личната зона.',
    accentLabel: 'USG команден център на члена',
    helpLabel: 'Наръчник за собственика',
    heroChips: ['Лична зона на собственика', 'Ясен статус на прегледа', 'Готовност за публично доверие'],
    heroNote:
      'Използвай тази страница като личен старт. Публичният Регистър, Сертификатът, Проверка, Галерия и админ решенията остават защитени слоеве за одобрение.',
    cards: [
      {
        eyebrow: 'Моите Cane Corso',
        title: 'Управлявай личните профили и готовността',
        description: 'Отвори „Моите Cane Corso“, когато трябва да редактираш данни, снимки, родословие и качеството на подготовката.',
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
        meta: 'Прегледани заявки',
      },
    ],
  },
  it: {
    eyebrow: 'Centro comando membro',
    title: 'Il tuo centro Cane Corso: azione, stato e prossimo passo',
    description:
      'Inizia da ciò che serve ora: aggiungi un profilo, completa una bozza, controlla lo stato o continua nello spazio del proprietario.',
    accentLabel: 'Centro comando membro USG',
    helpLabel: 'Guida proprietario',
    heroChips: ['Spazio privato del proprietario', 'Chiarezza dello stato di revisione', 'Prontezza fiducia pubblica'],
    heroNote:
      'Usa questa pagina come punto di partenza personale. Registro pubblico, Certificato, Verifica, Galleria e decisioni amministrative restano livelli protetti.',
    cards: [
      {
        eyebrow: 'I miei Cane Corso',
        title: 'Gestisci profili privati e prontezza',
        description: 'Apri I miei Cane Corso quando devi modificare dati, foto, pedigree e qualità della preparazione.',
        href: '/my-dogs',
        meta: 'Preparazione privata',
      },
      {
        eyebrow: 'Percorso revisione',
        title: 'Capisci cosa avviene prima della fiducia pubblica',
        description: 'Revisione, pubblicazione, registro, certificato e galleria restano passaggi separati.',
        href: '/guide?topic=member-workspace#member-workspace',
        meta: 'Guida e logica dello stato',
      },
      {
        eyebrow: 'Ecosistema',
        title: 'Segui luoghi, servizi e voci della comunità',
        description: 'Usa il spazio ecosistema per servizi, luoghi, trasporto, eventi e opportunità Cane Corso affidabili.',
        href: '/ecosystem',
        meta: 'Richieste revisionate',
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
        <RoleAwareActionPanel locale={locale} surface="member" role={document.member.role} />
        <OwnerCenterWorkspace document={document} locale={locale} />
        <OwnerOnboardingFinalPanel locale={locale} surface="member" />
        <SectionContentGuidePanel locale={locale} surface="member" />
      </PageShell>
    );
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      redirect(buildAccessPath({ intent: 'member', notice: 'member_required', next: '/member' }));
    }

    throw error;
  }
}
