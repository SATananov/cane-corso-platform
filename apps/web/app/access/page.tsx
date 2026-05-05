import { MemberAccessPanel } from '@/components/member-access-panel';
import { InfoPanelGrid } from '@/components/info-panel-grid';
import { OwnerOnboardingFinalPanel } from '@/components/owner-onboarding-final-panel';
import { getOptionalCookieMemberSession } from '@/lib/session.server';
import type { AccessIntent, AccessNotice } from '@/lib/access-control';
import { isDevelopmentAccessEnabled } from '@/lib/runtime-env';
import { getCurrentLocale } from '@/lib/locale.server';

export const dynamic = 'force-dynamic';

interface AccessPageProps {
  searchParams: Promise<{
    intent?: string;
    notice?: string;
    next?: string;
    debug?: string;
  }>;
}

function normalizeIntent(value: string | undefined): AccessIntent {
  return value === 'partner' ? 'partner' : 'member';
}

function normalizeNotice(value: string | undefined): AccessNotice | null {
  if (
    value === 'member_required' ||
    value === 'partner_required' ||
    value === 'admin_required' ||
    value === 'signed_out'
  ) {
    return value;
  }

  return null;
}

export default async function AccessPage({ searchParams }: AccessPageProps) {
  const currentSession = await getOptionalCookieMemberSession();
  const locale = await getCurrentLocale();
  const params = await searchParams;

  const copyByLocale = {
    en: {
      flow: {
        eyebrow: 'Access path',
        title: 'A clear threshold before the deeper platform layers open',
        description:
          'This page explains how guest access, member accounts, partner applications, and protected moderation fit together before the visitor takes the next step.',
        cards: [
          { eyebrow: 'Step 1', title: 'Explore as a guest first', description: 'The public platform, registry, verification, knowledge, partners, and community areas can be explored before registration.', href: '/platform', meta: 'Guest • public orientation', icon: 'platform' as const },
          { eyebrow: 'Step 2', title: 'Create a personal member account', description: 'Every deeper path starts with a real person and a personal identity inside the platform.', href: '/access?intent=member', meta: 'Member • personal identity', icon: 'member' as const },
          { eyebrow: 'Step 3', title: 'Apply as a partner after the personal account exists', description: 'Businesses and professionals stay connected to the person responsible for the application.', href: '/access?intent=partner', meta: 'Partner • application • review', icon: 'partners' as const },
          { eyebrow: 'Step 4', title: 'Public visibility always waits for review', description: 'Cane Corso profiles, partner pages, and future ecosystem listings are reviewed before visitors see them.', href: '/guide?topic=access#access', meta: 'Review • publication • trust', icon: 'verify' as const },
        ],
      },
      contract: {
        eyebrow: 'Platform clarity',
        title: 'What should be clear before you continue',
        description:
          'Access, trust, and publication are separate layers. This page keeps those rules visible so members and partners always know what comes next.',
        cards: [
          { eyebrow: 'Registry', title: 'Registry is the official publication layer', description: 'Public Cane Corso profiles appear in the registry only after review and publication.', href: '/registry', meta: 'Official • published profiles', icon: 'registry' as const },
          { eyebrow: 'Certificate', title: 'Certificate trust is a separate decision', description: 'Publication in the registry does not automatically create certificate trust.', href: '/verify', meta: 'Separate trust layer', icon: 'verify' as const },
          { eyebrow: 'Community', title: 'Community adds life without replacing the registry', description: 'Community areas stay useful and moderated while the registry remains the official public record.', href: '/community', meta: 'Community • moderated usefulness', icon: 'community' as const },
          { eyebrow: 'Help', title: 'The guide explains how the layers fit together', description: 'Use the guide whenever you want a clear map of access, review, publication, and trust.', href: '/guide?topic=official-community#official-community', meta: 'Guide • clear orientation', icon: 'guide' as const },
        ],
      },
      action: 'Open',
    },
    bg: {
      flow: {
        eyebrow: 'Път на достъпа',
        title: 'Ясен път към по-дълбок достъп',
        description:
          'Тази страница подрежда пътя: гост, членски акаунт, партньорска кандидатура и защитена модерация.',
        cards: [
          { eyebrow: 'Стъпка 1', title: 'Първо разгледай като гост', description: 'Публичната платформа, регистърът, проверката, знанията, партньорите и общността могат да се разглеждат и преди регистрация.', href: '/platform', meta: 'Гост • публична ориентация', icon: 'platform' as const },
          { eyebrow: 'Стъпка 2', title: 'Създай личен членски акаунт', description: 'Всеки по-дълбок път започва с реален човек и лична идентичност в платформата.', href: '/access?intent=member', meta: 'Член • лична идентичност', icon: 'member' as const },
          { eyebrow: 'Стъпка 3', title: 'Партньорски път след личния акаунт', description: 'Бизнесът или услугата остават свързани с човека, който отговаря за кандидатурата.', href: '/access?intent=partner', meta: 'Партньор • кандидатура • преглед', icon: 'partners' as const },
          { eyebrow: 'Стъпка 4', title: 'Публикуване само след преглед', description: 'Cane Corso профили, партньорски страници и бъдещи обяви стават публични само след преглед.', href: '/guide?topic=access#access', meta: 'Преглед • публикация • доверие', icon: 'verify' as const },
        ],
      },
      contract: {
        eyebrow: 'Яснота на платформата',
        title: 'Какво трябва да е ясно преди следващата стъпка',
        description:
          'Достъпът, доверието и публикуването са отделни слоеве. Тази страница държи правилата видими, за да знаят членовете и партньорите какво следва.',
        cards: [
          { eyebrow: 'Регистър', title: 'Регистърът е официалният публичен слой', description: 'Публичните Cane Corso профили се появяват в регистъра само след преглед и публикуване.', href: '/registry', meta: 'Официално • публикувани профили', icon: 'registry' as const },
          { eyebrow: 'Сертификат', title: 'Сертификатът е отделно решение', description: 'Публикуването в регистъра не означава автоматичен USG сертификат.', href: '/verify', meta: 'Отделен слой на доверие', icon: 'verify' as const },
          { eyebrow: 'Общност', title: 'Общността не заменя регистъра', description: 'Общността добавя полезност и живот, но официалният публичен запис остава регистърът.', href: '/community', meta: 'Общност • модерирана полезност', icon: 'community' as const },
          { eyebrow: 'Помощ', title: 'Наръчник за слоевете на платформата', description: 'Използвай наръчника за ясна карта на достъп, преглед, публикуване и доверие.', href: '/guide?topic=official-community#official-community', meta: 'Наръчник • ясна ориентация', icon: 'guide' as const },
        ],
      },
      action: 'Отвори',
    },
    it: {
      flow: {
        eyebrow: 'Percorso di accesso',
        title: 'Percorso chiaro verso i livelli profondi',
        description:
          'Questa pagina collega accesso ospite, account membro, candidatura partner e moderazione protetta prima del passo successivo.',
        cards: [
          { eyebrow: 'Passo 1', title: 'Esplora come ospite', description: 'La piattaforma pubblica, il registro, la verifica, la conoscenza, i partner e la comunità possono essere esplorati anche prima della registrazione.', href: '/platform', meta: 'Ospite • orientamento pubblico', icon: 'platform' as const },
          { eyebrow: 'Passo 2', title: 'Crea un account membro', description: 'Ogni percorso riservato inizia da una persona reale e da un’identità chiara nella piattaforma.', href: '/access?intent=member', meta: 'Membro • identità personale', icon: 'member' as const },
          { eyebrow: 'Passo 3', title: 'Candidati come partner', description: 'Attività e professionisti restano collegati alla persona responsabile della candidatura.', href: '/access?intent=partner', meta: 'Partner • candidatura • revisione', icon: 'partners' as const },
          { eyebrow: 'Passo 4', title: 'Pubblicazione dopo revisione', description: 'Profili Cane Corso, pagine partner e annunci futuri vengono revisionati prima della visibilità pubblica.', href: '/guide?topic=access#access', meta: 'Revisione • pubblicazione • fiducia', icon: 'verify' as const },
        ],
      },
      contract: {
        eyebrow: 'Chiarezza della piattaforma',
        title: 'Regole chiare prima di continuare',
        description:
          'Accesso, fiducia e pubblicazione restano livelli separati. Questa pagina rende visibili le regole prima del passo successivo.',
        cards: [
          { eyebrow: 'Registro', title: 'Registro: livello ufficiale', description: 'I profili Cane Corso pubblici appaiono nel registro solo dopo revisione e pubblicazione.', href: '/registry', meta: 'Ufficiale • profili pubblicati', icon: 'registry' as const },
          { eyebrow: 'Certificato', title: 'Certificato: decisione separata', description: 'La pubblicazione nel registro non crea automaticamente un certificato USG.', href: '/verify', meta: 'Livello di fiducia separato', icon: 'verify' as const },
          { eyebrow: 'Comunità', title: 'Comunità senza sostituire il registro', description: 'Le aree della comunità restano utili e moderate; il registro resta il riferimento pubblico ufficiale.', href: '/community', meta: 'Comunità • utilità moderata', icon: 'community' as const },
          { eyebrow: 'Aiuto', title: 'Guida ai livelli della piattaforma', description: 'Usa la guida quando vuoi una mappa chiara di accesso, revisione, pubblicazione e fiducia.', href: '/guide?topic=official-community#official-community', meta: 'Guida • orientamento chiaro', icon: 'guide' as const },
        ],
      },
      action: 'Apri',
    },
  } as const;

  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <main className="member-route-stack access-page">
      <MemberAccessPanel
        initialIntent={normalizeIntent(params.intent)}
        notice={normalizeNotice(params.notice)}
        nextPath={params.next ?? null}
        showDevelopmentTools={isDevelopmentAccessEnabled() && params.debug === '1'}
        currentSession={
          currentSession
            ? {
                displayName: currentSession.user.displayName,
                email: currentSession.user.email,
                role: currentSession.user.role,
              }
            : null
        }
      />

      <InfoPanelGrid
        eyebrow={copy.flow.eyebrow}
        title={copy.flow.title}
        description={copy.flow.description}
        cards={copy.flow.cards}
        actionLabel={copy.action}
        ariaLabel={copy.flow.title}
      />

      <InfoPanelGrid
        eyebrow={copy.contract.eyebrow}
        title={copy.contract.title}
        description={copy.contract.description}
        cards={copy.contract.cards}
        actionLabel={copy.action}
        ariaLabel={copy.contract.title}
      />

      <OwnerOnboardingFinalPanel locale={locale} surface="access" />
    </main>
  );
}
