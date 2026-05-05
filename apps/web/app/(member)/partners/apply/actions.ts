'use server';

import { revalidatePath } from 'next/cache';
import { submitCurrentPartnerApplication } from '@/lib/partners.server';

function getField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export async function submitPartnerApplicationAction(formData: FormData) {
  await submitCurrentPartnerApplication({
    businessName: getField(formData, 'businessName'),
    category: getField(formData, 'category'),
    shortDescription: getField(formData, 'shortDescription'),
    longDescription: getField(formData, 'longDescription'),
    country: getField(formData, 'country') || null,
    city: getField(formData, 'city') || null,
    websiteUrl: getField(formData, 'websiteUrl') || null,
    logoUrl: getField(formData, 'logoUrl') || null,
    coverImageUrl: getField(formData, 'coverImageUrl') || null,
    message: getField(formData, 'message') || null,
    contactEmail: getField(formData, 'contactEmail'),
    contactPhone: getField(formData, 'contactPhone') || null,
  });

  revalidatePath('/partners/apply');
  revalidatePath('/admin/partners');
}
