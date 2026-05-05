'use server';

import { revalidatePath } from 'next/cache';
import type {
  ExecuteDogProfileActionInput,
  ExecuteDogProfileActionResult,
} from '@cane-corso-platform/contracts';
import { validateDogForm } from '../../../lib/dog-form.validation';
import {
  DogProfileValidationError,
  executeCurrentMemberDogAction,
} from '../../../lib/my-dogs.server';

export async function commitDogProfileAction(
  input: ExecuteDogProfileActionInput,
): Promise<ExecuteDogProfileActionResult> {
  const validationErrors = validateDogForm({
    name: input.profile.name,
    slug: input.profile.slug,
    sex: input.profile.sex,
    dateOfBirth: input.profile.dateOfBirth ?? '',
    color: input.profile.color ?? '',
    microchipNumber: input.profile.microchipNumber ?? '',
    pedigreeNumber: input.profile.pedigreeNumber ?? '',
    visibility: input.profile.visibility,
    lifecycleStatus: input.profile.lifecycleStatus,
    shortDescription: input.profile.shortDescription ?? '',
    longDescription: input.profile.longDescription ?? '',
    city: input.profile.city ?? '',
    country: input.profile.country ?? '',
    bloodlineNote: input.profile.bloodlineNote ?? '',
    registryClass: input.profile.registryClass ?? 'owner_declared_cane_corso',
    pedigree: input.profile.pedigree ?? {},
    mainImageUrl: input.profile.mainImageUrl ?? '',
    galleryImageUrls: input.profile.galleryImageUrls ?? (input.profile.mainImageUrl ? [input.profile.mainImageUrl] : []),
    publicationPublicSlug: '',
    publicationVerificationSlug: '',
    publicationCertificateCode: '',
    publicationPublishedAt: '',
  });

  if (input.intent === 'submit_for_review' && Object.keys(validationErrors).length > 0) {
    return {
      ok: false,
      intent: input.intent,
      dogId: input.profile.dogId ?? 'pending-dog',
      lifecycleStatus: 'draft',
      message: 'Submission blocked on the server because the profile still has validation issues.',
      persistedAt: new Date().toISOString(),
      profile: {
        ...input.profile,
        lifecycleStatus: 'draft',
      },
    };
  }

  try {
    const { document } = await executeCurrentMemberDogAction(input);
    const result = document.result;

    revalidatePath('/my-dogs');
    revalidatePath('/profile');

    if (result.dogId) {
      revalidatePath(`/my-dogs/${result.dogId}/edit`);
    }

    return result;
  } catch (error) {
    if (error instanceof DogProfileValidationError) {
      return {
        ok: false,
        intent: input.intent,
        dogId: input.profile.dogId ?? 'pending-dog',
        lifecycleStatus: 'draft',
        message: error.message,
        persistedAt: new Date().toISOString(),
        profile: {
          ...input.profile,
          lifecycleStatus: 'draft',
        },
      };
    }

    throw error;
  }
}
