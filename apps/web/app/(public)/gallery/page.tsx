import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { getCurrentLocale } from '@/lib/locale.server';
import { getUsgGalleryDocument } from '@/lib/registry.server';
import { ImageLightbox } from '@/components/image-lightbox';
import { GalleryCertifiedShowcaseTrustPanel } from '@/components/gallery-certified-showcase-trust-panel';
import { InfoPanelGrid } from '@/components/info-panel-grid';
import { RoleAwareActionPanel } from '@/components/role-aware-action-panel';
import { getOptionalCookieMemberSession } from '@/lib/session.server';
import { SectionContentGuidePanel } from '@/components/section-content-guide-panel';

export const dynamic = 'force-dynamic';

const copyByLocale = {
  en: {
    eyebrow: 'Curated showcase',
    title: 'Gallery',
    description:
      'USG Gallery is not the registry. It is the curated showcase layer for Cane Corso that gained real community traction and also received a certificate issued through the official USG trust path.',
    cards: [
      {
        eyebrow: 'Separate from registry',
        title: 'Registry and gallery are not the same',
        description:
          'A published registry profile can stay in the official registry without entering the gallery. The gallery is a more selective showcase layer, not the default list of all published Cane Corso.',
        meta: 'Registry • public listing • separate showcase',
      },
      {
        eyebrow: 'Community traction',
        title: 'Likes matter, but not alone',
        description:
          'Gallery visibility is intended for Cane Corso that gathered the required community response. That popularity signal can help identify standout presence, but it is not enough on its own.',
        meta: 'Community likes • traction • visibility',
      },
      {
        eyebrow: 'Final trust decision',
        title: 'USG certificate stays required',
        description:
          'Even with strong public support, a Cane Corso belongs in the gallery only when the official certificate has also been granted by admin. The final decision remains in the trust layer, not only in community energy.',
        href: '/certified',
        meta: 'Certificate • verify • official approval',
      },
    ],
    noteTitle: 'How to understand USG Gallery',
    noteBody:
      'Think of the registry as the public official list, and the gallery as the curated stage for the strongest profiles. It is a showcase of distinction, not a duplicate catalog.',
    showcaseEyebrow: 'Selected by admin',
    showcaseTitle: 'Current USG Gallery selection',
    showcaseDescription:
      'Only photos explicitly selected for USG Gallery by admin are shown here, and only for profiles that already have an active USG certificate.',
    emptyShowcase: 'No Cane Corso has been selected for the USG Gallery yet.',
    openProfile: 'Open profile',
    verify: 'Verify',
    photos: 'photos',
    certificate: 'Certificate',
    communityRating: 'Community rating',
    adminAssessment: 'Admin assessment',
    activeCertificate: 'Active USG certificate',
    awaitingAdminAssessment: 'Awaiting admin assessment',
    noCommunityVotes: 'No community votes yet',
    votes: 'votes',
  },
  bg: {
    eyebrow: 'Кураторска витрина',
    title: 'Галерия',
    description:
      'USG Галерията не е Регистърът. Това е специално подбраната витрина за Cane Corso, които имат реална подкрепа от общността и активен сертификат, издаден по официалния USG път на доверие.',
    cards: [
      {
        eyebrow: 'Отделно от регистъра',
        title: 'Регистърът и галерията не са едно и също',
        description:
          'Публикуван Cane Corso може да стои в официалния регистър, без да влиза в Галерията. Галерията е по-селективен слой за представяне, а не списъкът на всички публикувани профили.',
        meta: 'Регистър • публичен списък • отделна витрина',
      },
      {
        eyebrow: 'Подкрепа от общността',
        title: 'Лайковете имат значение, но не стигат сами',
        description:
          'Видимостта в Галерията е замислена за Cane Corso, които са събрали нужната подкрепа от общността. Този сигнал показва силно присъствие, но не е достатъчен сам по себе си.',
        meta: 'Лайкове от общността • тежест • видимост',
      },
      {
        eyebrow: 'Финално доверие',
        title: 'USG сертификатът остава задължителен',
        description:
          'Дори при силна публична подкрепа, Cane Corso влиза в Галерията само когато има и официален сертификат, даден от админ. Финалното решение остава в слоя на доверие, не само в енергията на общността.',
        href: '/certified',
        meta: 'Сертификат • проверка • официално одобрение',
      },
    ],
    noteTitle: 'Как работи USG Галерията',
    noteBody:
      'Регистърът е официалният публичен списък, а Галерията е подбраната сцена за отличени профили със силно присъствие и активен USG сертификат.',
    showcaseEyebrow: 'Подбрана витрина',
    showcaseTitle: 'USG Галерия',
    showcaseDescription:
      'Първо показваме избраните снимки. Тук влизат само кадри, одобрени за Галерията от администратор, и само профили с активен USG сертификат.',
    emptyShowcase: 'Все още няма Cane Corso, избрани за USG Галерията.',
    openProfile: 'Отвори профила',
    verify: 'Провери',
    photos: 'снимки',
    certificate: 'Сертификат',
    communityRating: 'Оценка от общността',
    adminAssessment: 'Админ оценка',
    activeCertificate: 'Активен USG сертификат',
    awaitingAdminAssessment: 'Очаква админ оценка',
    noCommunityVotes: 'Все още няма оценки от общността',
    votes: 'гласа',
  },
  it: {
    eyebrow: 'Vetrina curata',
    title: 'Galleria',
    description:
      'La Galleria USG non è il Registro. È una vetrina curata per Cane Corso che hanno raccolto reale sostegno dalla comunità e hanno anche ricevuto un certificato emesso attraverso il percorso ufficiale di fiducia USG.',
    cards: [
      {
        eyebrow: 'Separata dal registro',
        title: 'Registro e galleria non coincidono',
        description:
          'Un profilo pubblicato può restare nel Registro ufficiale senza entrare nella Galleria. La Galleria è un livello di vetrina più selettivo, non l’elenco di tutti i Cane Corso pubblicati.',
        meta: 'Registro • lista pubblica • vetrina separata',
      },
      {
        eyebrow: 'Sostegno della comunità',
        title: 'I like contano, ma non bastano da soli',
        description:
          'La visibilità in Galleria è pensata per Cane Corso che hanno raccolto la risposta richiesta dalla comunità. Questo segnale aiuta a riconoscere una presenza forte, ma non è sufficiente da solo.',
        meta: 'Like della comunità • sostegno • visibilità',
      },
      {
        eyebrow: 'Decisione finale di fiducia',
        title: 'Il certificato USG resta obbligatorio',
        description:
          'Anche con un forte sostegno pubblico, un Cane Corso entra in Galleria solo quando esiste anche il certificato ufficiale concesso da un amministratore. La decisione finale resta nel livello di fiducia, non solo nell’energia della comunità.',
        href: '/certified',
        meta: 'Certificato • verifica • approvazione ufficiale',
      },
    ],
    noteTitle: 'Come leggere la Galleria USG',
    noteBody:
      'Considera il registro come la lista pubblica ufficiale e la galleria come il palco curato per i profili più forti. È una vetrina di distinzione, non un catalogo duplicato.',
    showcaseEyebrow: 'Selezionato da un amministratore',
    showcaseTitle: 'Selezione attuale della Galleria USG',
    showcaseDescription:
      'Qui compaiono solo le foto selezionate esplicitamente per la Galleria USG da un amministratore, e solo per profili con certificato USG attivo.',
    emptyShowcase: 'Nessun Cane Corso è ancora stato selezionato per la Galleria USG.',
    openProfile: 'Apri profilo',
    verify: 'Verifica',
    photos: 'foto',
    certificate: 'Certificato',
    communityRating: 'Valutazione della comunità',
    adminAssessment: 'Valutazione amministrativa',
    activeCertificate: 'Certificato USG attivo',
    awaitingAdminAssessment: 'In attesa della valutazione amministrativa',
    noCommunityVotes: 'Nessun voto della comunità',
    votes: 'voti',
  },
} as const;

