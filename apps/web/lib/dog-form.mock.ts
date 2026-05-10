import type { DogFormValues } from './dog-form.types';

const baseDraft: DogFormValues = {
  name: '',
  slug: '',
  sex: 'male',
  dateOfBirth: '',
  color: '',
  microchipNumber: '',
  pedigreeNumber: '',
  visibility: 'private',
  lifecycleStatus: 'draft',
  shortDescription: '',
  longDescription: '',
  city: '',
  country: '',
  bloodlineNote: '',
  registryClass: 'owner_declared_cane_corso',
  pedigree: {},
  mainImageUrl: '',
  galleryImageUrls: [],
  publicationPublicSlug: '',
  publicationVerificationSlug: '',
  publicationCertificateCode: '',
  publicationPublishedAt: '',
};

const draftCollection: Record<string, DogFormValues> = {
  'bruno-di-casa-vulcano': {
    name: 'Bruno di Casa Vulcano',
    slug: 'bruno-di-casa-vulcano',
    sex: 'male',
    dateOfBirth: '2023-04-17',
    color: 'Black',
    microchipNumber: '380260002341199',
    pedigreeNumber: 'FCI-CC-2023-118',
    visibility: 'private',
    lifecycleStatus: 'draft',
    shortDescription: 'Young male with strong head structure and balanced movement.',
    longDescription:
      'Bruno is presented as a refined young Cane Corso profile prepared for premium registry presentation, review readiness, and future media expansion.',
    city: 'Plovdiv',
    country: 'Bulgaria',
    bloodlineNote: 'Italian working line reference.',
    registryClass: 'verified_pedigree',
    pedigree: {
      mother: {
        name: 'Gaia del Vesuvio',
        photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
        sex: 'female',
        dateOfBirth: null,
        color: 'Black',
        country: 'Italy',
        titles: 'JCH IT',
        note: 'Strong maternal type.',
      },
      father: {
        name: 'Ares Imperio Nero',
        photoUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80',
        sex: 'male',
        dateOfBirth: null,
        color: 'Black Brindle',
        country: 'Bulgaria',
        titles: 'CH BG',
        note: 'Balanced male with correct head.',
      },
    },
    mainImageUrl: '',
    galleryImageUrls: [],
    publicationPublicSlug: '',
    publicationVerificationSlug: '',
    publicationCertificateCode: '',
    publicationPublishedAt: '',
  },
  'luna-nera-impero': {
    name: 'Luna Nera Impero',
    slug: 'luna-nera-impero',
    sex: 'female',
    dateOfBirth: '2022-09-09',
    color: 'Formentino',
    microchipNumber: '380260002771004',
    pedigreeNumber: 'FCI-CC-2022-067',
    visibility: 'public',
    lifecycleStatus: 'published',
    shortDescription: 'Elegant female profile prepared for public registry exposure.',
    longDescription:
      'Luna combines stable temperament, feminine expression, and a premium profile presentation aligned with the Cane Corso Platform aesthetic.',
    city: 'Sofia',
    country: 'Bulgaria',
    bloodlineNote: 'Balanced show and family line profile.',
    registryClass: 'documented_without_pedigree',
    pedigree: {},
    mainImageUrl: '',
    galleryImageUrls: [],
    publicationPublicSlug: 'luna-nera-impero',
    publicationVerificationSlug: 'luna-nera-impero-verify',
    publicationCertificateCode: 'USG-20260418-IMPERO',
    publicationPublishedAt: '2026-04-18T10:30:00.000Z',
  },
};

export function getCreateDogDraft(): DogFormValues {
  return { ...baseDraft, pedigree: {}, galleryImageUrls: [] };
}

export function getDogDraftById(dogId: string): DogFormValues {
  const draft = draftCollection[dogId];

  if (!draft) {
    return {
      ...baseDraft,
      name: 'Imported dog draft',
      slug: dogId,
      pedigree: {},
      galleryImageUrls: [],
    };
  }

  return {
    ...draft,
    pedigree: { ...draft.pedigree },
    galleryImageUrls: [...draft.galleryImageUrls],
  };
}
