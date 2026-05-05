'use server';

import { revalidatePath } from 'next/cache';
import type {
  PartnerAdminActionIntent,
  PartnerApplicationDecision,
} from '@cane-corso-platform/contracts';
import { reviewPartnerApplication, updatePartnerAdminState } from '@/lib/partners.server';

function revalidatePartnerSurfaces(partnerSlug?: string | null) {
  revalidatePath('/partners');
  revalidatePath('/partners/apply');
  revalidatePath('/admin/partners');

  if (partnerSlug) {
    revalidatePath(`/partners/${partnerSlug}`);
  }
}

export async function reviewPartnerApplicationAction(formData: FormData) {
  const applicationId = String(formData.get('applicationId') ?? '').trim();
  const decision = String(formData.get('decision') ?? '').trim() as PartnerApplicationDecision;

  if (!applicationId || (decision !== 'approve' && decision !== 'reject')) {
    throw new Error('Invalid partner application review input.');
  }

  const result = await reviewPartnerApplication({
    applicationId,
    decision,
  });

  revalidatePartnerSurfaces(result.partnerSlug);
}

export async function updatePartnerAdminStateAction(formData: FormData) {
  const partnerId = String(formData.get('partnerId') ?? '').trim();
  const partnerSlug = String(formData.get('partnerSlug') ?? '').trim() || null;
  const intent = String(formData.get('intent') ?? '').trim() as PartnerAdminActionIntent;

  if (!partnerId || !['feature', 'unfeature', 'suspend', 'restore'].includes(intent)) {
    throw new Error('Invalid partner admin state input.');
  }

  await updatePartnerAdminState({
    partnerId,
    intent,
  });

  revalidatePartnerSurfaces(partnerSlug);
}
