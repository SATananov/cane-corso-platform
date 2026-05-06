import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { PageShell } from '@/components/page-shell';
import { OverviewStatCard } from '@/components/overview-stat-card';
import { getCurrentLocale } from '@/lib/locale.server';
import { getReviewQueueDocument, requireReviewAdminSession } from '@/lib/review.server';
import { getPublishedRegistryDocument } from '@/lib/registry.server';
import { getPartnerModerationDocument } from '@/lib/partners.server';
import { getEcosystemModerationDocument } from '@/lib/ecosystem.server';
import { getDb, profiles, users } from '@cane-corso-platform/db';

export const dynamic = 'force-dynamic';

type LocaleKey = 'en' | 'bg' | 'it';

const copyByLocale = {
  en: {
    eyebrow: 'Admin work center',
    title: 'What needs admin action?',
    description:
      'Start with Review. New owner Cane Corso submissions appear there only after the owner sends them for USG review. Registry is for profiles that are already public.',
    actionLabel: 'Open',
    accentLabel: 'USG admin work center',
    visualAlt: 'USG admin work center',
    chips: ['1. Review pending', '2. Check owner data', '3. Publish to Registry', '4. Certificate separately'],
    note:
      'If a member says they uploaded data but you do not see it in Registry, open Review first. If it is not in Review, the owner most likely saved it in My Cane Corso but did not send it for review yet.',
    stats: {
      queue: 'Need review now',
      registry: 'Already public',
      members: 'Owner profiles',
      partners: 'Approved partners',
      ecosystem: 'Ecosystem records',
    },
    cards: {
      review: {
        eyebrow: 'First admin action',
        title: 'Review pending Cane Corso submissions',
        description: 'This is where owner submissions wait for approval, correction, publish decision, or certificate decision.',
        meta: (count: number) => `${count} waiting for admin work`,
      },
      members: {
        eyebrow: 'Find owner data',
        title: 'Members and their Cane Corso profiles',
        description: 'Use this when you need to inspect a user profile, see what the owner has saved, or remove owner-entered data.',
        meta: (count: number) => `${count} active owner profiles`,
      },
      registry: {
        eyebrow: 'Public registry control',
        title: 'Published Registry profiles',
        description: 'Use this only for Cane Corso profiles that are already public in the official Registry and for USG certificate control.',
        meta: (count: number) => `${count} public profiles`,
      },
      partners: {
        eyebrow: 'Partner moderation',
        title: 'Partner applications',
        description: 'Review partner applications, approve trusted businesses, and manage featured visibility in the public directory.',
        meta: (count: number) => `${count} approved partners`,
      },
      ecosystem: {
        eyebrow: 'Community moderation',
        title: 'Ecosystem submissions',
        description: 'Moderate places, services, suggestions, and community listings before they become visible publicly.',
        meta: (count: number) => `${count} ecosystem records`,
      },
    },
    guide: {
      eyebrow: 'How admin work flows',
      title: 'Private owner data is not the public Registry',
      description:
        'Owners first create private Cane Corso profiles. They become admin work only after Send for review. They become Registry records only after admin publish. The USG certificate remains a separate admin decision.',
      review: 'Open review first',
      members: 'Find member data',
      registry: 'Open public Registry control',
      help: 'Help',
    },
  },
  bg: {
    eyebrow: 'Администраторски работен център',
    title: 'Какво чака администраторско действие?',
    description:
      'Започни от Преглед. Новите Cane Corso кандидатури се появяват там само след като собственикът ги изпрати за USG преглед. Регистърът е за вече публичните профили.',
    actionLabel: 'Отвори',
    accentLabel: 'USG администраторски център',
    visualAlt: 'USG администраторски център',
    chips: ['1. Преглед на чакащи', '2. Провери данните на собственика', '3. Публикувай в Регистъра', '4. Сертификат отделно'],
    note:
      'Ако потребител казва, че е качил данни, но не ги виждаш в Регистъра, първо отвори Преглед. Ако ги няма там, най-вероятно са запазени в Моите Cane Corso, но още не са изпратени за преглед.',
    stats: {
      queue: 'Чакат преглед сега',
      registry: 'Вече публични',
      members: 'Профили на собственици',
      partners: 'Одобрени партньори',
      ecosystem: 'Записи в екосистемата',
    },
    cards: {
      review: {
        eyebrow: 'Първо администраторско действие',
        title: 'Преглед на чакащи Cane Corso кандидатури',
        description: 'Тук чакат кандидатурите от собствениците за одобрение, връщане за корекция, публикуване или решение за сертификат.',
        meta: (count: number) => `${count} чакат администраторска работа`,
      },
      members: {
        eyebrow: 'Намери данни за собственика',
        title: 'Потребители и техните Cane Corso профили',
        description: 'Използвай това, когато трябва да отвориш потребителски профил, да видиш какво е запазил собственикът или да премахнеш попълнени данни.',
        meta: (count: number) => `${count} активни профила на собственици`,
      },
      registry: {
        eyebrow: 'Контрол на публичния Регистър',
        title: 'Публикувани профили в Регистъра',
        description: 'Използвай това само за Cane Corso профили, които вече са публични в официалния Регистър, и за USG сертификатен контрол.',
        meta: (count: number) => `${count} публични профила`,
      },
      partners: {
        eyebrow: 'Партньорска модерация',
        title: 'Партньорски кандидатури',
        description: 'Преглеждай кандидатури, одобрявай доверени бизнес профили и управлявай избраната видимост в публичната директория.',
        meta: (count: number) => `${count} одобрени партньора`,
      },
      ecosystem: {
        eyebrow: 'Модерация на общността',
        title: 'Предложения в екосистемата',
        description: 'Модерирай места, услуги, предложения и записи от общността преди да станат публични.',
        meta: (count: number) => `${count} записа в екосистемата`,
      },
    },
    guide: {
      eyebrow: 'Как работи админ потокът',
      title: 'Личните данни на собственика не са публичен Регистър',
      description:
        'Собственикът първо създава личен Cane Corso профил. Той става администраторска работа само след Изпрати за преглед. Става запис в Регистъра само след публикуване от администратор. USG сертификатът остава отделно администраторско решение.',
      review: 'Отвори първо Преглед',
      members: 'Намери потребителски данни',
      registry: 'Отвори контрола на публичния Регистър',
      help: 'Помощ',
    },
  },
  it: {
    eyebrow: 'Centro operativo amministrazione',
    title: 'Cosa richiede un\'azione amministrativa?',
    description:
      'Inizia dalla Revisione. Le nuove candidature Cane Corso compaiono lì solo dopo che il proprietario le invia per la revisione USG. Il Registro è per i profili già pubblici.',
    actionLabel: 'Apri',
    accentLabel: 'Centro operativo USG',
    visualAlt: 'Centro operativo USG',
    chips: ['1. Revisione in attesa', '2. Controlla dati proprietario', '3. Pubblica nel Registro', '4. Certificato separato'],
    note:
      'Se un membro dice di aver caricato dati ma non li vedi nel Registro, apri prima Revisione. Se non sono in Revisione, probabilmente sono salvati in I miei Cane Corso ma non ancora inviati per la revisione.',
    stats: {
      queue: 'Da rivedere ora',
      registry: 'Già pubblici',
      members: 'Profili proprietari',
      partners: 'Partner approvati',
      ecosystem: 'Record ecosistema',
    },
    cards: {
      review: {
        eyebrow: 'Prima azione amministrativa',
        title: 'Revisione delle candidature Cane Corso in attesa',
        description: 'Qui attendono le candidature dei proprietari per approvazione, correzione, pubblicazione o decisione certificato.',
        meta: (count: number) => `${count} richiedono lavoro amministrativo`,
      },
      members: {
        eyebrow: 'Trova dati proprietario',
        title: 'Membri e profili Cane Corso',
        description: 'Usalo per aprire un profilo utente, vedere cosa ha salvato il proprietario o rimuovere dati inseriti.',
        meta: (count: number) => `${count} profili dei proprietari attivi`,
      },
      registry: {
        eyebrow: 'Controllo Registro pubblico',
        title: 'Profili Registro pubblicati',
        description: 'Usalo solo per i profili Cane Corso già pubblici nel Registro ufficiale e per il controllo certificati USG.',
        meta: (count: number) => `${count} profili pubblici`,
      },
      partners: {
        eyebrow: 'Moderazione partner',
        title: 'Candidature partner',
        description: 'Rivedi le candidature partner, approva attività fidate e gestisci la visibilità in evidenza nella directory pubblica.',
        meta: (count: number) => `${count} partner approvati`,
      },
      ecosystem: {
        eyebrow: 'Moderazione comunità',
        title: 'Proposte ecosistema',
        description: 'Modera luoghi, servizi, suggerimenti e segnalazioni della comunità prima che diventino pubblici.',
        meta: (count: number) => `${count} record ecosistema`,
      },
    },
    guide: {
      eyebrow: 'Come funziona il flusso amministratore',
      title: 'I dati privati del proprietario non sono il Registro pubblico',
      description:
        'Il proprietario crea prima un profilo Cane Corso privato. Diventa lavoro amministrativo solo dopo l\'invio per la revisione. Diventa record del Registro solo dopo la pubblicazione da parte dell\'amministratore. Il certificato USG resta una decisione separata dell\'amministratore.',
      review: 'Apri prima Revisione',
      members: 'Trova dati membro',
      registry: 'Apri controllo Registro pubblico',
      help: 'Aiuto',
    },
  },
} as const;

