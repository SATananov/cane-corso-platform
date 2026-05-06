'use client';

import { StatusBadge } from './status-badge';
import type { DogFormErrors, DogFormValues } from '../lib/dog-form.types';
import { useLocale } from '@/components/locale-provider';
import { getPedigreeFilledCount, getPedigreePhotoCount } from '@/lib/dog-pedigree';
import { ImageLightbox } from '@/components/image-lightbox';
import { OwnerReviewReadinessPanel } from '@/components/owner-review-readiness-panel';

interface DogProfilePreviewCardProps {
  values: DogFormValues;
  mode: 'create' | 'edit';
  errors?: DogFormErrors;
  validationPassed?: boolean;
  persistenceStateLabel?: string | null;
}


function localizePreviewValue(value: string, options: Array<[string, string]>) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return '';
  const match = options.find(([stored]) => stored.toLowerCase() === normalized);
  return match?.[1] ?? value;
}

const certificateCopy = {
  en: {
    eyebrow: 'USG review',
    title: 'Evaluation and certificate',
    pending: 'Awaiting review and certification',
    ready: 'A certificate appears only after a separate USG certificate decision.',
    issued: 'USG certificate is ready for this profile.',
    code: 'Certificate code',
    verify: 'Verification path',
    photos: 'Profile images',
  },
  bg: {
    eyebrow: 'USG преглед',
    title: 'Оценяване и сертификат',
    pending: 'Очаква преглед и сертифициране',
    ready: 'Сертификатът се появява само след отделно решение за USG сертификат.',
    issued: 'USG сертификатът е готов за този профил.',
    code: 'Код на сертификата',
    verify: 'Път за проверка',
    photos: 'Снимки в профила',
  },
  it: {
    eyebrow: 'Revisione USG',
    title: 'Valutazione e certificato',
    pending: 'In attesa di revisione e certificazione',
    ready: 'Il certificato appare solo dopo una decisione separata sul certificato USG.',
    issued: 'Il certificato USG è pronto per questo profilo.',
    code: 'Codice certificato',
    verify: 'Percorso verifica',
    photos: 'Immagini profilo',
  },
} as const;

