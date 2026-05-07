'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { EcosystemValidationError, submitCurrentMemberEcosystemMatchRequest } from '@/lib/ecosystem.server';

function optionalString(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function submitEcosystemMatchRequestAction(formData: FormData) {
  const listingId = optionalString(formData, 'listingId');
  const message = optionalString(formData, 'message');

  if (!listingId || !message) {
    throw new EcosystemValidationError('Connection request needs a listing and a short message.');
  }

  await submitCurrentMemberEcosystemMatchRequest({
    listingId,
    message,
    contactPreference: optionalString(formData, 'contactPreference'),
    phone: optionalString(formData, 'phone'),
    email: optionalString(formData, 'email'),
  });

  revalidatePath('/community');
  revalidatePath('/admin/ecosystem');
  redirect('/ecosystem?matchRequest=submitted');
}
