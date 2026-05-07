'use server';

import { revalidatePath } from 'next/cache';
import { publishEcosystemListing, reviewEcosystemListing, reviewEcosystemMatchRequest } from '@/lib/ecosystem.server';

function revalidateEcosystemSurfaces() {
  revalidatePath('/ecosystem');
  revalidatePath('/community');
  revalidatePath('/partners');
  revalidatePath('/admin/ecosystem');
}

export async function requestEcosystemChangesAction(formData: FormData) {
  const listingId = String(formData.get('listingId') ?? '').trim();

  if (!listingId) {
    throw new Error('Invalid ecosystem listing id.');
  }

  await reviewEcosystemListing({
    listingId,
    decision: 'needs_changes',
  });

  revalidateEcosystemSurfaces();
}

export async function approveEcosystemListingAction(formData: FormData) {
  const listingId = String(formData.get('listingId') ?? '').trim();

  if (!listingId) {
    throw new Error('Invalid ecosystem listing id.');
  }

  await reviewEcosystemListing({
    listingId,
    decision: 'approve',
  });

  revalidateEcosystemSurfaces();
}

export async function publishEcosystemListingAction(formData: FormData) {
  const listingId = String(formData.get('listingId') ?? '').trim();

  if (!listingId) {
    throw new Error('Invalid ecosystem listing id.');
  }

  await publishEcosystemListing({
    listingId,
  });

  revalidateEcosystemSurfaces();
}

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing required field: ${key}.`);
  }

  return value.trim();
}

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function approveEcosystemMatchRequestAction(formData: FormData) {
  await reviewEcosystemMatchRequest({
    requestId: requiredString(formData, 'requestId'),
    decision: 'approve_to_connect',
    adminNote: optionalString(formData, 'adminNote'),
  });

  revalidateEcosystemSurfaces();
}

export async function declineEcosystemMatchRequestAction(formData: FormData) {
  await reviewEcosystemMatchRequest({
    requestId: requiredString(formData, 'requestId'),
    decision: 'decline',
    adminNote: optionalString(formData, 'adminNote'),
  });

  revalidateEcosystemSurfaces();
}

export async function markEcosystemMatchConnectedAction(formData: FormData) {
  await reviewEcosystemMatchRequest({
    requestId: requiredString(formData, 'requestId'),
    decision: 'mark_connected',
    adminNote: optionalString(formData, 'adminNote'),
  });

  revalidateEcosystemSurfaces();
}
