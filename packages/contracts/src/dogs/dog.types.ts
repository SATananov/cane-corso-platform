import type { EntityId, ISODateString, ISODateTimeString, Slug } from '../common/ids';
import type { DogLifecycleStatus, Visibility } from '../common/status';

export type DogSex = 'unknown' | 'male' | 'female';

export type DogRegistryClass =
  | 'verified_pedigree'
  | 'documented_without_pedigree'
  | 'owner_declared_cane_corso'
  | 'rescue_unknown_lineage';

export type DogAncestorRelationKey =
  | 'mother'
  | 'father'
  | 'motherMother'
  | 'motherFather'
  | 'fatherMother'
  | 'fatherFather'
  | 'motherMotherMother'
  | 'motherMotherFather'
  | 'motherFatherMother'
  | 'motherFatherFather'
  | 'fatherMotherMother'
  | 'fatherMotherFather'
  | 'fatherFatherMother'
  | 'fatherFatherFather';

export interface DogAncestorProfile {
  name: string;
  photoUrl: string | null;
  sex: DogSex | null;
  dateOfBirth: ISODateString | null;
  color: string | null;
  country: string | null;
  titles: string | null;
  note: string | null;
}

export type DogPedigreeProfile = Partial<Record<DogAncestorRelationKey, DogAncestorProfile>>;

export interface DogPublicationState {
  publicSlug: Slug;
  publishedAt: ISODateTimeString;
  certificateCode: string | null;
  verificationSlug: Slug | null;
}

export interface Dog {
  id: EntityId;
  ownerProfileId: EntityId;
  name: string;
  slug: Slug;
  sex: DogSex;
  dateOfBirth: ISODateString | null;
  color: string | null;
  microchipNumber: string | null;
  pedigreeNumber: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  registryClass: DogRegistryClass | null;
  pedigree: DogPedigreeProfile | null;
  mainImageUrl: string | null;
  visibility: Visibility;
  lifecycleStatus: DogLifecycleStatus;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
  publication: DogPublicationState | null;
}
