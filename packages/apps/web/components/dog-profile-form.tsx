"use client";

import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { FormSectionCard } from './form-section-card';
import { PedigreeEditor } from './pedigree-editor';
import { PedigreeTree } from './pedigree-tree';
import { StatusBadge } from './status-badge';
import { LuxurySelect } from './luxury-select';
import type { DogFormErrors, DogFormValues, DogSex } from '../lib/dog-form.types';
import { useLocale } from '@/components/locale-provider';
import { getPedigreeFilledCount, getPedigreePhotoCount } from '@/lib/dog-pedigree';
import type { DogAncestorProfile, DogAncestorRelationKey } from '@cane-corso-platform/contracts';
import { ImageLightbox } from '@/components/image-lightbox';

const imageUploadCopy = {
  en: {
    eyebrow: 'Profile gallery',
    title: 'Upload up to 3 Cane Corso images',
    description:
      'Choose up to three strong local images for this Cane Corso. One image stays primary for the profile, and the others remain in the member gallery on this page.',
    add: 'Upload images',
    addMore: 'Add one more',
    replace: 'Replace primary image',
    remove: 'Remove image',
    setPrimary: 'Set as primary',
    currentPrimary: 'Primary image',
    hint: 'JPG, PNG, or WEBP from your local computer. Main Cane Corso: up to 3 images. Ancestors: 1 image each.',
    processing: 'Preparing images...',
    downloadPreview: 'Preview USG image',
    download: 'Download USG image',
    slotsLeft: 'slots left',
  },
  bg: {
    eyebrow: 'Галерия на профила',
    title: 'Качи до 3 снимки на Cane Corso',
    description:
      'Избери до три силни локални снимки за това Cane Corso. Една остава основна за профила, а другите се пазят в галерията на тази страница.',
    add: 'Качи снимки',
    addMore: 'Добави още една',
    replace: 'Смени основната снимка',
    remove: 'Премахни снимката',
    setPrimary: 'Направи основна',
    currentPrimary: 'Основна снимка',
    hint: 'JPG, PNG или WEBP от твоето устройство. Главен Cane Corso: до 3 снимки. Предци: по 1 снимка.',
    processing: 'Подготвям снимките...',
    downloadPreview: 'Покажи USG снимка',
    download: 'Изтегли USG снимка',
    slotsLeft: 'свободни места',
  },
  it: {
    eyebrow: 'Galleria profilo',
    title: 'Carica fino a 3 immagini del Cane Corso',
    description:
      'Scegli fino a tre immagini locali forti per questo Cane Corso. Una resta primaria per il profilo, le altre rimangono nella galleria membro di questa pagina.',
    add: 'Carica immagini',
    addMore: 'Aggiungi ancora una',
    replace: 'Sostituisci immagine primaria',
    remove: 'Rimuovi immagine',
    setPrimary: 'Imposta come primaria',
    currentPrimary: 'Immagine primaria',
    hint: 'JPG, PNG o WEBP dal tuo computer. Cane Corso principale: fino a 3 immagini. Antenati: 1 immagine ciascuno.',
    processing: 'Preparazione immagini...',
    downloadPreview: 'Anteprima immagine USG',
    download: 'Scarica immagine USG',
    slotsLeft: 'slot rimasti',
  },
} as const;

const evaluationCopy = {
  en: {
    eyebrow: 'USG review',
    title: 'Evaluation, publication, and certificate',
    description:
      'This zone shows how the Cane Corso stands in the registry flow and whether a separate USG certificate has been issued.',
    reviewStage: 'Review stage',
    registryClass: 'Registry class',
    publication: 'Public status',
    certificate: 'Certificate',
    waiting: 'Awaiting a separate certificate decision',
    ready: 'Ready after a separate certificate decision',
    issued: 'USG certificate issued',
    showCertificate: 'Show certificate',
    downloadCertificate: 'Download certificate',
    noCertificate: 'A certificate appears only after a separate USG certificate decision.',
    photoCount: 'Main photos',
  },
  bg: {
    eyebrow: 'USG преглед',
    title: 'Оценяване, публикация и сертификат',
    description:
      'Тук се вижда как стои Cane Corso в потока на регистъра и дали има отделно издаден USG сертификат.',
    reviewStage: 'Етап на преглед',
    registryClass: 'Клас в регистъра',
    publication: 'Публичен статус',
    certificate: 'Сертификат',
    waiting: 'Очаква отделно решение за сертификат',
    ready: 'Готов след отделно решение за сертификат',
    issued: 'USG сертификатът е издаден',
    showCertificate: 'Покажи сертификата',
    downloadCertificate: 'Изтегли сертификата',
    noCertificate: 'Сертификатът се появява само след отделно решение за USG сертификат.',
    photoCount: 'Главни снимки',
  },
  it: {
    eyebrow: 'Revisione USG',
    title: 'Valutazione, pubblicazione e certificato',
    description:
      'Questa zona mostra come sta il Cane Corso nel flusso del registro e se è stato emesso un certificato USG separato.',
    reviewStage: 'Fase revisione',
    registryClass: 'Classe registro',
    publication: 'Stato pubblico',
    certificate: 'Certificato',
    waiting: 'In attesa di una decisione separata sul certificato',
    ready: 'Pronto dopo una decisione separata sul certificato',
    issued: 'Certificato USG emesso',
    showCertificate: 'Mostra certificato',
    downloadCertificate: 'Scarica certificato',
    noCertificate: 'Il certificato appare solo dopo una decisione separata sul certificato USG.',
    photoCount: 'Foto principali',
  },
} as const;

