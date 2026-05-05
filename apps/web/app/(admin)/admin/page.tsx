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
    eyebrow: 'Admin command center',
    title: 'Admin control',
    description:
      'Open the full admin home first, then choose the exact control lane: moderation, members, registry, partners, or ecosystem.',
    actionLabel: 'Open lane',
    chips: ['Review', 'Members', 'Registry', 'Partners', 'Ecosystem'],
    note:
      'Delete member profiles and owner-entered Cane Corso data from Members. Use Review for moderation and approval flow. Use Registry for already public profiles and certificate control.',
    stats: {
      queue: 'Waiting moderation',
      registry: 'Registry live',
      members: 'Active members',
      partners: 'Approved partners',
      ecosystem: 'Ecosystem records',
    },
    cards: {
      review: {
        eyebrow: 'Moderation lane',
        title: 'Review queue',
        description: 'Approve, return for changes, publish, and control certificate flow for Cane Corso submissions.',
        meta: (count: number) => `${count} items in the queue`,
      },
      members: {
        eyebrow: 'Identity lane',
        title: 'Members',
        description: 'Open full user profiles, inspect owned Cane Corso records, and remove member profiles or specific dog data.',
        meta: (count: number) => `${count} active identities`,
      },
      registry: {
        eyebrow: 'Public lane',
        title: 'Registry',
        description: 'Control live registry entries, issue or revoke USG certificates, and inspect public trust presence.',
        meta: (count: number) => `${count} public profiles`,
      },
      partners: {
        eyebrow: 'Business lane',
        title: 'Partners',
        description: 'Review partner applications, approve trusted businesses, and manage featured visibility in the directory.',
        meta: (count: number) => `${count} approved partner profiles`,
      },
      ecosystem: {
        eyebrow: 'Community lane',
        title: 'Ecosystem',
        description: 'Moderate places, services, suggestions, and community-powered listings before they go public.',
        meta: (count: number) => `${count} ecosystem records`,
      },
    },
    guide: {
      eyebrow: 'Admin routing',
      title: 'Use the right lane for the right action',
      description:
        'Members is the safest place for deleting a user profile or removing owner-entered Cane Corso data. Review handles moderation. Registry handles already public trust presence.',
      members: 'Open members',
      review: 'Open review',
      registry: 'Open registry',
      help: 'Help',
    },
  },
  bg: {
    eyebrow: 'Админ команден център',
    title: 'Админ управление',
    description:
      'Първо отвори пълния admin home, после избери точния слой за работа: преглед, потребители, регистър, партньори или екосистема.',
    actionLabel: 'Отвори слоя',
    chips: ['Преглед', 'Потребители', 'Регистър', 'Партньори', 'Екосистема'],
    note:
      'Изтриването на user профили и попълнените от собственика Cane Corso данни става от Потребители. Преглед е за модерация и одобрение. Регистър е за вече публичните профили и сертификатния контрол.',
    stats: {
      queue: 'Чакат модерация',
      registry: 'Публични в регистъра',
      members: 'Активни потребители',
      partners: 'Одобрени партньори',
      ecosystem: 'Записи в екосистемата',
    },
    cards: {
      review: {
        eyebrow: 'Модерационен слой',
        title: 'Преглед',
        description: 'Одобрявай, връщай за корекции, публикувай и управлявай сертификатния поток за Cane Corso кандидатурите.',
        meta: (count: number) => `${count} записа в опашката`,
      },
      members: {
        eyebrow: 'Слой за идентичности',
        title: 'Потребители',
        description: 'Отваряй пълните user профили, виж техните Cane Corso записи и изтривай профили или конкретни Cane Corso данни.',
        meta: (count: number) => `${count} активни идентичности`,
      },
      registry: {
        eyebrow: 'Публичен слой',
        title: 'Регистър',
        description: 'Управлявай живите registry записи, издавай или отнемай USG сертификати и следи публичното доверено присъствие.',
        meta: (count: number) => `${count} публични профила`,
      },
      partners: {
        eyebrow: 'Бизнес слой',
        title: 'Партньори',
        description: 'Преглеждай кандидатурите на партньори, одобрявай trusted business профили и управлявай featured видимостта.',
        meta: (count: number) => `${count} одобрени партньорски профила`,
      },
      ecosystem: {
        eyebrow: 'Общностен слой',
        title: 'Екосистема',
        description: 'Модерирай места, услуги, предложения и community listings преди да станат публични.',
        meta: (count: number) => `${count} записа в екосистемата`,
      },
    },
    guide: {
      eyebrow: 'Админ ориентация',
      title: 'Използвай правилния слой за правилното действие',
      description:
        'Потребители е най-сигурното място за изтриване на user профил или на попълнени от собственика Cane Corso данни. Преглед е за модерация. Регистър е за вече публичното доверено присъствие.',
      members: 'Отвори потребители',
      review: 'Отвори преглед',
      registry: 'Отвори регистъра',
      help: 'Помощ',
    },
  },
  it: {
    eyebrow: 'Centro di comando admin',
    title: 'Controllo admin',
    description:
      'Apri prima la home admin completa e poi scegli il percorso giusto: review, membri, registro, partner o ecosystem.',
    actionLabel: 'Apri percorso',
    chips: ['Review', 'Membri', 'Registro', 'Partner', 'Ecosystem'],
    note:
      'L’eliminazione dei profili utente e dei dati Cane Corso inseriti dal proprietario avviene da Membri. Review serve per la moderazione. Registro serve per i profili già pubblici e per il controllo dei certificati.',
    stats: {
      queue: 'In moderazione',
      registry: 'Pubblici nel registro',
      members: 'Membri attivi',
      partners: 'Partner approvati',
      ecosystem: 'Record ecosystem',
    },
    cards: {
      review: {
        eyebrow: 'Percorso moderazione',
        title: 'Review',
        description: 'Approva, rimanda per modifiche, pubblica e gestisci il flusso certificato per le candidature Cane Corso.',
        meta: (count: number) => `${count} elementi in coda`,
      },
      members: {
        eyebrow: 'Percorso identità',
        title: 'Membri',
        description: 'Apri i profili utente completi, controlla i Cane Corso posseduti e rimuovi profili o dati specifici del Cane Corso.',
        meta: (count: number) => `${count} identità attive`,
      },
      registry: {
        eyebrow: 'Percorso pubblico',
        title: 'Registro',
        description: 'Gestisci le schede live del registro, emetti o revoca certificati USG e controlla la presenza pubblica di fiducia.',
        meta: (count: number) => `${count} profili pubblici`,
      },
      partners: {
        eyebrow: 'Percorso business',
        title: 'Partner',
        description: 'Rivedi le candidature partner, approva i profili business trusted e gestisci la visibilità featured.',
        meta: (count: number) => `${count} profili partner approvati`,
      },
      ecosystem: {
        eyebrow: 'Percorso community',
        title: 'Ecosystem',
        description: 'Modera luoghi, servizi, suggerimenti e listing community prima che diventino pubblici.',
        meta: (count: number) => `${count} record ecosystem`,
      },
    },
    guide: {
      eyebrow: 'Orientamento admin',
      title: 'Usa il percorso giusto per l’azione giusta',
      description:
        'Membri è il posto più sicuro per eliminare un profilo utente o i dati Cane Corso inseriti dal proprietario. Review gestisce la moderazione. Registro gestisce la presenza pubblica di fiducia.',
      members: 'Apri membri',
      review: 'Apri review',
      registry: 'Apri registro',
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
      accentLabel="USG admin home"
      helpHref="/guide?topic=review#review"
      helpLabel={copy.guide.help}
      visualSrc="/brand/seal/usg-seal-wide.png"
      visualAlt="USG admin home"
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
            <Link href="/admin/members" className="button-primary small">
              {copy.guide.members}
            </Link>
            <Link href="/review" className="button-secondary small">
              {copy.guide.review}
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
