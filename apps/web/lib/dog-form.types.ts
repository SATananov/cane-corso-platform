import type {
  DogLifecycleStatus,
  DogPedigreeProfile,
  DogRegistryClass,
} from '@cane-corso-platform/contracts';

export type DogSex = 'male' | 'female';

export interface DogFormValues {
  name: string;
  slug: string;
  sex: DogSex;
  dateOfBirth: string;
  color: string;
  microchipNumber: string;
  pedigreeNumber: string;
  visibility: 'private' | 'public';
  lifecycleStatus: DogLifecycleStatus;
  shortDescription: string;
  longDescription: string;
  city: string;
  country: string;
  bloodlineNote: string;
  registryClass: DogRegistryClass;
  pedigree: DogPedigreeProfile;
  mainImageUrl: string;
  galleryImageUrls: string[];
  publicationPublicSlug: string;
  publicationVerificationSlug: string;
  publicationCertificateCode: string;
  publicationPublishedAt: string;
}

export type DogFormErrors = Partial<Record<Exclude<keyof DogFormValues, 'pedigree' | 'galleryImageUrls' | 'publicationPublicSlug' | 'publicationVerificationSlug' | 'publicationCertificateCode' | 'publicationPublishedAt'>, string>>;
