'use server';

import { revalidatePath } from 'next/cache';
import { publishEcosystemListing, reviewEcosystemListing } from '@/lib/ecosystem.server';

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
