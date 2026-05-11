import Link from 'next/link';
import type { Dog, PublicRegistryEntry } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';

interface OwnerCaneCorsoSectionWorkspaceProps {
  locale: Locale;
  dog: Dog;
  registryEntry?: PublicRegistryEntry | null;
}

const copy = {
  en: {
    eyebrow: 'Cane Corso dossier',
    title: 'Choose what you want to manage',
    body: 'Your Cane Corso profile stays clear: each area opens separately, and every public request is reviewed before other members see it.',
    privacyTitle: 'Public listings protect the owner',
    privacyBody:
      'Listings should use Cane Corso photos and Cane Corso information only. Owner name, email, phone and exact address stay hidden; contact starts through the platform and admin-mediated flows.',
    adminRating: 'USG admin rating',
    communityRating: 'Community rating',
    pendingAdmin: 'Awaiting USG/admin assessment',
    pendingCommunity: 'Visible after publication',
    votes: 'votes',
    edit: 'Open',
    sections: [
      {
        key: 'profile',
        eyebrow: 'Basic profile',
        title: 'Name, identity and description',
        body: 'Edit name, sex, birth date, color, location notes, description and profile status.',
        hrefKind: 'edit',
        action: 'Edit / save profile',
      },
      {
        key: 'photos',
        eyebrow: 'Photos',
        title: 'Cane Corso photo set',
        body: 'Manage the main photo and the public image set. Use photos of the Cane Corso without personal documents or owner data.',
        hrefKind: 'media',
        action: 'Manage photos',
      },
      {
        key: 'growth',
        eyebrow: 'Growth and measurements',
        title: 'Weight, height and size charts',
        body: 'Open the table for age, kilograms, height, body length, head, muzzle and skull, with growth charts and orientation notes.',
        hrefKind: 'growth',
        action: 'Open growth table',
      },
      {
        key: 'health',
        eyebrow: 'Health and vaccines',
        title: 'Vaccines, parasite care and vet notes',
        body: 'Keep a private vaccine table, deworming history, vet visits, batch numbers and next due dates.',
        hrefKind: 'vaccines',
        action: 'Open vaccine table',
      },
      {
        key: 'ratings',
        eyebrow: 'Ratings',
        title: 'USG/admin and community ratings',
        body: 'See admin assessment separately from community feedback, so trust signals do not get mixed.',
        hrefKind: 'ratings',
        action: 'View ratings',
      },
      {
        key: 'review',
        eyebrow: 'USG review',
        title: 'Prepare for Registry / Verify',
        body: 'Check what is ready, what is missing and what can be submitted for USG review or publication.',
        hrefKind: 'review',
        action: 'Prepare review',
      },
      {
        key: 'listing',
        eyebrow: 'Community listings',
        title: 'Puppies, new home, match or lost/found',
        body: 'Create a request connected to this Cane Corso. Public cards show Cane Corso info, not owner personal details.',
        hrefKind: 'ecosystem',
        action: 'Create listing',
      },
      {
        key: 'services',
        eyebrow: 'Services and places',
        title: 'Hotel, transport, clinic or pet-friendly place',
        body: 'Suggest a trusted service or place for admin review before it becomes visible to the community.',
        hrefKind: 'services',
        action: 'Suggest service/place',
      },
    ],
  },
  bg: {
    eyebrow: 'Cane Corso досие',
    title: 'Избери какво искаш да управляваш',
    body: 'Профилът на твоето Cane Corso остава ясен: всяка зона се отваря отделно, а всяка публична заявка минава през преглед преди други членове да я видят.',
    privacyTitle: 'Публичните обяви пазят собственика',
    privacyBody:
      'Обявите трябва да използват снимки и информация за Cane Corso. Име на собственик, имейл, телефон и точен адрес остават скрити; контактът започва през платформата и админ-посредничество.',
    adminRating: 'USG/admin оценка',
    communityRating: 'Оценка от общността',
    pendingAdmin: 'Очаква USG/admin оценка',
    pendingCommunity: 'Видимо след публикуване',
    votes: 'гласа',
    edit: 'Отвори',
    sections: [
      {
        key: 'profile',
        eyebrow: 'Основен профил',
        title: 'Име, идентичност и описание',
        body: 'Поправи име, пол, дата на раждане, цвят, локация, описание и статус на профила.',
        hrefKind: 'edit',
        action: 'Поправи / запиши профил',
      },
      {
        key: 'photos',
        eyebrow: 'Снимки',
        title: 'Снимки на Cane Corso',
        body: 'Управлявай основната снимка и публичния набор. Използвай снимки на Cane Corso без лични документи или owner данни.',
        hrefKind: 'media',
        action: 'Управлявай снимки',
      },
      {
        key: 'growth',
        eyebrow: 'Растеж и размери',
        title: 'Килограми, височина и диаграми',
        body: 'Отвори таблица за възраст, килограми, височина, дължина на тяло, глава, муцуна и череп, с диаграми и ориентировъчен извод.',
        hrefKind: 'growth',
        action: 'Виж растежа',
      },
      {
        key: 'health',
        eyebrow: 'Здраве и ваксини',
        title: 'Ваксини, обезпаразитяване и прегледи',
        body: 'Води лична таблица за ваксини, обезпаразитяване, ветеринарни прегледи, партидни номера и следващи дати.',
        hrefKind: 'vaccines',
        action: 'Виж ваксините',
      },
      {
        key: 'ratings',
        eyebrow: 'Оценки',
        title: 'USG/admin и community оценки',
        body: 'Виж админ оценката отделно от оценката на потребителите, за да не се смесват trust сигналите.',
        hrefKind: 'ratings',
        action: 'Виж оценките',
      },
      {
        key: 'review',
        eyebrow: 'USG преглед',
        title: 'Подготовка за Registry / Verify',
        body: 'Провери кое е готово, какво липсва и какво може да се изпрати за USG преглед или публикация.',
        hrefKind: 'review',
        action: 'Подготви преглед',
      },
      {
        key: 'listing',
        eyebrow: 'Community обяви',
        title: 'Малки, нов дом, разплод или изгубено',
        body: 'Създай заявка, свързана с това Cane Corso. Публичните карти показват Cane Corso информация, не лични данни на собственика.',
        hrefKind: 'ecosystem',
        action: 'Създай обява',
      },
      {
        key: 'services',
        eyebrow: 'Услуги и места',
        title: 'Хотел, транспорт, клиника или pet-friendly място',
        body: 'Предложи доверена услуга или място за админ преглед, преди да стане видимо за общността.',
        hrefKind: 'services',
        action: 'Предложи услуга/място',
      },
    ],
  },
  it: {
    eyebrow: 'Dossier Cane Corso',
    title: 'Scegli cosa vuoi gestire',
    body: 'Il profilo del tuo Cane Corso resta chiaro: ogni area si apre separatamente e ogni richiesta pubblica passa dalla revisione prima di essere visibile.',
    privacyTitle: 'Gli annunci pubblici proteggono il proprietario',
    privacyBody:
      'Gli annunci devono usare foto e informazioni del Cane Corso. Nome proprietario, email, telefono e indirizzo preciso restano nascosti; il contatto parte dalla piattaforma e dai flussi mediati dall’admin.',
    adminRating: 'Valutazione USG/admin',
    communityRating: 'Valutazione comunità',
    pendingAdmin: 'In attesa di valutazione USG/admin',
    pendingCommunity: 'Visibile dopo pubblicazione',
    votes: 'voti',
    edit: 'Apri',
    sections: [
      {
        key: 'profile',
        eyebrow: 'Profilo base',
        title: 'Nome, identità e descrizione',
        body: 'Modifica nome, sesso, data di nascita, colore, località, descrizione e stato del profilo.',
        hrefKind: 'edit',
        action: 'Modifica / salva profilo',
      },
      {
        key: 'photos',
        eyebrow: 'Foto',
        title: 'Set foto Cane Corso',
        body: 'Gestisci foto principale e immagini pubbliche. Usa foto del Cane Corso senza documenti personali o dati proprietario.',
        hrefKind: 'media',
        action: 'Gestisci foto',
      },
      {
        key: 'growth',
        eyebrow: 'Crescita e misure',
        title: 'Peso, altezza e grafici',
        body: 'Apri tabella per età, kg, altezza, lunghezza corpo, testa, muso e cranio, con grafici e nota orientativa.',
        hrefKind: 'growth',
        action: 'Vedi crescita',
      },
      {
        key: 'health',
        eyebrow: 'Salute e vaccini',
        title: 'Vaccini, antiparassitari e visite',
        body: 'Tieni una tabella privata per vaccini, antiparassitari, visite veterinarie, lotti e prossime date.',
        hrefKind: 'vaccines',
        action: 'Vedi vaccini',
      },
      {
        key: 'ratings',
        eyebrow: 'Valutazioni',
        title: 'Valutazioni USG/admin e community',
        body: 'Vedi la valutazione admin separata dal feedback community, senza mescolare i segnali di fiducia.',
        hrefKind: 'ratings',
        action: 'Vedi valutazioni',
      },
      {
        key: 'review',
        eyebrow: 'Revisione USG',
        title: 'Preparazione Registry / Verify',
        body: 'Controlla cosa è pronto, cosa manca e cosa può essere inviato alla revisione USG o alla pubblicazione.',
        hrefKind: 'review',
        action: 'Prepara revisione',
      },
      {
        key: 'listing',
        eyebrow: 'Annunci community',
        title: 'Cuccioli, nuova casa, match o smarrito',
        body: 'Crea una richiesta collegata a questo Cane Corso. Le card pubbliche mostrano dati Cane Corso, non dati personali del proprietario.',
        hrefKind: 'ecosystem',
        action: 'Crea annuncio',
      },
      {
        key: 'services',
        eyebrow: 'Servizi e luoghi',
        title: 'Hotel, trasporto, clinica o luogo pet-friendly',
        body: 'Suggerisci un servizio o luogo affidabile per revisione admin prima della visibilità pubblica.',
        hrefKind: 'services',
        action: 'Suggerisci servizio/luogo',
      },
    ],
  },
} as const;

