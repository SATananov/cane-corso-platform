import { redirect } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { EcosystemOwnerWorkspace } from '@/components/ecosystem-owner-workspace';
import { OwnerCenterWorkspace } from '@/components/owner-center-workspace';
import { getCurrentLocale } from '@/lib/locale.server';
import { getCurrentOwnerCenterDocument } from '@/lib/owner-center.server';
import { getOptionalCookieMemberSession } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

const copyByLocale = {
  en: {
    eyebrow: 'Owner Center',
    title: 'Private Cane Corso workspace',
    description:
      'A calm member area for your profile, Cane Corso records, registry preparation, partner applications, and ecosystem entries. Anything public still passes through review first.',
    accentLabel: 'Owner Center governance',
    heroChips: ['Owner profiles', 'Registry preparation', 'Ecosystem entries'],
    heroNote:
      'This area is for preparation and tracking. Registry, Gallery, Certificate, Verify, Review, and Admin stay separate approval and publication layers.',
    cards: [
      {
        eyebrow: 'Private owner layer',
        title: 'Your Cane Corso work starts privately',
        description:
          'Drafts, photos, pedigree details, and profile updates stay in your member area until you decide to submit them for review.',
        meta: 'Private first • review later • public only after approval',
      },
      {
        eyebrow: 'Ecosystem layer',
        title: 'Send useful entries to the platform',
        description:
          'Suggest trusted services, places, transport, events, puppies, adoption, or breeding opportunities for the Cane Corso community.',
        meta: 'Services • places • opportunities',
      },
      {
        eyebrow: 'Trust control',
        title: 'Public visibility remains protected',
        description:
          'Member actions prepare content. Publication, moderation, and certificate decisions remain controlled approval steps.',
        meta: 'No direct public publishing • reviewed flow',
      },
    ],
  },
  bg: {
    eyebrow: 'Център на собственика',
    title: 'Лично Cane Corso пространство',
    description:
      'Спокойна работна зона за твоя профил, Cane Corso записите, подготовката за регистъра, кандидатурите за партньорство и записите в екосистемата. Всичко публично първо минава през преглед.',
    accentLabel: 'Управление на личната зона',
    heroChips: ['Профили на собственика', 'Подготовка за регистъра', 'Записи в екосистемата'],
    heroNote:
      'Тази зона служи за подготовка и проследяване. Регистърът, Галерията, Сертификатът, Verify, Review и Admin секциите остават отделни слоеве за одобрение и публикуване.',
    cards: [
      {
        eyebrow: 'Личен слой',
        title: 'Работата по Cane Corso профила започва лично',
        description:
          'Черновите, снимките, родословието и промените по профила остават в личната зона, докато решиш да ги изпратиш за преглед.',
        meta: 'Първо лично • после преглед • публично само след одобрение',
      },
      {
        eyebrow: 'Екосистемен слой',
        title: 'Изпращай полезни записи към платформата',
        description:
          'Предлагай доверени услуги, места, транспорт, събития, малки Cane Corso, търси дом или възможности за разплод.',
        meta: 'Услуги • места • възможности',
      },
      {
        eyebrow: 'Контрол на доверието',
        title: 'Публичната видимост остава защитена',
        description:
          'Действията на члена подготвят съдържание. Публикуването, модерацията и сертификатите остават отделни стъпки за одобрение.',
        meta: 'Без директно публично публикуване • проследим процес',
      },
    ],
  },
  it: {
    eyebrow: 'Centro proprietario',
    title: 'Spazio privato Cane Corso',
    description:
      'Un’area riservata per profilo, schede Cane Corso, preparazione al registro, candidature partner e voci dell’ecosistema. Tutto ciò che diventa pubblico passa prima dalla revisione.',
    accentLabel: 'Gestione area proprietario',
    heroChips: ['Profili proprietario', 'Preparazione registro', 'Voci ecosistema'],
    heroNote:
      'Questa area serve per preparare e seguire il lavoro. Registro, Gallery, Certificate, Verify, Review e Admin restano livelli separati di approvazione e pubblicazione.',
    cards: [
      {
        eyebrow: 'Livello privato',
        title: 'Il lavoro sul Cane Corso parte in privato',
        description:
          'Bozze, foto, pedigree e aggiornamenti restano nell’area membro finché non decidi di inviarli alla revisione.',
        meta: 'Prima privato • revisione dopo • pubblico solo dopo approvazione',
      },
      {
        eyebrow: 'Livello ecosistema',
        title: 'Invia voci utili alla piattaforma',
        description:
          'Suggerisci servizi affidabili, luoghi, trasporto, eventi, cuccioli, adozione o opportunità di riproduzione per la community Cane Corso.',
        meta: 'Servizi • luoghi • opportunità',
      },
      {
        eyebrow: 'Controllo fiducia',
        title: 'La visibilità pubblica resta protetta',
        description:
          'Le azioni del membro preparano contenuti. Pubblicazione, moderazione e certificati restano passaggi separati di approvazione.',
        meta: 'Nessuna pubblicazione diretta • processo tracciabile',
      },
    ],
  },
} as const;

export default async function EcosystemPage() {
  const currentSession = await getOptionalCookieMemberSession();

  if (!currentSession) {
    redirect('/access?intent=ecosystem');
  }

  const locale = await getCurrentLocale();
  const document = await getCurrentOwnerCenterDocument();
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      cards={copy.cards}
      accentLabel={copy.accentLabel}
      heroChips={copy.heroChips}
      heroNote={copy.heroNote}
    >
      <OwnerCenterWorkspace document={document} locale={locale} />
      <EcosystemOwnerWorkspace document={document.ecosystem} locale={locale} />
    </PageShell>
  );
}
