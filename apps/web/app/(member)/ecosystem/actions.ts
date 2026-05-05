'use server';

import { revalidatePath } from 'next/cache';
import type { EcosystemListingType, UpsertEcosystemListingInput } from '@cane-corso-platform/contracts';
import { ECOSYSTEM_LISTING_TYPES, isEcosystemSubmissionChannel } from '@cane-corso-platform/contracts';
import {
  saveCurrentOwnerEcosystemDraft,
  submitCurrentOwnerEcosystemListing,
} from '@/lib/ecosystem.server';

function isEcosystemListingType(value: string): value is EcosystemListingType {
  return (ECOSYSTEM_LISTING_TYPES as readonly string[]).includes(value);
}

function optionalString(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseListingInput(formData: FormData): UpsertEcosystemListingInput {
  const listingTypeValue = String(formData.get('listingType') ?? '');
  const submissionChannelValue = String(formData.get('submissionChannel') ?? '');

  if (!isEcosystemListingType(listingTypeValue)) {
    throw new Error('Unsupported ecosystem listing type.');
  }

  if (!isEcosystemSubmissionChannel(submissionChannelValue)) {
    throw new Error('Unsupported ecosystem submission channel.');
  }

  return {
    listingId: optionalString(formData, 'listingId'),
    listingType: listingTypeValue,
    title: String(formData.get('title') ?? '').trim(),
    submissionChannel: submissionChannelValue,
    slug: String(formData.get('slug') ?? '').trim(),
    category: optionalString(formData, 'category'),
    shortDescription: optionalString(formData, 'shortDescription'),
    longDescription: optionalString(formData, 'longDescription'),
    country: optionalString(formData, 'country'),
    city: optionalString(formData, 'city'),
    websiteUrl: optionalString(formData, 'websiteUrl'),
    phone: optionalString(formData, 'phone'),
    email: optionalString(formData, 'email'),
    coverageNote: optionalString(formData, 'coverageNote'),
    rulesNote: optionalString(formData, 'rulesNote'),
  };
}

export async function saveEcosystemDraftAction(formData: FormData) {
  await saveCurrentOwnerEcosystemDraft(parseListingInput(formData));
  revalidatePath('/ecosystem');
  revalidatePath('/community');
  revalidatePath('/partners');
  revalidatePath('/admin/partners');
  revalidatePath('/admin/ecosystem');
}

export async function submitEcosystemListingAction(formData: FormData) {
  await submitCurrentOwnerEcosystemListing(parseListingInput(formData));
  revalidatePath('/ecosystem');
  revalidatePath('/community');
  revalidatePath('/partners');
  revalidatePath('/admin/partners');
  revalidatePath('/admin/ecosystem');
}