type GalleryEntry = Awaited<ReturnType<typeof getUsgGalleryDocument>>["entries"][number];
type GalleryCopy = (typeof copyByLocale)[keyof typeof copyByLocale];

function formatCommunityRating(entry: GalleryEntry, copy: GalleryCopy) {
  if (entry.communityRating.averageRating == null || entry.communityRating.totalRatings === 0) {
    return copy.noCommunityVotes;
  }

  return `${entry.communityRating.averageRating}/5 • ${entry.communityRating.totalRatings} ${copy.votes}`;
}

function formatAdminAssessment(entry: GalleryEntry, copy: GalleryCopy) {
  if (entry.adminAssessment?.overallScore == null) {
    return copy.awaitingAdminAssessment;
  }

  return `${entry.adminAssessment.overallScore}/5`;
}

export default async function GalleryPage() {
  const locale = await getCurrentLocale();
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const galleryDocument = await getUsgGalleryDocument();
  const currentSession = await getOptionalCookieMemberSession();

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      accentLabel={locale === 'bg' ? 'Слой на USG Галерията' : locale === 'it' ? 'Layer Galleria USG' : 'USG gallery layer'}
      helpHref="/guide?topic=community#community"
      helpLabel={locale === 'bg' ? 'Помощ' : locale === 'it' ? 'Aiuto' : 'Help'}
      visualSrc="/brand/editorial-member-shadow-eye.jpg"
      visualAlt="USG gallery Cane Corso"
      heroChips={locale === 'bg' ? ['Само отличени', 'Подкрепа от общността', 'USG сертификат'] : locale === 'it' ? ['Solo distinti', 'Sostegno della comunità', 'Certificato USG'] : ['Curated only', 'Community traction', 'USG certificate']}
      heroNote={copy.noteBody}
    >
      <RoleAwareActionPanel locale={locale} surface="gallery" role={currentSession?.user.role ?? null} />
      <SectionContentGuidePanel locale={locale} surface="gallery" />
      <section className="content-card usg-gallery-showcase">
        <div className="section-head-row">
          <div>
            <span className="eyebrow-label">{copy.showcaseEyebrow}</span>
            <h2>{copy.showcaseTitle}</h2>
            <p>{copy.showcaseDescription}</p>
          </div>
          <div className="usg-gallery-trust-rail" aria-hidden="true">
            <img src="/brand/seal/usg-official-seal-compact.png" alt="" loading="lazy" decoding="async" />
            <span>USG</span>
          </div>
        </div>

        {galleryDocument.entries.length === 0 ? (
          <div className="empty-state-panel empty-state-panel--compact">
            <p className="empty-state-panel__description">{copy.emptyShowcase}</p>
          </div>
        ) : (
          <div className="usg-gallery-grid">
            {galleryDocument.entries.map((entry) => {
              const heroImage = entry.galleryImages[0] ?? entry.heroImageUrl;
              const verifyTarget = entry.certificate?.certificateCode ?? entry.certificate?.verificationSlug ?? null;

              return (
                <article className="usg-gallery-card" key={entry.entryId}>
                  <div className="usg-gallery-card__media usg-gallery-card__media--official">
                    {heroImage ? (
                      <ImageLightbox src={heroImage} alt={entry.dog.name} imageClassName="usg-gallery-card__image" />
                    ) : (
                      <span>USG</span>
                    )}
                    {entry.certificate ? (
                      <div className="official-gallery-seal" aria-label="Official UNICO SUO GENERE selected seal">
                        <img src="/brand/seal/usg-official-seal-compact.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                        <span>USG Selected</span>
                      </div>
                    ) : null}
                  </div>
                  <div className="usg-gallery-card__body">
                    <span className="eyebrow-label">UNICO SUO GENERE</span>
                    <h3>{entry.dog.name}</h3>
                    <p>{entry.summary ?? entry.dog.shortDescription ?? copy.noteBody}</p>
                    <div className="usg-gallery-card__meta">
                      <span>{entry.owner.displayName}</span>
                      <span>{entry.galleryImages.length}/3 {copy.photos}</span>
                    </div>
                    <div className="usg-gallery-card__evidence" aria-label="USG Gallery evidence">
                      <div>
                        <span>{copy.certificate}</span>
                        <strong>{entry.certificate?.certificateCode ?? copy.activeCertificate}</strong>
                      </div>
                      <div>
                        <span>{copy.communityRating}</span>
                        <strong>{formatCommunityRating(entry, copy)}</strong>
                      </div>
                      <div>
                        <span>{copy.adminAssessment}</span>
                        <strong>{formatAdminAssessment(entry, copy)}</strong>
                      </div>
                    </div>
                    {entry.galleryImages.length > 1 ? (
                      <div className="usg-gallery-card__thumbs">
                        {entry.galleryImages.slice(0, 3).map((imageUrl) => (
                          <ImageLightbox src={imageUrl} alt={entry.dog.name} imageClassName="usg-gallery-card__thumb" key={imageUrl} />
                        ))}
                      </div>
                    ) : null}
                    <div className="usg-gallery-card__actions">
                      <Link href={`/registry/${entry.publicSlug}`} className="button-secondary small">
                        {copy.openProfile}
                      </Link>
                      {verifyTarget ? (
                        <Link href={`/verify/${verifyTarget}`} className="button-primary small">
                          {copy.verify}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <GalleryCertifiedShowcaseTrustPanel variant="gallery" locale={locale} />

      <InfoPanelGrid
        eyebrow={copy.noteTitle}
        title={copy.noteTitle}
        description={copy.noteBody}
        cards={copy.cards}
        actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'}
        ariaLabel={copy.noteTitle}
      />
    </PageShell>
  );
}