async function loadImage(source: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load image.'));
    image.src = source;
  });
}

async function optimizeImageToDataUrl(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const maxWidth = 1600;
    const maxHeight = 1600;
    const scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight, 1);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to prepare the selected image.');
    }

    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL('image/webp', 0.9);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function buildBrandedImageDataUrl(
  imageUrl: string,
  options: { dogName: string; slug: string; registryClass: string; locale: 'en' | 'bg' | 'it'; isCertified?: boolean },
): Promise<string> {
  const image = await loadImage(imageUrl);
  const canvas = document.createElement('canvas');
  const width = 1600;
  const height = 1600;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas is not available.');
  }

  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;

  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

  const gradient = context.createLinearGradient(0, height * 0.58, 0, height);
  gradient.addColorStop(0, 'rgba(4, 5, 10, 0.04)');
  gradient.addColorStop(1, 'rgba(4, 5, 10, 0.76)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.save();
  context.translate(width * 0.52, height * 0.38);
  context.rotate(-0.32);
  context.font = '700 64px serif';
  context.fillStyle = 'rgba(212, 175, 55, 0.15)';
  context.textAlign = 'center';
  context.fillText('UNICO SUO GENERE • USG PLATFORM', 0, 0);
  context.restore();

  if (options.isCertified) {
    context.save();
    context.translate(width * 0.5, height * 0.52);
    context.rotate(-0.18);
    context.font = '700 124px serif';
    context.fillStyle = 'rgba(212, 175, 55, 0.09)';
    context.textAlign = 'center';
    context.fillText('USG', 0, 0);
    context.font = '700 30px sans-serif';
    context.fillStyle = 'rgba(248, 245, 239, 0.16)';
    context.fillText('APPROVED • UNICO SUO GENERE PLATFORM', 0, 54);
    context.restore();
  }

  context.strokeStyle = 'rgba(212, 175, 55, 0.82)';
  context.lineWidth = 4;
  context.beginPath();
  context.arc(width - 128, 126, 74, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = 'rgba(8, 10, 16, 0.52)';
  context.beginPath();
  context.arc(width - 128, 126, 70, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#d4af37';
  context.font = '700 42px serif';
  context.textAlign = 'center';
  context.fillText('USG', width - 128, 140);

  context.textAlign = 'left';
  context.fillStyle = '#f8f5ef';
  context.font = '700 64px serif';
  context.fillText(options.dogName || 'Cane Corso', 84, height - 170);
  context.font = '500 28px sans-serif';
  context.fillStyle = 'rgba(248, 245, 239, 0.88)';
  context.fillText(options.registryClass, 84, height - 122);
  context.fillText(`USG Platform • ${options.slug || 'draft-profile'}`, 84, height - 82);
  if (options.isCertified) {
    context.fillStyle = '#d4af37';
    context.font = '700 24px sans-serif';
    context.fillText('USG approved image', 84, height - 42);
  }
  const footer = {
    en: 'Downloaded from USG Platform',
    bg: 'Свалено от USG Platform',
    it: 'Scaricato da USG Platform',
  }[options.locale];
  context.fillStyle = 'rgba(248, 245, 239, 0.88)';
  context.font = '500 28px sans-serif';
  context.fillText(footer, 84, height - (options.isCertified ? 8 : 42));

  return canvas.toDataURL('image/png');
}

function buildCertificateDataUrl(options: {
  locale: 'en' | 'bg' | 'it';
  dogName: string;
  sexLabel: string;
  color: string;
  birthDate: string;
  registryClass: string;
  city: string;
  country: string;
  certificateCode: string;
  verificationSlug: string;
  issueDate: string;
  imageUrl?: string;
}) {
  const header = {
    en: 'USG Certificate',
    bg: 'USG Сертификат',
    it: 'Certificato USG',
  }[options.locale];
  const subheader = {
    en: 'UNICO SUO GENERE • Certified Cane Corso Presence',
    bg: 'UNICO SUO GENERE • Сертифицирано Cane Corso присъствие',
    it: 'UNICO SUO GENERE • Presenza Cane Corso certificata',
  }[options.locale];
  const imageMarkup = options.imageUrl
    ? `<image href="${options.imageUrl}" x="110" y="188" width="280" height="280" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip)" />`
    : `<rect x="110" y="188" width="280" height="280" rx="28" fill="rgba(248,245,239,0.08)" stroke="rgba(212,175,55,0.3)" />\n       <text x="250" y="340" text-anchor="middle" fill="#d4af37" font-size="42" font-family="Georgia">USG</text>`;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="980" viewBox="0 0 1400 980">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#06080d"/>
        <stop offset="100%" stop-color="#0f1623"/>
      </linearGradient>
      <clipPath id="photoClip"><rect x="110" y="188" width="280" height="280" rx="28" /></clipPath>
    </defs>
    <rect width="1400" height="980" fill="url(#bg)"/>
    <text x="700" y="520" text-anchor="middle" fill="rgba(212,175,55,0.06)" font-size="190" font-family="Georgia" font-weight="700" transform="rotate(-16 700 520)">USG</text>
    <text x="700" y="604" text-anchor="middle" fill="rgba(248,245,239,0.12)" font-size="28" font-family="Arial" letter-spacing="6" transform="rotate(-16 700 604)">DOWNLOADED FROM USG PLATFORM</text>
    <rect x="40" y="40" width="1320" height="900" rx="34" fill="none" stroke="#d4af37" stroke-width="2"/>
    <circle cx="1232" cy="142" r="64" fill="rgba(212,175,55,0.08)" stroke="#d4af37" stroke-width="2"/>
    <text x="1232" y="155" text-anchor="middle" fill="#d4af37" font-size="40" font-family="Georgia" font-weight="700">USG</text>
    <text x="110" y="122" fill="#d4af37" font-size="18" font-family="Arial" letter-spacing="6">UNICO SUO GENERE</text>
    <text x="110" y="170" fill="#f8f5ef" font-size="54" font-family="Georgia" font-weight="700">${header}</text>
    <text x="110" y="208" fill="rgba(248,245,239,0.82)" font-size="24" font-family="Arial">${subheader}</text>
    ${imageMarkup}
    <text x="440" y="262" fill="#f8f5ef" font-size="52" font-family="Georgia" font-weight="700">${options.dogName || 'Cane Corso'}</text>
    <text x="440" y="304" fill="rgba(248,245,239,0.82)" font-size="24" font-family="Arial">${options.registryClass}</text>
    <g fill="#f8f5ef" font-family="Arial" font-size="22">
      <text x="440" y="370">Sex / Пол: <tspan fill="#d4af37">${options.sexLabel}</tspan></text>
      <text x="440" y="410">Color / Цвят: <tspan fill="#d4af37">${options.color || '—'}</tspan></text>
      <text x="440" y="450">Birth date / Рождена дата: <tspan fill="#d4af37">${options.birthDate || '—'}</tspan></text>
      <text x="440" y="490">Location / Локация: <tspan fill="#d4af37">${[options.city, options.country].filter(Boolean).join(', ') || '—'}</tspan></text>
    </g>
    <g transform="translate(110 560)">
      <rect width="1180" height="250" rx="28" fill="rgba(248,245,239,0.03)" stroke="rgba(212,175,55,0.3)"/>
      <text x="48" y="70" fill="#d4af37" font-size="18" font-family="Arial" letter-spacing="4">CERTIFICATE DATA</text>
      <text x="48" y="122" fill="#f8f5ef" font-size="30" font-family="Georgia">Certificate code</text>
      <text x="48" y="160" fill="#f8f5ef" font-size="22" font-family="Arial">${options.certificateCode}</text>
      <text x="48" y="210" fill="rgba(248,245,239,0.82)" font-size="20" font-family="Arial">Verification: ${options.verificationSlug}</text>
      <text x="780" y="122" fill="#f8f5ef" font-size="30" font-family="Georgia">Issue date</text>
      <text x="780" y="160" fill="#f8f5ef" font-size="22" font-family="Arial">${options.issueDate}</text>
      <text x="780" y="210" fill="rgba(248,245,239,0.82)" font-size="20" font-family="Arial">Downloaded through USG Platform</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function uniqueGallery(urls: string[]) {
  return Array.from(new Set(urls.filter(Boolean))).slice(0, 3);
}

interface DogProfileFormProps {
  mode: 'create' | 'edit';
  values: DogFormValues;
  errors: DogFormErrors;
  dogId?: string;
  submitMessage?: string | null;
  pendingIntent?: 'save_draft' | 'submit_for_review' | null;
  lastPersistedAtLabel?: string | null;
  onFieldChange: <K extends keyof DogFormValues>(field: K, value: DogFormValues[K]) => void;
  onAncestorChange: <K extends keyof DogAncestorProfile>(
    relationKey: DogAncestorRelationKey,
    field: K,
    value: DogAncestorProfile[K],
  ) => void;
  onGenerateSlug: () => void;
  onValidateProfile: () => void;
  onSaveDraft: () => void;
  onSubmitForReview: () => void;
}

export function DogProfileForm({
  mode,
  values,
  errors,
  dogId,
  submitMessage,
  pendingIntent = null,
  lastPersistedAtLabel,
  onFieldChange,
  onAncestorChange,
  onGenerateSlug,
  onValidateProfile,
  onSaveDraft,
  onSubmitForReview,
}: DogProfileFormProps) {
  const { locale, dictionary } = useLocale();
  const t = dictionary.form;
  const imageT = imageUploadCopy[locale];
  const reviewT = evaluationCopy[locale];
  const [isPedigreeVisible, setIsPedigreeVisible] = useState(false);
  const [isPreparingImages, setIsPreparingImages] = useState(false);
  const [assetPreview, setAssetPreview] = useState<{ title: string; url: string } | null>(null);
  const mainImageInputRef = useRef<HTMLInputElement | null>(null);
  const errorCount = Object.keys(errors).length;
  const isSavingDraft = pendingIntent === 'save_draft';
  const isSubmittingForReview = pendingIntent === 'submit_for_review';
  const isBusy = pendingIntent !== null;
  const pedigreeFilledCount = getPedigreeFilledCount(values.pedigree);
  const pedigreePhotoCount = getPedigreePhotoCount(values.pedigree);
  const galleryImages = uniqueGallery([values.mainImageUrl, ...values.galleryImageUrls]);
  const remainingSlots = Math.max(0, 3 - galleryImages.length);
  const hasCertificate = Boolean(values.publicationCertificateCode);
  const certificateCode =
    values.publicationCertificateCode ||
    (hasCertificate ? `USG-${(values.slug || values.name || 'draft').toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 28)}` : '');
  const verificationSlug = values.publicationVerificationSlug || values.publicationPublicSlug || values.slug || 'draft-profile';
  const publicationLabel = values.visibility === 'public' ? t.fields.public : t.fields.private;
  const editingTitle =
    mode === 'create'
      ? t.actions.draftFlow
      : values.name.trim()
        ? `${t.actions.editingProfile} ${values.name.trim()}`
        : t.actions.editingProfile;
  const fieldClassName = (field: keyof DogFormValues) =>
    `field-input${errors[field as keyof DogFormErrors] ? ' is-invalid' : ''}`;
  const textAreaClassName = (field: keyof DogFormValues, size: 'small' | 'large') =>
    `field-textarea ${size}${errors[field as keyof DogFormErrors] ? ' is-invalid' : ''}`;

  const withCurrentValue = (options: Array<{ value: string; label: string }>, currentValue: string) => {
    const normalizedCurrentValue = currentValue.trim();

    if (!normalizedCurrentValue || options.some((option) => option.value === normalizedCurrentValue)) {
      return options;
    }

    return [options[0], { value: normalizedCurrentValue, label: normalizedCurrentValue }, ...options.slice(1)];
  };

  const colorOptions = useMemo(
    () =>
      withCurrentValue(
        [
          { value: '', label: t.placeholders.selectColor },
          { value: 'Black', label: t.options.colors.black },
          { value: 'Black Brindle', label: t.options.colors.blackBrindle },
          { value: 'Grey', label: t.options.colors.grey },
          { value: 'Grey Brindle', label: t.options.colors.greyBrindle },
          { value: 'Formentino', label: t.options.colors.formentino },
          { value: 'Fawn', label: t.options.colors.fawn },
          { value: 'Red', label: t.options.colors.red },
          { value: 'Chestnut Brindle', label: t.options.colors.chestnutBrindle },
          { value: 'Blue', label: t.options.colors.blue },
          { value: 'Other', label: t.options.colors.other },
        ],
        values.color,
      ),
    [t.options.colors, t.placeholders.selectColor, values.color],
  );

  const countryOptions = useMemo(
    () =>
      withCurrentValue(
        [
          { value: '', label: t.placeholders.selectCountry },
          { value: 'Bulgaria', label: t.options.countries.bulgaria },
          { value: 'Italy', label: t.options.countries.italy },
          { value: 'Serbia', label: t.options.countries.serbia },
          { value: 'Romania', label: t.options.countries.romania },
          { value: 'Greece', label: t.options.countries.greece },
          { value: 'North Macedonia', label: t.options.countries.northMacedonia },
          { value: 'Albania', label: t.options.countries.albania },
          { value: 'Montenegro', label: t.options.countries.montenegro },
          { value: 'Croatia', label: t.options.countries.croatia },
          { value: 'Slovenia', label: t.options.countries.slovenia },
          { value: 'Bosnia and Herzegovina', label: t.options.countries.bosniaAndHerzegovina },
          { value: 'Germany', label: t.options.countries.germany },
          { value: 'France', label: t.options.countries.france },
          { value: 'Spain', label: t.options.countries.spain },
          { value: 'Portugal', label: t.options.countries.portugal },
          { value: 'Netherlands', label: t.options.countries.netherlands },
          { value: 'Belgium', label: t.options.countries.belgium },
          { value: 'Austria', label: t.options.countries.austria },
          { value: 'Switzerland', label: t.options.countries.switzerland },
          { value: 'United Kingdom', label: t.options.countries.unitedKingdom },
          { value: 'Ireland', label: t.options.countries.ireland },
          { value: 'Poland', label: t.options.countries.poland },
          { value: 'Czech Republic', label: t.options.countries.czechRepublic },
          { value: 'Slovakia', label: t.options.countries.slovakia },
          { value: 'Hungary', label: t.options.countries.hungary },
          { value: 'Turkey', label: t.options.countries.turkey },
          { value: 'United States', label: t.options.countries.unitedStates },
          { value: 'Canada', label: t.options.countries.canada },
        ],
        values.country,
      ),
    [t.options.countries, t.placeholders.selectCountry, values.country],
  );

  const registryClassOptions = [
    { value: 'verified_pedigree', label: t.registryClass.verified_pedigree },
    { value: 'documented_without_pedigree', label: t.registryClass.documented_without_pedigree },
    { value: 'owner_declared_cane_corso', label: t.registryClass.owner_declared_cane_corso },
    { value: 'rescue_unknown_lineage', label: t.registryClass.rescue_unknown_lineage },
  ];

  const applyGallery = (nextImages: string[]) => {
    const uniqueImages = uniqueGallery(nextImages);
    onFieldChange('galleryImageUrls', uniqueImages);
    onFieldChange('mainImageUrl', uniqueImages[0] ?? '');
  };

  const handleMainImagesSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (!files.length) {
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (!imageFiles.length) {
      return;
    }

    const allowedFiles = galleryImages.length >= 3 ? imageFiles.slice(0, 1) : imageFiles.slice(0, Math.max(0, 3 - galleryImages.length));

    setIsPreparingImages(true);

    try {
      const prepared = await Promise.all(allowedFiles.map((file) => optimizeImageToDataUrl(file)));

      if (galleryImages.length >= 3 && prepared[0]) {
        const preserved = galleryImages.filter((item) => item !== values.mainImageUrl).slice(0, 2);
        applyGallery([prepared[0], ...preserved]);
      } else {
        applyGallery([...galleryImages, ...prepared]);
      }
    } finally {
      setIsPreparingImages(false);
    }
  };

  const handleRemoveGalleryImage = (imageUrl: string) => {
    applyGallery(galleryImages.filter((item) => item !== imageUrl));
  };

  const handleSetPrimaryImage = (imageUrl: string) => {
    applyGallery([imageUrl, ...galleryImages.filter((item) => item !== imageUrl)]);
  };

  const handlePreviewBrandedImage = async () => {
    if (!values.mainImageUrl) {
      return;
    }

    const brandedUrl = await buildBrandedImageDataUrl(values.mainImageUrl, {
      dogName: values.name || t.preview.unnamed,
      slug: values.slug || 'draft-profile',
      registryClass: t.registryClass[values.registryClass],
      locale,
      isCertified: Boolean(values.publicationCertificateCode),
    });
    setAssetPreview({ title: imageT.downloadPreview, url: brandedUrl });
  };

  const handleDownloadBrandedImage = async () => {
    if (!values.mainImageUrl) {
      return;
    }

    const brandedUrl = await buildBrandedImageDataUrl(values.mainImageUrl, {
      dogName: values.name || t.preview.unnamed,
      slug: values.slug || 'draft-profile',
      registryClass: t.registryClass[values.registryClass],
      locale,
      isCertified: Boolean(values.publicationCertificateCode),
    });
    downloadDataUrl(brandedUrl, `${values.slug || 'cane-corso'}-usg-image.png`);
  };

  const openCertificatePreview = () => {
    if (!hasCertificate) {
      return;
    }

    const certificateUrl = buildCertificateDataUrl({
      locale,
      dogName: values.name || 'Cane Corso',
      sexLabel: values.sex === 'male' ? t.fields.male : t.fields.female,
      color: values.color,
      birthDate: values.dateOfBirth,
      registryClass: t.registryClass[values.registryClass],
      city: values.city,
      country: values.country,
      certificateCode,
      verificationSlug,
      issueDate: (values.publicationPublishedAt || new Date().toISOString()).slice(0, 10),
      imageUrl: values.mainImageUrl || undefined,
    });

    setAssetPreview({ title: reviewT.showCertificate, url: certificateUrl });
  };

  const handleDownloadCertificate = () => {
    if (!hasCertificate) {
      return;
    }

    const certificateUrl = buildCertificateDataUrl({
      locale,
      dogName: values.name || 'Cane Corso',
      sexLabel: values.sex === 'male' ? t.fields.male : t.fields.female,
      color: values.color,
      birthDate: values.dateOfBirth,
      registryClass: t.registryClass[values.registryClass],
      city: values.city,
      country: values.country,
      certificateCode,
      verificationSlug,
      issueDate: (values.publicationPublishedAt || new Date().toISOString()).slice(0, 10),
      imageUrl: values.mainImageUrl || undefined,
    });

    downloadDataUrl(certificateUrl, `${values.slug || 'cane-corso'}-usg-certificate.svg`);
  };

  return (
    <div className="form-stack">
      <FormSectionCard
        title={mode === 'create' ? t.sections.foundationTitleCreate : t.sections.foundationTitleEdit}
        description={t.sections.foundationDescription}
      >
        <div className="dog-profile-cover-panel">
          <div className={`dog-profile-cover-panel__visual${values.mainImageUrl ? ' has-image' : ''}`}>
            {values.mainImageUrl ? (
              <ImageLightbox src={values.mainImageUrl} alt={values.name || t.preview.unnamed} imageClassName="dog-profile-cover-panel__image" />
            ) : (
              <span>{mode === 'create' ? t.preview.newCover : t.preview.currentCover}</span>
            )}
          </div>

          <div className="dog-profile-cover-panel__copy">
            <span className="eyebrow-label">{imageT.eyebrow}</span>
            <h3>{imageT.title}</h3>
            <p>{imageT.description}</p>

            <div className="dog-profile-cover-panel__actions">
              <button
                type="button"
                className="button-secondary"
                onClick={() => mainImageInputRef.current?.click()}
                disabled={isBusy || isPreparingImages}
              >
                {isPreparingImages
                  ? imageT.processing
                  : galleryImages.length === 0
                    ? imageT.add
                    : remainingSlots > 0
                      ? imageT.addMore
                      : imageT.replace}
              </button>
            </div>

            <small>{imageT.hint}</small>
            <small>{remainingSlots} {imageT.slotsLeft}</small>

            <input
              ref={mainImageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="dog-profile-cover-panel__input"
              onChange={handleMainImagesSelected}
            />
          </div>
        </div>

        {galleryImages.length > 0 ? (
          <div className="dog-profile-gallery-strip">
            {galleryImages.map((imageUrl, index) => {
              const isPrimary = imageUrl === values.mainImageUrl;
              return (
                <div key={`${imageUrl}-${index}`} className={`dog-profile-gallery-card${isPrimary ? ' is-primary' : ''}`}>
                  <div className="dog-profile-gallery-card__thumb">
                    <ImageLightbox src={imageUrl} alt={values.name || 'Cane Corso'} />
                  </div>
                  <div className="dog-profile-gallery-card__meta">
                    <strong>{isPrimary ? imageT.currentPrimary : `${index + 1}/3`}</strong>
                    <div className="dog-profile-gallery-card__actions">
                      {!isPrimary ? (
                        <button type="button" className="button-ghost small" onClick={() => handleSetPrimaryImage(imageUrl)}>
                          {imageT.setPrimary}
                        </button>
                      ) : null}
                      <button type="button" className="button-ghost small" onClick={() => handleRemoveGalleryImage(imageUrl)}>
                        {imageT.remove}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="form-grid two-up">
          <label className="field-group">
            <span className="field-label">{t.fields.name}</span>
            <input
              className={fieldClassName('name')}
              value={values.name}
              onChange={(event) => onFieldChange('name', event.target.value)}
              placeholder={t.placeholders.name}
            />
            {errors.name ? <span className="field-error">{errors.name}</span> : null}
          </label>

          <label className="field-group">
            <span className="field-label">{t.fields.slug}</span>
            <div className="inline-field-row">
              <input
                className={fieldClassName('slug')}
                value={values.slug}
                onChange={(event) => onFieldChange('slug', event.target.value)}
                placeholder={t.placeholders.slug}
              />
              <button type="button" className="button-ghost small" onClick={onGenerateSlug} disabled={isBusy}>
                {dictionary.common.auto}
              </button>
            </div>
            {errors.slug ? <span className="field-error">{errors.slug}</span> : null}
          </label>

          <label className="field-group">
            <span className="field-label">{t.fields.sex}</span>
            <LuxurySelect
              value={values.sex}
              onValueChange={(nextValue) => onFieldChange('sex', nextValue as DogSex)}
              invalid={Boolean(errors.sex)}
              options={[
                { value: 'male', label: t.fields.male },
                { value: 'female', label: t.fields.female },
              ]}
            />
          </label>

          <label className="field-group">
            <span className="field-label">{t.fields.birthDate}</span>
            <input
              className={fieldClassName('dateOfBirth')}
              type="date"
              value={values.dateOfBirth}
              onChange={(event) => onFieldChange('dateOfBirth', event.target.value)}
            />
            {errors.dateOfBirth ? <span className="field-error">{errors.dateOfBirth}</span> : null}
          </label>

          <label className="field-group">
            <span className="field-label">{t.fields.color}</span>
            <LuxurySelect
              value={values.color}
              onValueChange={(nextValue) => onFieldChange('color', nextValue)}
              invalid={Boolean(errors.color)}
              options={colorOptions}
            />
            {errors.color ? <span className="field-error">{errors.color}</span> : null}
          </label>

          <label className="field-group">
            <span className="field-label">{t.fields.microchip}</span>
            <input
              className={fieldClassName('microchipNumber')}
              value={values.microchipNumber}
              onChange={(event) => onFieldChange('microchipNumber', event.target.value)}
              placeholder={t.placeholders.microchip}
            />
            {errors.microchipNumber ? <span className="field-error">{errors.microchipNumber}</span> : null}
          </label>

          <label className="field-group">
            <span className="field-label">{t.fields.pedigree}</span>
            <input
              className={fieldClassName('pedigreeNumber')}
              value={values.pedigreeNumber}
              onChange={(event) => onFieldChange('pedigreeNumber', event.target.value)}
              placeholder={t.placeholders.pedigree}
            />
            {errors.pedigreeNumber ? <span className="field-error">{errors.pedigreeNumber}</span> : null}
          </label>

          <label className="field-group">
            <span className="field-label">{t.fields.registryClass}</span>
            <LuxurySelect
              value={values.registryClass}
              onValueChange={(nextValue) => onFieldChange('registryClass', nextValue as DogFormValues['registryClass'])}
              invalid={Boolean(errors.registryClass)}
              options={registryClassOptions}
            />
          </label>

          <label className="field-group">
            <span className="field-label">{t.fields.bloodline}</span>
            <input
              className={fieldClassName('bloodlineNote')}
              value={values.bloodlineNote}
              onChange={(event) => onFieldChange('bloodlineNote', event.target.value)}
              placeholder={t.placeholders.bloodline}
            />
          </label>
        </div>

        <div className="registry-class-note">
          <strong>{t.registryClass[values.registryClass]}</strong>
          <p>{t.registryClassDescriptions[values.registryClass]}</p>
        </div>
      </FormSectionCard>

      <FormSectionCard title={t.sections.presentationTitle} description={t.sections.presentationDescription}>
        <div className="form-grid single-column">
          <label className="field-group">
            <span className="field-label">{t.fields.shortDescription}</span>
            <textarea
              className={textAreaClassName('shortDescription', 'small')}
              value={values.shortDescription}
              onChange={(event) => onFieldChange('shortDescription', event.target.value)}
              placeholder={t.placeholders.shortDescription}
            />
            {errors.shortDescription ? <span className="field-error">{errors.shortDescription}</span> : null}
          </label>

          <label className="field-group">
            <span className="field-label">
              {t.fields.longDescription} <span className="field-optional">({dictionary.common.optional})</span>
            </span>
            <textarea
              className={textAreaClassName('longDescription', 'large')}
              value={values.longDescription}
              onChange={(event) => onFieldChange('longDescription', event.target.value)}
              placeholder={t.placeholders.longDescription}
            />
            {errors.longDescription ? <span className="field-error">{errors.longDescription}</span> : null}
          </label>
        </div>
      </FormSectionCard>

      <FormSectionCard title={t.sections.locationTitle} description={t.sections.locationDescription}>
        <div className="form-grid two-up">
          <label className="field-group">
            <span className="field-label">{t.fields.city}</span>
            <input
              className={fieldClassName('city')}
              value={values.city}
              onChange={(event) => onFieldChange('city', event.target.value)}
              placeholder={t.placeholders.city}
            />
            {errors.city ? <span className="field-error">{errors.city}</span> : null}
          </label>

          <label className="field-group">
            <span className="field-label">{t.fields.country}</span>
            <LuxurySelect
              value={values.country}
              onValueChange={(nextValue) => onFieldChange('country', nextValue)}
              invalid={Boolean(errors.country)}
              options={countryOptions}
            />
            {errors.country ? <span className="field-error">{errors.country}</span> : null}
          </label>
        </div>
      </FormSectionCard>

      <FormSectionCard title={t.sections.pedigreeTitle} description={t.sections.pedigreeDescription}>
        <div className="pedigree-disclosure">
          <div className="pedigree-disclosure__bar">
            <div className="pedigree-disclosure__main">
              <div className="pedigree-disclosure__copy">
                <span className="eyebrow-label">{t.pedigree.eyebrow}</span>
                <h3>{t.pedigree.summaryTitle}</h3>
                <p>{t.pedigree.summaryText}</p>
              </div>

              <div className="pedigree-disclosure__stats">
                <div>
                  <strong>{pedigreeFilledCount}/14</strong>
                  <span>{t.pedigree.stats.filledAncestors}</span>
                </div>
                <div>
                  <strong>{pedigreePhotoCount}</strong>
                  <span>{t.pedigree.stats.ancestorPhotos}</span>
                </div>
                <div>
                  <strong>3 + 1</strong>
                  <span>{t.pedigree.stats.photoRule}</span>
                </div>
              </div>
            </div>

            <div className="pedigree-disclosure__actions">
              <button
                type="button"
                className={`button-secondary pedigree-toggle-button${isPedigreeVisible ? ' is-open' : ''}`}
                onClick={() => setIsPedigreeVisible((current) => !current)}
              >
                {isPedigreeVisible ? t.pedigree.hideTree : t.pedigree.progressive?.addParents ?? t.pedigree.showTree}
              </button>
              <a href="/guide?topic=member-workspace#member-workspace" className="button-ghost small pedigree-help-link">
                {t.pedigree.progressive?.helpCta ?? 'Помощ / как се работи'}
              </a>
            </div>
          </div>

          {isPedigreeVisible ? (
            <div className="pedigree-disclosure__body">
              <PedigreeTree
                dogName={values.name}
                pedigree={values.pedigree}
                rootImageUrl={values.mainImageUrl || values.galleryImageUrls[0] || null}
              />
              <PedigreeEditor pedigree={values.pedigree} onAncestorChange={onAncestorChange} />
            </div>
          ) : (
            <div className="pedigree-disclosure__collapsed-note">
              <p>{t.pedigree.collapsedHint}</p>
            </div>
          )}
        </div>
      </FormSectionCard>

      <div className="form-actions-bar">
        <div className="form-actions-copy">
          <strong>{editingTitle}</strong>
          <span>{submitMessage ?? t.actions.saveDraftDefault}</span>
          {lastPersistedAtLabel ? <small>{dictionary.common.lastPersisted}: {lastPersistedAtLabel}</small> : null}
        </div>

        <div className="form-actions-buttons">
          <button type="button" className="button-secondary" onClick={onSaveDraft} disabled={isBusy}>
            {isSavingDraft ? dictionary.common.savingDraft : dictionary.common.saveDraft}
          </button>
          <button type="button" className="button-primary" onClick={onSubmitForReview} disabled={isBusy}>
            {isSubmittingForReview ? dictionary.common.submitting : dictionary.common.submitForReview}
          </button>
        </div>
      </div>

      <div className="dog-form-secondary-panels">
      <div className="validation-banner-row">
        <div className="validation-summary-card">
          <span className="eyebrow-label">{t.validationEyebrow}</span>
          <h3>{errorCount === 0 ? t.validationClean : `${errorCount} ${t.validationDetected}`}</h3>
          <p>{t.validationText}</p>
        </div>

        <div className="validation-actions">
          <button type="button" className="button-secondary" onClick={onGenerateSlug} disabled={isBusy}>
            {dictionary.common.generateSlug}
          </button>
          <button type="button" className="button-ghost" onClick={onValidateProfile} disabled={isBusy}>
            {dictionary.common.runValidation}
          </button>
        </div>
      </div>

      <div className="member-status-panel">
        <div className="member-status-panel__copy">
          <span className="eyebrow-label">{t.ownerStatus.eyebrow}</span>
          <div className="member-status-panel__title-row">
            <h3>{t.ownerStatus.title}</h3>
            <StatusBadge status={values.lifecycleStatus} />
          </div>
          <p>{t.ownerStatus.help[values.lifecycleStatus]}</p>
        </div>
        <div className="member-status-panel__meta">
          <div>
            <strong>{t.registryClass[values.registryClass]}</strong>
            <span>{t.ownerStatus.registryClassLabel}</span>
          </div>
          <div>
            <strong>{publicationLabel}</strong>
            <span>{t.fields.visibility}</span>
          </div>
        </div>
      </div>

      <div className="usg-evaluation-panel">
        <div className="usg-evaluation-panel__copy">
          <span className="eyebrow-label">{reviewT.eyebrow}</span>
          <h3>{reviewT.title}</h3>
          <p>{reviewT.description}</p>
        </div>

        <div className="usg-evaluation-panel__grid">
          <div className="usg-evaluation-card">
            <span>{reviewT.reviewStage}</span>
            <strong>{t.status[values.lifecycleStatus]}</strong>
          </div>
          <div className="usg-evaluation-card">
            <span>{reviewT.registryClass}</span>
            <strong>{t.registryClass[values.registryClass]}</strong>
          </div>
          <div className="usg-evaluation-card">
            <span>{reviewT.publication}</span>
            <strong>{publicationLabel}</strong>
          </div>
          <div className="usg-evaluation-card">
            <span>{reviewT.certificate}</span>
            <strong>{hasCertificate ? reviewT.issued : reviewT.waiting}</strong>
          </div>
          <div className="usg-evaluation-card">
            <span>{reviewT.photoCount}</span>
            <strong>{galleryImages.length}/3</strong>
          </div>
        </div>

        <div className="usg-evaluation-panel__actions">
          <button
            type="button"
            className="button-secondary"
            onClick={() => void handlePreviewBrandedImage()}
            disabled={!values.mainImageUrl}
          >
            {imageT.downloadPreview}
          </button>
          <button
            type="button"
            className="button-ghost"
            onClick={() => void handleDownloadBrandedImage()}
            disabled={!values.mainImageUrl}
          >
            {imageT.download}
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={openCertificatePreview}
            disabled={!hasCertificate}
          >
            {reviewT.showCertificate}
          </button>
          <button
            type="button"
            className="button-ghost"
            onClick={handleDownloadCertificate}
            disabled={!hasCertificate}
          >
            {reviewT.downloadCertificate}
          </button>
        </div>

        {!hasCertificate ? <small>{reviewT.noCertificate}</small> : null}
      </div>

      </div>

      {assetPreview ? (
        <div className="usg-asset-modal" role="dialog" aria-modal="true">
          <div className="usg-asset-modal__backdrop" onClick={() => setAssetPreview(null)} />
          <div className="usg-asset-modal__card">
            <div className="usg-asset-modal__head">
              <h3>{assetPreview.title}</h3>
              <button type="button" className="button-ghost small" onClick={() => setAssetPreview(null)}>
                {locale === 'bg' ? 'Затвори' : locale === 'it' ? 'Chiudi' : 'Close'}
              </button>
            </div>
            <div className="usg-asset-modal__body">
              <ImageLightbox src={assetPreview.url} alt={assetPreview.title} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export type { DogFormErrors, DogFormValues, DogSex } from '../lib/dog-form.types';
