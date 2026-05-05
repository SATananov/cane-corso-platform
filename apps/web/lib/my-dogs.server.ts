import { createMyDogsRepository } from '@cane-corso-platform/db';
import type {
  Dog,
  DogMutationDocument,
  DogProfileDocument,
  DogsCollectionDocument,
  ExecuteDogProfileActionInput,
  UpsertDogProfileInput,
} from '@cane-corso-platform/contracts';
import { getCreateDogDraft } from './dog-form.mock';
import { mapActionProfileToDogFormValues } from './dog-form.helpers';
import type { DogFormErrors, DogFormValues } from './dog-form.types';
import { validateDogForm } from './dog-form.validation';
import { getCurrentMemberSession } from './session.server';

export class DogProfileNotFoundError extends Error {
  readonly dogId: string;

  constructor(dogId: string) {
    super(`Dog ${dogId} was not found for the current member.`);
    this.name = 'DogProfileNotFoundError';
    this.dogId = dogId;
  }
}

export class DogProfileValidationError extends Error {
  readonly fieldErrors: DogFormErrors;

  constructor(fieldErrors: DogFormErrors) {
    super('Submission blocked because the profile still has validation issues.');
    this.name = 'DogProfileValidationError';
    this.fieldErrors = fieldErrors;
  }
}

function mapProfileToValidationInput(profile: UpsertDogProfileInput) {
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
    pedigree: profile.pedigree ?? {},
    mainImageUrl: profile.mainImageUrl ?? '',
    galleryImageUrls: profile.galleryImageUrls ?? (profile.mainImageUrl ? [profile.mainImageUrl] : []),
    publicationPublicSlug: '',
    publicationVerificationSlug: '',
    publicationCertificateCode: '',
    publicationPublishedAt: '',
  };
}

export async function listMemberDogs(options?: { allowDevFallback?: boolean }): Promise<Dog[]> {
  const repository = createMyDogsRepository();
  const { session } = await getCurrentMemberSession(options);
  return repository.listByOwnerProfileId(session.user.profileId);
}

export async function getCurrentMemberDogsDocument(options?: { allowDevFallback?: boolean }): Promise<DogsCollectionDocument> {
  const dogs = await listMemberDogs(options);
  return { dogs };
}

export async function getCurrentMemberDogProfileDocument(
  dogId: string,
  options?: { allowDevFallback?: boolean },
): Promise<DogProfileDocument | null> {
  const repository = createMyDogsRepository();
  const { session } = await getCurrentMemberSession(options);
  const profile = await repository.getProfileInputById(session.user.profileId, dogId);

  if (!profile) {
    return null;
  }

  return {
    dogId,
    profile,
  };
}

export async function getMemberDogFormInitialValues(
  mode: 'create' | 'edit',
  dogId?: string,
  options?: { allowDevFallback?: boolean },
): Promise<DogFormValues> {
  if (mode === 'create' || !dogId) {
    return getCreateDogDraft();
  }

  const document = await getCurrentMemberDogProfileDocument(dogId, options);

  if (document) {
    const mapped = mapActionProfileToDogFormValues(document.profile);
    const dogs = await listMemberDogs(options);
    const matchedDog = dogs.find((dog) => dog.id === document.dogId || dog.slug === dogId);

    if (!matchedDog?.publication) {
      return mapped;
    }

    return {
      ...mapped,
      publicationPublicSlug: matchedDog.publication.publicSlug ?? '',
      publicationVerificationSlug: matchedDog.publication.verificationSlug ?? '',
      publicationCertificateCode: matchedDog.publication.certificateCode ?? '',
      publicationPublishedAt: matchedDog.publication.publishedAt ?? '',
    };
  }

  return getCreateDogDraft();
}

export async function executeCurrentMemberDogAction(
  input: ExecuteDogProfileActionInput,
  options?: { dogId?: string; allowDevFallback?: boolean },
): Promise<{ document: DogMutationDocument; created: boolean }> {
  const repository = createMyDogsRepository();
  const { session } = await getCurrentMemberSession({ allowDevFallback: options?.allowDevFallback });
  const routeDogId = options?.dogId;
  const created = !routeDogId && !input.profile.dogId;

  let profile = input.profile;

  if (routeDogId) {
    const existingProfile = await repository.getProfileInputById(session.user.profileId, routeDogId);

    if (!existingProfile) {
      throw new DogProfileNotFoundError(routeDogId);
    }

    profile = {
      ...profile,
      dogId: routeDogId,
    };
  }

  const fieldErrors = validateDogForm(mapProfileToValidationInput(profile));

  if (input.intent === 'submit_for_review' && Object.keys(fieldErrors).length > 0) {
    throw new DogProfileValidationError(fieldErrors);
  }

  const result = await repository.executeProfileAction(session.user.profileId, {
    ...input,
    profile,
  });

  return {
    document: {
      result,
    },
    created,
  };
}
