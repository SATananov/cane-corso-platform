"use client";

import Link from 'next/link';
import type { Dog, DogAncestorRelationKey, DogMedia } from '@cane-corso-platform/contracts';
import { StatusBadge } from './status-badge';
import { useLocale } from '@/components/locale-provider';
import { getPedigreeFilledCount, getPedigreePhotoCount } from '@/lib/dog-pedigree';
import { ImageLightbox } from '@/components/image-lightbox';

export type OwnerWorkspaceDog = Dog & {
  media?: DogMedia[];
};

interface MyDogCardProps {
  dog: OwnerWorkspaceDog;
}

type GallerySlot = {
  url: string | null;
  label: string;
};

type PedigreeNode = {
  key: DogAncestorRelationKey;
  relation: string;
  name: string;
  photoUrl: string | null;
};

function getAgeLabel(dateOfBirth: string | null, monthsLabel: string, yearsLabel: string, pendingLabel: string) {
  if (!dateOfBirth) {
    return pendingLabel;
  }

  const birthDate = new Date(dateOfBirth);
  const today = new Date('2026-04-12T00:00:00.000Z');
  const monthDiff =
    (today.getUTCFullYear() - birthDate.getUTCFullYear()) * 12 +
    (today.getUTCMonth() - birthDate.getUTCMonth());

  if (monthDiff < 12) {
    return `${Math.max(monthDiff, 0)} ${monthsLabel}`;
  }

  const years = Math.floor(monthDiff / 12);
  const months = monthDiff % 12;

  return months > 0 ? `${years}y ${months}m` : `${years} ${yearsLabel}`;
}

function formatPublicationDate(locale: string, value: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(value));
}

function getDogGallerySlots(dog: OwnerWorkspaceDog, slotLabel: string): GallerySlot[] {
  const mediaImages = (dog.media ?? [])
    .filter((item) => item.mediaType === 'image' && item.url)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)
    .map((item) => item.url);

  const uniqueUrls = Array.from(new Set([dog.mainImageUrl, ...mediaImages].filter((value): value is string => Boolean(value)))).slice(0, 3);

  return Array.from({ length: 3 }, (_, index) => ({
    url: uniqueUrls[index] ?? null,
    label: `${slotLabel} ${index + 1}`,
  }));
}

function createPedigreeNode(
  dog: OwnerWorkspaceDog,
  relationKey: DogAncestorRelationKey,
  relationLabels: Record<string, string>,
  emptyName: string,
): PedigreeNode | null {
  const ancestor = dog.pedigree?.[relationKey];

  if (!ancestor?.name?.trim() && !ancestor?.photoUrl?.trim()) {
    return null;
  }

  return {
    key: relationKey,
    relation: relationLabels[relationKey] ?? relationKey,
    name: ancestor?.name || emptyName,
    photoUrl: ancestor?.photoUrl ?? null,
  };
}

function renderPedigreeNode(node: PedigreeNode, fallbackMark = 'USG') {
  return (
    <div className="dog-card-pedigree-node" key={node.key}>
      {node.photoUrl ? <ImageLightbox src={node.photoUrl} alt={node.name || node.relation} /> : <span aria-hidden="true">{fallbackMark}</span>}
      <div>
        <small>{node.relation}</small>
        <strong>{node.name}</strong>
      </div>
    </div>
  );
}

