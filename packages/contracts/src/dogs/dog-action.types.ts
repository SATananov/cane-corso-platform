import type { EntityId, ISODateString, ISODateTimeString, Slug } from '../common/ids';
import type { DogLifecycleStatus, Visibility } from '../common/status';
import type { DogPedigreeProfile, DogRegistryClass, DogSex } from './dog.types';

export interface UpsertDogProfileInput {
  dogId: EntityId | null;
  name: string;
  slug: Slug;
  sex: DogSex;
  dateOfBirth: ISODateString | null;
  color: string | null;
  microchipNumber: string | null;
  pedigreeNumber: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  visibility: Visibility;
  lifecycleStatus: DogLifecycleStatus;
  city: string | null;
  country: string | null;
  bloodlineNote: string | null;
  registryClass: DogRegistryClass | null;
  pedigree: DogPedigreeProfile | null;
  mainImageUrl: string | null;
  galleryImageUrls?: string[] | null;
}

export type DogProfileActionIntent = 'save_draft' | 'submit_for_review';

export interface ExecuteDogProfileActionInput {
  intent: DogProfileActionIntent;
  profile: UpsertDogProfileInput;
}

export interface ExecuteDogProfileActionResult {
  ok: boolean;
  intent: DogProfileActionIntent;
  dogId: EntityId;
  lifecycleStatus: Extract<DogLifecycleStatus, 'draft' | 'submitted'>;
  message: string;
  persistedAt: ISODateTimeString;
  profile: UpsertDogProfileInput;
}

export type DogProfileDraftPayload = Omit<UpsertDogProfileInput, 'dogId'>;
export type DogProfileMutationIntent = DogProfileActionIntent;
export type DogProfileMutationField = keyof DogProfileDraftPayload;
export type DogProfileMutationFieldErrors = Partial<Record<DogProfileMutationField, string>>;

export interface DogProfileMutationInput {
  dogId?: EntityId;
  intent: DogProfileMutationIntent;
  values: DogProfileDraftPayload;
}

export interface DogProfileMutationResult {
  ok: boolean;
  intent: DogProfileMutationIntent;
  dogId: EntityId | null;
  lifecycleStatus: Extract<DogLifecycleStatus, 'draft' | 'submitted'>;
  message: string;
  fieldErrors?: DogProfileMutationFieldErrors;
  nextHref?: string | null;
}