type SectionHrefKind = (typeof copy.en.sections)[number]['hrefKind'];

function buildHref(kind: SectionHrefKind, dog: Dog) {
  switch (kind) {
    case 'edit':
    case 'review':
      return `/my-dogs/${dog.id}/edit`;
    case 'media':
      return `/my-dogs/${dog.id}/media`;
    case 'growth':
      return `/my-dogs/${dog.id}/health#growth-table`;
    case 'vaccines':
      return `/my-dogs/${dog.id}/health#vaccines-table`;
    case 'ratings':
      return dog.publication ? `/registry/${dog.publication.publicSlug}#ratings` : `/my-dogs/${dog.id}/edit`;
    case 'ecosystem':
      return `/ecosystem#community-intent-form`;
    case 'services':
      return `/ecosystem#friendly-place-form`;
    default:
      return `/my-dogs/${dog.id}/edit`;
  }
}

function formatRating(value: number | null | undefined, fallback: string) {
  return typeof value === 'number' ? `${value.toFixed(1)} / 5` : fallback;
}

export function OwnerCaneCorsoSectionWorkspace({ locale, dog, registryEntry = null }: OwnerCaneCorsoSectionWorkspaceProps) {
  const t = copy[locale] ?? copy.en;
  const adminRating = formatRating(registryEntry?.adminAssessment?.overallScore, t.pendingAdmin);
  const communityRating = dog.publication && registryEntry?.communityRating?.totalRatings
    ? `${(registryEntry.communityRating.averageRating ?? 0).toFixed(1)} / 5 · ${registryEntry.communityRating.totalRatings} ${t.votes}`
    : t.pendingCommunity;

  return (
    <section className="content-card owner-cane-section-workspace" aria-label={t.title}>
      <div className="section-head-row owner-cane-section-workspace__head">
        <div>
          <span className="eyebrow-label">{t.eyebrow}</span>
          <h2>{t.title}</h2>
          <p className="section-support-copy">{t.body}</p>
        </div>
        <div className="owner-cane-section-workspace__ratings" aria-label={t.adminRating}>
          <div>
            <span>{t.adminRating}</span>
            <strong>{adminRating}</strong>
          </div>
          <div>
            <span>{t.communityRating}</span>
            <strong>{communityRating}</strong>
          </div>
        </div>
      </div>

      <div className="owner-cane-section-grid">
        {t.sections.map((section) => (
          <Link href={buildHref(section.hrefKind, dog)} className={`owner-cane-section-card owner-cane-section-card--${section.key}`} key={section.key}>
            <span className="eyebrow-label">{section.eyebrow}</span>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
            <strong>{section.action}</strong>
          </Link>
        ))}
      </div>

      <div className="owner-cane-section-workspace__privacy-note">
        <strong>{t.privacyTitle}</strong>
        <p>{t.privacyBody}</p>
      </div>
    </section>
  );
}