export function MyDogCard({ dog }: MyDogCardProps) {
  const { locale, dictionary } = useLocale();
  const t = dictionary.form;
  const pedigreeFilledCount = getPedigreeFilledCount(dog.pedigree);
  const pedigreePhotoCount = getPedigreePhotoCount(dog.pedigree);
  const relationLabels = t.pedigree.relations as Record<string, string>;
  const publicationCopy = {
    en: {
      published: 'Published',
      certificate: 'Certificate',
      notIssued: 'Not issued yet',
      profile: 'Public profile',
      premium: 'Public registry live',
    },
    bg: {
      published: 'Публикуван',
      certificate: 'Сертификат',
      notIssued: 'Все още не е издаден',
      profile: 'Публичен профил',
      premium: 'Профилът е вече публичен',
    },
    it: {
      published: 'Pubblicato',
      certificate: 'Certificato',
      notIssued: 'Non ancora emesso',
      profile: 'Profilo pubblico',
      premium: 'Registro pubblico attivo',
    },
  }[locale] ?? {
    published: 'Published',
    certificate: 'Certificate',
    notIssued: 'Not issued yet',
    profile: 'Public profile',
    premium: 'Public registry live',
  };

  const workspaceCopy = {
    en: {
      galleryEyebrow: 'Cane Corso gallery',
      galleryTitle: 'Main profile photos',
      galleryCount: 'up to 3 owner photos',
      heroImageTitle: 'Primary profile image',
      heroImageHint: 'Used as the leading owner preview.',
      heroOwnerChip: 'Owner profile',
      heroRegistryChip: 'Registry after publish',
      heroGalleryChip: 'USG Gallery by admin',
      gallerySlot: 'Photo',
      addPhoto: 'Add photo',
      ownerLayer: 'Owner profile',
      ownerLayerHint: 'Visible here immediately after save.',
      registryLayer: 'Registry visibility',
      registryLayerOpen: 'Visible only after admin publication.',
      registryLayerPending: 'Hidden from Registry until admin publication.',
      usgGalleryLayer: 'USG Gallery',
      usgGalleryLayerHint: 'Admin-curated selection only.',
      pedigreeEyebrow: 'Family pedigree',
      pedigreeTitle: 'Parents and lineage',
      pedigreeParentsTitle: 'Mother and father',
      pedigreeGrandparentsTitle: 'Grandparents line',
      pedigreeExpand: 'Show grandparents',
      self: 'Current Cane Corso',
      emptyName: 'Name pending',
      assessmentEyebrow: 'Assessment layer',
      communityTitle: 'Community rating',
      communityLocked: 'Activates after publication',
      communityOpen: 'Open for member ratings',
      adminTitle: 'Admin / registry review',
      adminReview: 'Review status',
      certificateTitle: 'USG certificate',
      certificateIssued: 'Issued separately',
      certificatePending: 'Separate admin decision',
    },
    bg: {
      galleryEyebrow: 'Галерия на Cane Corso',
      galleryTitle: 'Основни снимки на профила',
      galleryCount: 'до 3 owner снимки',
      heroImageTitle: 'Основна профилна снимка',
      heroImageHint: 'Води личния preview на собственика.',
      heroOwnerChip: 'Личен профил',
      heroRegistryChip: 'Регистър след публикация',
      heroGalleryChip: 'USG Галерия от админ',
      gallerySlot: 'Снимка',
      addPhoto: 'Добави снимка',
      ownerLayer: 'Профил на собственика',
      ownerLayerHint: 'Видими са тук веднага след запис.',
      registryLayer: 'Видимост в Регистъра',
      registryLayerOpen: 'Видими са само след admin публикация.',
      registryLayerPending: 'Скрити са от Регистъра до admin публикация.',
      usgGalleryLayer: 'USG Галерия',
      usgGalleryLayerHint: 'Само отделно избрани снимки от админ.',
      pedigreeEyebrow: 'Семейно родословие',
      pedigreeTitle: 'Родители и линия',
      pedigreeParentsTitle: 'Майка и баща',
      pedigreeGrandparentsTitle: 'Баби и дядовци',
      pedigreeExpand: 'Покажи баби и дядовци',
      self: 'Текущ Cane Corso',
      emptyName: 'Име предстои',
      assessmentEyebrow: 'Оценъчен слой',
      communityTitle: 'Оценка от общността',
      communityLocked: 'Активира се след публикация',
      communityOpen: 'Отворено за оценки от членове',
      adminTitle: 'Админ / registry review',
      adminReview: 'Статус на прегледа',
      certificateTitle: 'USG сертификат',
      certificateIssued: 'Издаден отделно',
      certificatePending: 'Отделно админ решение',
    },
    it: {
      galleryEyebrow: 'Galleria Cane Corso',
      galleryTitle: 'Foto principali del profilo',
      galleryCount: 'fino a 3 foto owner',
      heroImageTitle: 'Foto principale profilo',
      heroImageHint: 'Guida la preview owner.',
      heroOwnerChip: 'Profilo owner',
      heroRegistryChip: 'Registry dopo publish',
      heroGalleryChip: 'USG Gallery admin',
      gallerySlot: 'Foto',
      addPhoto: 'Aggiungi foto',
      ownerLayer: 'Profilo owner',
      ownerLayerHint: 'Visibili qui subito dopo il salvataggio.',
      registryLayer: 'Visibilita Registry',
      registryLayerOpen: 'Visibili solo dopo pubblicazione admin.',
      registryLayerPending: 'Nascoste dal Registry fino alla pubblicazione admin.',
      usgGalleryLayer: 'USG Gallery',
      usgGalleryLayerHint: 'Solo selezione curata dall admin.',
      pedigreeEyebrow: 'Pedigree familiare',
      pedigreeTitle: 'Genitori e linea',
      pedigreeParentsTitle: 'Madre e padre',
      pedigreeGrandparentsTitle: 'Linea nonni',
      pedigreeExpand: 'Mostra nonni',
      self: 'Cane Corso attuale',
      emptyName: 'Nome in attesa',
      assessmentEyebrow: 'Layer valutazione',
      communityTitle: 'Valutazione community',
      communityLocked: 'Si attiva dopo la pubblicazione',
      communityOpen: 'Aperta alle valutazioni dei membri',
      adminTitle: 'Admin / registry review',
      adminReview: 'Stato revisione',
      certificateTitle: 'Certificato USG',
      certificateIssued: 'Emesso separatamente',
      certificatePending: 'Decisione admin separata',
    },
  }[locale] ?? {
    galleryEyebrow: 'Cane Corso gallery',
    galleryTitle: 'Main profile photos',
    galleryCount: 'up to 3 owner photos',
    gallerySlot: 'Photo',
    addPhoto: 'Add photo',
    ownerLayer: 'Owner profile',
    ownerLayerHint: 'Visible here immediately after save.',
    registryLayer: 'Registry visibility',
    registryLayerOpen: 'Visible only after admin publication.',
    registryLayerPending: 'Hidden from Registry until admin publication.',
    usgGalleryLayer: 'USG Gallery',
    usgGalleryLayerHint: 'Admin-curated selection only.',
    pedigreeEyebrow: 'Family pedigree',
    pedigreeTitle: 'Parents and lineage',
    pedigreeParentsTitle: 'Mother and father',
    pedigreeGrandparentsTitle: 'Grandparents line',
    pedigreeExpand: 'Show grandparents',
    self: 'Current Cane Corso',
    emptyName: 'Name pending',
    assessmentEyebrow: 'Assessment layer',
    communityTitle: 'Community rating',
    communityLocked: 'Activates after publication',
    communityOpen: 'Open for member ratings',
    adminTitle: 'Admin / registry review',
    adminReview: 'Review status',
    certificateTitle: 'USG certificate',
    certificateIssued: 'Issued separately',
    certificatePending: 'Separate admin decision',
  };

  const hasCertificate = Boolean(dog.publication?.certificateCode);
  const hasUSGWatermark = hasCertificate;
  const gallerySlots = getDogGallerySlots(dog, workspaceCopy.gallerySlot);
  const primaryImageUrl = gallerySlots.find((slot) => slot.url)?.url ?? dog.mainImageUrl;
  const galleryImageCount = gallerySlots.filter((slot) => slot.url).length;
  const parentNodes = [
    createPedigreeNode(dog, 'mother', relationLabels, workspaceCopy.emptyName),
    createPedigreeNode(dog, 'father', relationLabels, workspaceCopy.emptyName),
  ].filter((node): node is PedigreeNode => Boolean(node));
  const grandparentNodes = [
    createPedigreeNode(dog, 'motherMother', relationLabels, workspaceCopy.emptyName),
    createPedigreeNode(dog, 'motherFather', relationLabels, workspaceCopy.emptyName),
    createPedigreeNode(dog, 'fatherMother', relationLabels, workspaceCopy.emptyName),
    createPedigreeNode(dog, 'fatherFather', relationLabels, workspaceCopy.emptyName),
  ].filter((node): node is PedigreeNode => Boolean(node));
  const shouldShowPedigree = parentNodes.length > 0 || grandparentNodes.length > 0;
  const adminStatusLabel = t.status[dog.lifecycleStatus as keyof typeof t.status] ?? dog.lifecycleStatus;

  return (
    <article className="dog-card dog-card--owner-workspace">
      <div className={`dog-card-hero${primaryImageUrl ? ' has-image' : ''}`}>
        <div className="dog-card-hero__topline">
          <div>
            <span className="eyebrow-label">{workspaceCopy.galleryEyebrow}</span>
            <strong>{workspaceCopy.heroImageTitle}</strong>
          </div>
          <span>{galleryImageCount}/3</span>
        </div>

        <div className="dog-card-hero__image-frame">
          {primaryImageUrl ? (
            <ImageLightbox src={primaryImageUrl} alt={dog.name} imageClassName="dog-card-hero-image" />
          ) : (
            <div className="dog-card-hero-mark">UNICO SUO GENERE</div>
          )}
          {hasUSGWatermark ? <div className="dog-card-hero-watermark" aria-hidden="true">USG</div> : null}
        </div>

        <div className="dog-card-hero__caption">
          <p>{workspaceCopy.heroImageHint}</p>
          <div className="dog-card-hero__chips" aria-label={workspaceCopy.registryLayer}>
            <span>{workspaceCopy.heroOwnerChip}</span>
            <span>{workspaceCopy.heroRegistryChip}</span>
            <span>{workspaceCopy.heroGalleryChip}</span>
          </div>
        </div>
      </div>

      <div className="dog-card-body">
        <div className="dog-card-meta-strip">
          <span className="dog-card-sex">{dog.sex === 'male' ? t.fields.male : t.fields.female}</span>
          <StatusBadge status={dog.lifecycleStatus} />
        </div>
        <div className="dog-card-heading-row">
          <div>
            <h3>{dog.name}</h3>
            <p className="dog-card-bloodline">{dog.pedigreeNumber ?? t.dogCard.pedigreePending}</p>
          </div>
        </div>

        <div className="dog-card-registry-pill">{t.registryClass[dog.registryClass ?? 'owner_declared_cane_corso']}</div>

        <section className="dog-card-gallery-strip" aria-label={workspaceCopy.galleryTitle}>
          <div className="dog-card-gallery-strip__head">
            <div>
              <span className="eyebrow-label">{workspaceCopy.galleryEyebrow}</span>
              <strong>{workspaceCopy.galleryTitle}</strong>
            </div>
            <span>{galleryImageCount}/3</span>
          </div>
          <div className="dog-card-gallery-strip__row">
            {gallerySlots.map((slot) => (
              slot.url ? (
                <div className="dog-card-gallery-thumb" key={slot.label}>
                  <ImageLightbox src={slot.url} alt={slot.label} />
                  <span>{slot.label}</span>
                </div>
              ) : (
                <Link href={`/my-dogs/${dog.id}/media`} className="dog-card-gallery-thumb dog-card-gallery-thumb--empty" key={slot.label}>
                  <strong>{slot.label}</strong>
                  <span>{workspaceCopy.addPhoto}</span>
                </Link>
              )
            ))}
          </div>
          <div className="dog-card-gallery-governance" aria-label={workspaceCopy.registryLayer}>
            <div>
              <span>{workspaceCopy.ownerLayer}</span>
              <strong>{workspaceCopy.ownerLayerHint}</strong>
            </div>
            <div>
              <span>{workspaceCopy.registryLayer}</span>
              <strong>{dog.publication ? workspaceCopy.registryLayerOpen : workspaceCopy.registryLayerPending}</strong>
            </div>
            <div>
              <span>{workspaceCopy.usgGalleryLayer}</span>
              <strong>{workspaceCopy.usgGalleryLayerHint}</strong>
            </div>
          </div>
          <p>{workspaceCopy.galleryCount}</p>
        </section>

        <dl className="dog-card-meta-grid">
          <div>
            <dt>{t.dogCard.age}</dt>
            <dd>{getAgeLabel(dog.dateOfBirth, t.dogCard.months, t.dogCard.years, t.dogCard.birthDatePending)}</dd>
          </div>
          <div>
            <dt>{t.dogCard.visibility}</dt>
            <dd>{dog.visibility === 'public' ? t.fields.public : t.fields.private}</dd>
          </div>
          <div>
            <dt>{t.pedigree.stats.filledAncestors}</dt>
            <dd>{pedigreeFilledCount}/14</dd>
          </div>
          <div>
            <dt>{t.pedigree.stats.ancestorPhotos}</dt>
            <dd>{pedigreePhotoCount}</dd>
          </div>
        </dl>

        <p className="dog-card-description">{dog.shortDescription ?? t.dogCard.descriptionFallback}</p>

        {shouldShowPedigree ? (
          <section className="dog-card-pedigree-preview dog-card-pedigree-preview--expanded" aria-label={workspaceCopy.pedigreeTitle}>
            <div className="dog-card-pedigree-preview__head">
              <span className="eyebrow-label">{workspaceCopy.pedigreeEyebrow}</span>
              <strong>{workspaceCopy.pedigreeTitle}</strong>
            </div>
            <div className="dog-card-pedigree-map">
              <div className="dog-card-pedigree-current">
                <div className="dog-card-pedigree-node dog-card-pedigree-node--self">
                  {primaryImageUrl ? <ImageLightbox src={primaryImageUrl} alt={dog.name} /> : <span aria-hidden="true">USG</span>}
                  <div>
                    <small>{workspaceCopy.self}</small>
                    <strong>{dog.name}</strong>
                  </div>
                </div>
              </div>

              {parentNodes.length > 0 ? (
                <div className="dog-card-pedigree-generation">
                  <span>{workspaceCopy.pedigreeParentsTitle}</span>
                  <div className="dog-card-pedigree-generation__grid">
                    {parentNodes.map((node) => renderPedigreeNode(node))}
                  </div>
                </div>
              ) : null}

              {grandparentNodes.length > 0 ? (
                <details className="dog-card-pedigree-details">
                  <summary>{workspaceCopy.pedigreeExpand}</summary>
                  <div className="dog-card-pedigree-generation dog-card-pedigree-generation--grandparents">
                    <span>{workspaceCopy.pedigreeGrandparentsTitle}</span>
                    <div className="dog-card-pedigree-generation__grid dog-card-pedigree-generation__grid--four">
                      {grandparentNodes.map((node) => renderPedigreeNode(node))}
                    </div>
                  </div>
                </details>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="dog-card-assessment-strip" aria-label={workspaceCopy.assessmentEyebrow}>
          <div className="dog-card-assessment-strip__head">
            <span className="eyebrow-label">{workspaceCopy.assessmentEyebrow}</span>
          </div>
          <div className="dog-card-assessment-grid">
            <div className="dog-card-assessment-card">
              <span>{workspaceCopy.communityTitle}</span>
              <strong>{dog.publication ? workspaceCopy.communityOpen : workspaceCopy.communityLocked}</strong>
            </div>
            <div className="dog-card-assessment-card">
              <span>{workspaceCopy.adminTitle}</span>
              <strong>{workspaceCopy.adminReview}: {adminStatusLabel}</strong>
            </div>
            <div className={`dog-card-assessment-card${hasCertificate ? ' dog-card-assessment-card--gold' : ''}`}>
              <span>{workspaceCopy.certificateTitle}</span>
              <strong>{dog.publication?.certificateCode ?? (hasCertificate ? workspaceCopy.certificateIssued : workspaceCopy.certificatePending)}</strong>
            </div>
          </div>
        </section>

        {dog.publication ? (
          <section className="dog-card-publication-rail" aria-label={publicationCopy.premium}>
            <div className="dog-card-publication-rail__head">
              <span className="eyebrow-label">{publicationCopy.premium}</span>
            </div>
            <dl className="dog-card-publication-meta">
              <div>
                <dt>{publicationCopy.published}</dt>
                <dd>{formatPublicationDate(locale, dog.publication.publishedAt)}</dd>
              </div>
              <div>
                <dt>{publicationCopy.certificate}</dt>
                <dd>{dog.publication.certificateCode ?? publicationCopy.notIssued}</dd>
              </div>
            </dl>
          </section>
        ) : null}

        <div className="dog-card-actions">
          <Link href={`/my-dogs/${dog.id}/edit`} className="button-secondary small">
            {dictionary.common.editProfile}
          </Link>
          <Link href={`/my-dogs/${dog.id}/media`} className="button-ghost small">
            {t.dogCard.manageMedia}
          </Link>
          {dog.publication ? (
            <Link href={`/registry/${dog.publication.publicSlug}`} className="button-secondary small">
              {publicationCopy.profile}
            </Link>
          ) : null}
          {dog.publication?.verificationSlug ? (
            <Link href={`/verify/${dog.publication.certificateCode ?? dog.publication.verificationSlug}`} className="button-ghost small">
              {dictionary.navigation.verify}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