export default async function AdminHomePage() {
  const locale = await getCurrentLocale();
  const copy = copyByLocale[(locale as LocaleKey) ?? 'en'] ?? copyByLocale.en;

  await requireReviewAdminSession();

  const db = getDb();
  const [reviewDocument, registryDocument, partnerDocument, ecosystemDocument, activeMembers] = await Promise.all([
    getReviewQueueDocument(),
    getPublishedRegistryDocument(),
    getPartnerModerationDocument(),
    getEcosystemModerationDocument(),
    db
      .select({ profileId: profiles.id })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(eq(profiles.isActive, true))
      .orderBy(desc(profiles.createdAt)),
  ]);

  const queueCount = reviewDocument.summary.submitted + reviewDocument.summary.needsChanges;
  const registryCount = registryDocument.entries.length;
  const membersCount = activeMembers.length;
  const partnerCount = partnerDocument.summary.approvedPartners;
  const ecosystemCount = ecosystemDocument.summary.total;

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      accentLabel={copy.accentLabel}
      helpHref="/guide?topic=review#review"
      helpLabel={copy.guide.help}
      visualSrc="/brand/seal/usg-seal-wide.png"
      visualAlt={copy.visualAlt}
      visualFit="contain"
      heroChips={copy.chips}
      heroNote={copy.note}
      actionLabel={copy.actionLabel}
      cards={[
        {
          eyebrow: copy.cards.review.eyebrow,
          title: copy.cards.review.title,
          description: copy.cards.review.description,
          href: '/review',
          meta: copy.cards.review.meta(queueCount),
        },
        {
          eyebrow: copy.cards.members.eyebrow,
          title: copy.cards.members.title,
          description: copy.cards.members.description,
          href: '/admin/members',
          meta: copy.cards.members.meta(membersCount),
        },
        {
          eyebrow: copy.cards.registry.eyebrow,
          title: copy.cards.registry.title,
          description: copy.cards.registry.description,
          href: '/admin/registry',
          meta: copy.cards.registry.meta(registryCount),
        },
        {
          eyebrow: copy.cards.partners.eyebrow,
          title: copy.cards.partners.title,
          description: copy.cards.partners.description,
          href: '/admin/partners',
          meta: copy.cards.partners.meta(partnerCount),
        },
        {
          eyebrow: copy.cards.ecosystem.eyebrow,
          title: copy.cards.ecosystem.title,
          description: copy.cards.ecosystem.description,
          href: '/admin/ecosystem',
          meta: copy.cards.ecosystem.meta(ecosystemCount),
        },
      ]}
    >
      <div className="member-route-stack">
        <div className="stats-grid five-up">
          <OverviewStatCard label={copy.stats.queue} value={String(queueCount)} tone="gold" />
          <OverviewStatCard label={copy.stats.registry} value={String(registryCount)} tone="ivory" />
          <OverviewStatCard label={copy.stats.members} value={String(membersCount)} tone="gold" />
          <OverviewStatCard label={copy.stats.partners} value={String(partnerCount)} tone="ivory" />
          <OverviewStatCard label={copy.stats.ecosystem} value={String(ecosystemCount)} tone="gold" />
        </div>

        <section className="content-card admin-guide-card">
          <div>
            <span className="eyebrow-label">{copy.guide.eyebrow}</span>
            <h2>{copy.guide.title}</h2>
            <p>{copy.guide.description}</p>
          </div>
          <div className="admin-guide-card__actions">
            <Link href="/review" className="button-primary small">
              {copy.guide.review}
            </Link>
            <Link href="/admin/members" className="button-secondary small">
              {copy.guide.members}
            </Link>
            <Link href="/admin/registry" className="button-ghost small">
              {copy.guide.registry}
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