export function DogProfilePreviewCard({
  values,
  mode,
  errors = {},
  validationPassed = false,
  persistenceStateLabel = null,
}: DogProfilePreviewCardProps) {
  const { locale, dictionary } = useLocale();
  const t = dictionary.form;
  const certT = certificateCopy[locale];
  const errorCount = Object.keys(errors).length;
  const pedigreeFilledCount = getPedigreeFilledCount(values.pedigree);
  const pedigreePhotoCount = getPedigreePhotoCount(values.pedigree);
  const motherName = values.pedigree.mother?.name?.trim() || t.pedigree.relations.mother;
  const fatherName = values.pedigree.father?.name?.trim() || t.pedigree.relations.father;
  const hasCertificate = Boolean(values.publicationCertificateCode);
  const galleryImages = Array.from(new Set([values.mainImageUrl, ...values.galleryImageUrls].filter(Boolean))).slice(0, 3);
  const coverImage = galleryImages[0] || '';
  const hasUSGWatermark = hasCertificate;
  const displayColor = localizePreviewValue(values.color, [
    ['Black', t.options.colors.black],
    ['Black Brindle', t.options.colors.blackBrindle],
    ['Grey', t.options.colors.grey],
    ['Gray', t.options.colors.grey],
    ['Grey Brindle', t.options.colors.greyBrindle],
    ['Gray Brindle', t.options.colors.greyBrindle],
    ['Formentino', t.options.colors.formentino],
    ['Fawn', t.options.colors.fawn],
    ['Red', t.options.colors.red],
    ['Stag Red', t.options.colors.red],
    ['Chestnut Brindle', t.options.colors.chestnutBrindle],
    ['Blue', t.options.colors.blue],
    ['Other', t.options.colors.other],
  ]);
  const displayCountry = localizePreviewValue(values.country, [
    ['Bulgaria', t.options.countries.bulgaria],
    ['Italy', t.options.countries.italy],
    ['Serbia', t.options.countries.serbia],
    ['Romania', t.options.countries.romania],
    ['Greece', t.options.countries.greece],
    ['North Macedonia', t.options.countries.northMacedonia],
    ['Albania', t.options.countries.albania],
    ['Montenegro', t.options.countries.montenegro],
    ['Croatia', t.options.countries.croatia],
    ['Slovenia', t.options.countries.slovenia],
    ['Bosnia and Herzegovina', t.options.countries.bosniaAndHerzegovina],
    ['Germany', t.options.countries.germany],
    ['France', t.options.countries.france],
    ['Spain', t.options.countries.spain],
    ['Portugal', t.options.countries.portugal],
    ['Netherlands', t.options.countries.netherlands],
    ['Belgium', t.options.countries.belgium],
    ['Austria', t.options.countries.austria],
    ['Switzerland', t.options.countries.switzerland],
    ['United Kingdom', t.options.countries.unitedKingdom],
    ['Ireland', t.options.countries.ireland],
    ['Poland', t.options.countries.poland],
    ['Czech Republic', t.options.countries.czechRepublic],
    ['Slovakia', t.options.countries.slovakia],
    ['Hungary', t.options.countries.hungary],
    ['Turkey', t.options.countries.turkey],
    ['United States', t.options.countries.unitedStates],
    ['Canada', t.options.countries.canada],
  ]);

  return (
    <aside className="sticky-preview-column">
      <div className="preview-card">
        <div className="preview-card-header">
          <span className="eyebrow-label">{t.preview.livePreview}</span>
          <StatusBadge status={values.lifecycleStatus} />
        </div>

        <div className={`preview-hero-placeholder${coverImage ? ' has-image' : ''}`}>
          {coverImage ? (
            <ImageLightbox src={coverImage} alt={values.name || t.preview.unnamed} imageClassName="preview-hero-image" />
          ) : null}
          {hasUSGWatermark ? <div className="preview-hero-watermark" aria-hidden="true">USG</div> : null}
          <span>{mode === 'create' ? t.preview.newCover : t.preview.currentCover}</span>
        </div>

        {galleryImages.length > 0 ? (
          <div className="preview-gallery-strip">
            <div className="preview-gallery-strip__head">
              <span className="eyebrow-label">{certT.photos}</span>
              <strong>{galleryImages.length}/3</strong>
            </div>
            <div className="preview-gallery-strip__row">
              {galleryImages.map((imageUrl, index) => (
                <div className={`preview-gallery-thumb${index === 0 ? ' is-primary' : ''}`} key={`${imageUrl}-${index}`}>
                  <ImageLightbox src={imageUrl} alt={values.name || t.preview.unnamed} imageClassName="preview-gallery-thumb__image" />
                  <span className="preview-gallery-thumb__badge">{index === 0 ? '01' : `0${index + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="preview-profile-meta">
          <h2>{values.name || t.preview.unnamed}</h2>
          <p>{values.shortDescription || t.preview.shortFallback}</p>
        </div>

        <div className={`readiness-panel ${validationPassed ? 'ready' : errorCount > 0 ? 'attention' : ''}`}>
          <div>
            <span className="eyebrow-label">{t.preview.readiness}</span>
            <strong>
              {validationPassed
                ? t.preview.validated
                : errorCount > 0
                  ? `${errorCount} ${t.preview.issuesToFix}`
                  : t.preview.awaiting}
            </strong>
          </div>
          <span className="route-pill subtle">{values.visibility === 'public' ? t.fields.public : t.fields.private}</span>
        </div>


        <OwnerReviewReadinessPanel
          locale={locale}
          context="preview"
          dogName={values.name}
          slug={values.slug}
          lifecycleStatus={values.lifecycleStatus}
          visibility={values.visibility}
          hasPublication={Boolean(values.publicationPublicSlug)}
          hasCertificate={Boolean(values.publicationCertificateCode)}
          hasName={Boolean(values.name.trim())}
          hasSlug={Boolean(values.slug.trim())}
          hasDateOfBirth={Boolean(values.dateOfBirth)}
          hasColor={Boolean(values.color.trim())}
          hasShortDescription={Boolean(values.shortDescription.trim())}
          hasCity={Boolean(values.city.trim())}
          hasCountry={Boolean(values.country.trim())}
          hasPrimaryImage={Boolean(coverImage)}
          galleryImageCount={galleryImages.length}
          pedigreeFilledCount={pedigreeFilledCount}
          pedigreePhotoCount={pedigreePhotoCount}
          compact
        />

        <dl className="preview-details-list">
          <div>
            <dt>{t.preview.slug}</dt>
            <dd>{values.slug || dictionary.common.notSetYet}</dd>
          </div>
          <div>
            <dt>{t.preview.sex}</dt>
            <dd>{values.sex === 'male' ? t.fields.male : t.fields.female}</dd>
          </div>
          <div>
            <dt>{t.preview.birthDate}</dt>
            <dd>{values.dateOfBirth || dictionary.common.notSetYet}</dd>
          </div>
          <div>
            <dt>{t.preview.color}</dt>
            <dd>{displayColor || dictionary.common.notSetYet}</dd>
          </div>
          <div>
            <dt>{t.preview.visibility}</dt>
            <dd>{values.visibility === 'public' ? t.fields.public : t.fields.private}</dd>
          </div>
          <div>
            <dt>{t.fields.registryClass}</dt>
            <dd>{t.registryClass[values.registryClass]}</dd>
          </div>
          <div>
            <dt>{t.preview.country}</dt>
            <dd>{displayCountry || dictionary.common.notSetYet}</dd>
          </div>
          <div>
            <dt>{certT.photos}</dt>
            <dd>{values.galleryImageUrls.length}/3</dd>
          </div>
        </dl>

        <div className="preview-certificate-card">
          <div className="preview-certificate-card__head">
            <span className="eyebrow-label">{certT.eyebrow}</span>
            <h3>{certT.title}</h3>
          </div>
          <p>{hasCertificate ? certT.issued : certT.ready}</p>
          <div className="preview-certificate-card__meta">
            <div>
              <span>{certT.code}</span>
              <strong>{values.publicationCertificateCode || certT.pending}</strong>
            </div>
            <div>
              <span>{certT.verify}</span>
              <strong>{values.publicationVerificationSlug || values.publicationPublicSlug || dictionary.common.notSetYet}</strong>
            </div>
          </div>
        </div>

        <div className="preview-family-summary">
          <div className="preview-family-summary__head">
            <span className="eyebrow-label">{t.pedigree.treeEyebrow}</span>
            <h3>{t.pedigree.snapshotTitle}</h3>
          </div>

          <div className="preview-family-summary__stats">
            <div>
              <strong>{pedigreeFilledCount}/14</strong>
              <span>{t.pedigree.stats.filledAncestors}</span>
            </div>
            <div>
              <strong>{pedigreePhotoCount}</strong>
              <span>{t.pedigree.stats.ancestorPhotos}</span>
            </div>
          </div>

          <div className="preview-family-summary__parents">
            <div className="preview-family-summary__chip">
              <span>{t.pedigree.relations.father}</span>
              <strong>{fatherName}</strong>
            </div>
            <div className="preview-family-summary__chip">
              <span>{t.pedigree.relations.mother}</span>
              <strong>{motherName}</strong>
            </div>
          </div>

          <p>{t.pedigree.snapshotHint}</p>
        </div>

        <div className="preview-long-copy">
          <h3>{t.preview.registryStory}</h3>
          <p>{values.longDescription || t.preview.longFallback}</p>
        </div>
      </div>

      <div className="side-info-card compact">
        <h3>{t.preview.persistenceTitle}</h3>
        <p>{persistenceStateLabel ?? t.preview.persistenceFallback}</p>
      </div>
    </aside>
  );
}
