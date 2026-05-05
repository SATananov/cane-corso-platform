import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

type PublicRegistryTrustLane = {
  id: 'registry' | 'assessment' | 'certificate' | 'community' | 'member';
  title: string;
  description: string;
  state: string;
  ready: boolean;
};

type PublicRegistryTrustCopy = {
  eyebrow: string;
  title: string;
  description: string;
  registry: string;
  assessment: string;
  certificate: string;
  community: string;
  member: string;
  ready: string;
  pending: string;
  available: string;
  limited: string;
  votes: string;
  openVerify: string;
  openCertificate: string;
  lanes: {
    registry: string;
    registryDescription: string;
    assessment: string;
    assessmentDescription: string;
    certificate: string;
    certificateDescription: string;
    community: string;
    communityDescription: string;
    member: string;
    memberDescription: string;
  };
};

interface PublicRegistryTrustReadabilityPanelProps {
  locale: Locale;
  dogName: string;
  hasMemberAccess: boolean;
  hasCertificate: boolean;
  hasAdminAssessment: boolean;
  hasPublicMedia: boolean;
  hasPedigree: boolean;
  communityVoteCount: number;
  verifyHref?: string | null;
  certificateHref?: string | null;
}

const copyByLocale: Record<string, PublicRegistryTrustCopy> = {
  en: {
    eyebrow: 'Public trust reading',
    title: 'How to read this Registry profile',
    description:
      'This public page is a trusted Registry presentation. It connects Registry, USG Certificate, Verify and community signals without mixing them into one decision.',
    registry: 'Registry',
    assessment: 'Admin assessment',
    certificate: 'USG Certificate',
    community: 'Community',
    member: 'Member depth',
    ready: 'Visible',
    pending: 'Pending',
    available: 'Available',
    limited: 'Limited for guests',
    votes: 'votes',
    openVerify: 'Open Verify',
    openCertificate: 'Open Certificate',
    lanes: {
      registry: 'Published Registry identity',
      registryDescription: 'The Cane Corso has an approved public Registry presence with public-facing media and core identity.',
      assessment: 'Official assessment layer',
      assessmentDescription: 'Admin assessment explains quality/readiness signals and remains separate from community voting.',
      certificate: 'Certificate decision',
      certificateDescription: 'A USG certificate appears only when issued. Registry publication alone is not the same as certification.',
      community: 'Community signal',
      communityDescription: 'Community rating is social feedback and never replaces the official admin/certificate layer.',
      member: 'Deeper member view',
      memberDescription: 'Guests see a trusted public preview. Members can access richer profile depth when available.',
    },
  },
  bg: {
    eyebrow: 'Публично четене на доверие',
    title: 'Как да се чете този Registry профил',
    description:
      'Тази публична страница е доверено Registry представяне. Тя свързва Registry, USG сертификат, Verify и сигналите от общността, без да ги смесва като едно решение.',
    registry: 'Registry',
    assessment: 'Админ оценка',
    certificate: 'USG сертификат',
    community: 'Общност',
    member: 'Членски слой',
    ready: 'Видимо',
    pending: 'Очаква',
    available: 'Налично',
    limited: 'Ограничено за гост',
    votes: 'гласа',
    openVerify: 'Отвори Verify',
    openCertificate: 'Отвори сертификата',
    lanes: {
      registry: 'Публикувана Registry идентичност',
      registryDescription: 'Cane Corso има одобрено публично присъствие в Registry с публични снимки и основна идентичност.',
      assessment: 'Официален слой за оценка',
      assessmentDescription: 'Админ оценката обяснява сигналите за качество/готовност и остава отделна от гласуването на общността.',
      certificate: 'Решение за сертификат',
      certificateDescription: 'USG сертификат се показва само когато е издаден. Публикация в Registry не е същото като сертифициране.',
      community: 'Сигнал от общността',
      communityDescription: 'Оценката от общността е социална обратна връзка и не заменя официалния admin/certificate слой.',
      member: 'По-дълбок членски изглед',
      memberDescription: 'Гостите виждат доверен публичен преглед. Членовете могат да достъпят по-богат профилен слой, когато е наличен.',
    },
  },
  it: {
    eyebrow: 'Lettura pubblica della fiducia',
    title: 'Come leggere questo profilo Registry',
    description:
      'Questa pagina pubblica è una presentazione Registry affidabile. Collega Registry, certificato USG, Verify e segnali community senza confonderli in una sola decisione.',
    registry: 'Registry',
    assessment: 'Valutazione admin',
    certificate: 'Certificato USG',
    community: 'Community',
    member: 'Livello membro',
    ready: 'Visibile',
    pending: 'In attesa',
    available: 'Disponibile',
    limited: 'Limitato per ospiti',
    votes: 'voti',
    openVerify: 'Apri Verify',
    openCertificate: 'Apri certificato',
    lanes: {
      registry: 'Identità Registry pubblicata',
      registryDescription: 'Il Cane Corso ha una presenza pubblica approvata nel Registry con media pubblici e identità principale.',
      assessment: 'Livello di valutazione ufficiale',
      assessmentDescription: 'La valutazione admin spiega segnali di qualità/prontezza e resta separata dal voto community.',
      certificate: 'Decisione certificato',
      certificateDescription: 'Un certificato USG appare solo quando emesso. La pubblicazione Registry non equivale alla certificazione.',
      community: 'Segnale community',
      communityDescription: 'La valutazione community è feedback sociale e non sostituisce il livello ufficiale admin/certificato.',
      member: 'Vista membro più profonda',
      memberDescription: 'Gli ospiti vedono un’anteprima pubblica affidabile. I membri possono accedere a un livello profilo più ricco quando disponibile.',
    },
  },
};

