import type {
  ExecuteDogProfileActionInput,
  UpsertDogProfileInput,
} from '@cane-corso-platform/contracts';
import type { DogFormValues } from './dog-form.types';
import { normalizePedigreeProfile } from './dog-pedigree';

function uniqueGallery(urls: string[]): string[] {
  const seen = new Set<string>();
  const next: string[] = [];

  for (const value of urls) {
    const normalized = value.trim();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    next.push(normalized);
    if (next.length === 3) {
      break;
    }
  }

  return next;
}

export function createSlugFromName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function normalizeDogFormValues(values: DogFormValues): DogFormValues {
  const normalizedMainImage = values.mainImageUrl.trim();
  const normalizedGallery = uniqueGallery([
    normalizedMainImage,
    ...values.galleryImageUrls.map((item) => item.trim()),
  ]);

  return {
    ...values,
    name: values.name.trim(),
    slug: values.slug.trim().toLowerCase(),
    color: values.color.trim(),
    microchipNumber: values.microchipNumber.trim(),
    pedigreeNumber: values.pedigreeNumber.trim(),
    shortDescription: values.shortDescription.trim(),
    longDescription: values.longDescription.trim(),
    city: values.city.trim(),
    country: values.country.trim(),
    bloodlineNote: values.bloodlineNote.trim(),
    mainImageUrl: normalizedMainImage,
    galleryImageUrls: normalizedGallery,
    publicationPublicSlug: values.publicationPublicSlug.trim(),
    publicationVerificationSlug: values.publicationVerificationSlug.trim(),
    publicationCertificateCode: values.publicationCertificateCode.trim(),
    publicationPublishedAt: values.publicationPublishedAt.trim(),
    pedigree: normalizePedigreeProfile(values.pedigree),
  };
}

export function mapDogFormValuesToActionInput(
  values: DogFormValues,
  intent: ExecuteDogProfileActionInput['intent'],
  dogId?: string,
): ExecuteDogProfileActionInput {
  const normalized = normalizeDogFormValues({
    ...values,
    slug: values.slug || createSlugFromName(values.name),
  });

  return {
    intent,
    profile: {
      dogId: dogId ?? null,
      name: normalized.name,
      slug: normalized.slug,
      sex: normalized.sex,
      dateOfBirth: normalized.dateOfBirth || null,
      color: normalized.color || null,
      microchipNumber: normalized.microchipNumber || null,
      pedigreeNumber: normalized.pedigreeNumber || null,
      shortDescription: normalized.shortDescription || null,
      longDescription: normalized.longDescription || null,
      visibility: normalized.visibility,
      lifecycleStatus: normalized.lifecycleStatus,
      city: normalized.city || null,
      country: normalized.country || null,
      bloodlineNote: normalized.bloodlineNote || null,
      registryClass: normalized.registryClass,
      pedigree: normalized.pedigree,
      mainImageUrl: normalized.mainImageUrl || null,
      galleryImageUrls: normalized.galleryImageUrls,
    },
  };
}

export function mapActionProfileToDogFormValues(profile: UpsertDogProfileInput): DogFormValues {
  const galleryImageUrls = uniqueGallery([
    profile.mainImageUrl ?? '',
    ...((profile.galleryImageUrls ?? []) as string[]),
  ]);
  const mainImageUrl = profile.mainImageUrl ?? galleryImageUrls[0] ?? '';

  return {
    name: profile.name,
    slug: profile.slug,
    sex: profile.sex,
    dateOfBirth: profile.dateOfBirth ?? '',
    color: profile.color ?? '',
    microchipNumber: profile.microchipNumber ?? '',
    pedigreeNumber: profile.pedigreeNumber ?? '',
    visibility: profile.visibility,
    lifecycleStatus: profile.lifecycleStatus,
    shortDescription: profile.shortDescription ?? '',
    longDescription: profile.longDescription ?? '',
    city: profile.city ?? '',
    country: profile.country ?? '',
    bloodlineNote: profile.bloodlineNote ?? '',
    registryClass: profile.registryClass ?? 'owner_declared_cane_corso',
    pedigree: normalizePedigreeProfile(profile.pedigree),
    mainImageUrl,
    galleryImageUrls,
    publicationPublicSlug: '',
    publicationVerificationSlug: '',
    publicationCertificateCode: '',
    publicationPublishedAt: '',
  };
}

export function formatPersistedAtLabel(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