function getCopy(locale: Locale) {
  return copyByLocale[locale] ?? copyByLocale.en;
}

function getState(ready: boolean, copy: PublicRegistryTrustCopy) {
  return ready ? copy.ready : copy.pending;
}

export function PublicRegistryTrustReadabilityPanel({
  locale,
  dogName,
  hasMemberAccess,
  hasCertificate,
  hasAdminAssessment,
  hasPublicMedia,
  hasPedigree,
  communityVoteCount,
  verifyHref,
  certificateHref,
}: PublicRegistryTrustReadabilityPanelProps) {
  const copy = getCopy(locale);

  const lanes: PublicRegistryTrustLane[] = [
    {
      id: 'registry',
      title: copy.lanes.registry,
      description: copy.lanes.registryDescription,
      state: hasPublicMedia ? copy.ready : copy.pending,
      ready: hasPublicMedia,
    },
    {
      id: 'assessment',
      title: copy.lanes.assessment,
      description: copy.lanes.assessmentDescription,
      state: getState(hasAdminAssessment, copy),
      ready: hasAdminAssessment,
    },
    {
      id: 'certificate',
      title: copy.lanes.certificate,
      description: copy.lanes.certificateDescription,
      state: hasCertificate ? copy.available : copy.pending,
      ready: hasCertificate,
    },
    {
      id: 'community',
      title: copy.lanes.community,
      description: copy.lanes.communityDescription,
      state: communityVoteCount > 0 ? communityVoteCount + ' ' + copy.votes : copy.pending,
      ready: communityVoteCount > 0,
    },
    {
      id: 'member',
      title: copy.lanes.member,
      description: copy.lanes.memberDescription,
      state: hasMemberAccess ? copy.available : copy.limited,
      ready: hasMemberAccess,
    },
  ];

  return (
    <section className="public-registry-trust-readability" aria-label={copy.title}>
      <div className="public-registry-trust-readability__head">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h3>{copy.title}</h3>
          <p>{copy.description}</p>
        </div>
        <div className="public-registry-trust-readability__identity" aria-label={dogName}>
          <span>{copy.registry}</span>
          <strong>{dogName}</strong>
          <small>{hasPedigree ? copy.lanes.member : copy.limited}</small>
        </div>
      </div>

      <div className="public-registry-trust-readability__grid">
        {lanes.map((lane) => (
          <article className={lane.ready ? 'public-registry-trust-readability__lane is-ready' : 'public-registry-trust-readability__lane'} key={lane.id}>
            <span>{lane.title}</span>
            <strong>{lane.state}</strong>
            <p>{lane.description}</p>
          </article>
        ))}
      </div>

      {verifyHref || certificateHref ? (
        <div className="public-registry-trust-readability__actions">
          {verifyHref ? (
            <Link href={verifyHref} className="button-primary small">
              {copy.openVerify}
            </Link>
          ) : null}
          {certificateHref ? (
            <Link href={certificateHref} className="button-secondary small">
              {copy.openCertificate}
            </Link>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
