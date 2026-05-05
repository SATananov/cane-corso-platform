'use server';

import { revalidatePath } from 'next/cache';
import { and, desc, eq, inArray } from 'drizzle-orm';
import {
  getDb,
  dogs,
  dogMedia,
  dogAdminAssessments,
  dogSubmissions,
  submissionReviews,
  registryEntries,
  registryEntryRatings,
  certificates,
} from '@cane-corso-platform/db';
import { issueReviewCertificate, requireReviewAdminSession, revokeReviewCertificate } from '@/lib/review.server';

export async function removeDogProfileAction(formData: FormData) {
  await requireReviewAdminSession();

  const dogId = String(formData.get('dogId') ?? '').trim();

  if (!dogId) {
    return;
  }

  const db = getDb();

  await db.transaction(async (tx) => {
    const submissionRows = await tx
      .select({ id: dogSubmissions.id })
      .from(dogSubmissions)
      .where(eq(dogSubmissions.dogId, dogId));

    if (submissionRows.length > 0) {
      await tx.delete(submissionReviews).where(inArray(submissionReviews.submissionId, submissionRows.map((row) => row.id)));
    }

    const registryRows = await tx
      .select({ id: registryEntries.id })
      .from(registryEntries)
      .where(eq(registryEntries.dogId, dogId));

    if (registryRows.length > 0) {
      await tx
        .delete(registryEntryRatings)
        .where(inArray(registryEntryRatings.registryEntryId, registryRows.map((row) => row.id)));
    }

    await tx
      .update(certificates)
      .set({
        status: 'revoked',
      })
      .where(and(eq(certificates.dogId, dogId), eq(certificates.status, 'active')));
    await tx.delete(registryEntries).where(eq(registryEntries.dogId, dogId));
    await tx.delete(dogSubmissions).where(eq(dogSubmissions.dogId, dogId));
    await tx.delete(dogMedia).where(eq(dogMedia.dogId, dogId));
    await tx.delete(dogs).where(eq(dogs.id, dogId));
  });

  revalidatePath('/my-dogs');
  revalidatePath('/review');
  revalidatePath('/registry');
  revalidatePath('/admin/registry');
  revalidatePath('/admin/members');
}


export async function removeRegistryEntryAction(formData: FormData) {
  const session = await requireReviewAdminSession();
  const dogId = String(formData.get('dogId') ?? '').trim();

  if (!dogId) {
    return;
  }

  const db = getDb();
  const now = new Date();
  const registryRows = await db
    .select({ publicSlug: registryEntries.publicSlug })
    .from(registryEntries)
    .where(eq(registryEntries.dogId, dogId))
    .limit(1);
  const publicSlug = registryRows[0]?.publicSlug ?? null;

  await db.transaction(async (tx) => {
    await tx
      .update(registryEntries)
      .set({
        isActive: false,
        publishedAt: now,
      })
      .where(eq(registryEntries.dogId, dogId));

    await tx
      .update(dogs)
      .set({
        lifecycleStatus: 'approved',
        visibility: 'private',
        updatedAt: now,
      })
      .where(eq(dogs.id, dogId));

    await tx
      .update(certificates)
      .set({
        status: 'revoked',
      })
      .where(and(eq(certificates.dogId, dogId), eq(certificates.status, 'active')));

    await tx
      .update(dogAdminAssessments)
      .set({
        registryDecision: 'needs_changes',
        certificateDecision: 'usg_candidate',
        updatedAt: now,
      })
      .where(eq(dogAdminAssessments.dogId, dogId));

    const submissionRows = await tx
      .select({ id: dogSubmissions.id })
      .from(dogSubmissions)
      .where(eq(dogSubmissions.dogId, dogId))
      .orderBy(desc(dogSubmissions.submittedAt));

    if (submissionRows[0]) {
      await tx
        .update(dogSubmissions)
        .set({
          status: 'approved',
          lastReviewedAt: now,
          currentReviewNote: 'Removed from the public registry by admin action.',
          publishedAt: null,
        })
        .where(eq(dogSubmissions.id, submissionRows[0].id));

      await tx.insert(submissionReviews).values({
        submissionId: submissionRows[0].id,
        reviewerProfileId: session.user.profileId,
        decision: 'registry_removed',
        note: 'Removed from the public registry by admin action.',
        createdAt: now,
      });
    }
  });

  revalidatePath('/review');
  revalidatePath('/registry');
  revalidatePath('/gallery');
  revalidatePath('/certified');
  revalidatePath('/admin');
  revalidatePath('/admin/registry');
  revalidatePath('/admin/members');
  revalidatePath('/my-dogs');

  if (publicSlug) {
    revalidatePath(`/registry/${publicSlug}`);
  }
}

export async function revokeCertificateAction(formData: FormData) {
  const session = await requireReviewAdminSession();
  const dogId = String(formData.get('dogId') ?? '').trim();

  if (!dogId) {
    return;
  }

  const db = getDb();
  const now = new Date();

  await db.transaction(async (tx) => {
    await tx
      .update(certificates)
      .set({
        status: 'revoked',
      })
      .where(and(eq(certificates.dogId, dogId), eq(certificates.status, 'active')));

    await tx
      .update(dogAdminAssessments)
      .set({
        certificateDecision: 'usg_candidate',
        updatedAt: now,
      })
      .where(and(eq(dogAdminAssessments.dogId, dogId), eq(dogAdminAssessments.certificateDecision, 'usg_certified')));

    const submissionRows = await tx
      .select({ id: dogSubmissions.id })
      .from(dogSubmissions)
      .where(eq(dogSubmissions.dogId, dogId))
      .orderBy(desc(dogSubmissions.submittedAt));

    if (submissionRows[0]) {
      await tx.insert(submissionReviews).values({
        submissionId: submissionRows[0].id,
        reviewerProfileId: session.user.profileId,
        decision: 'certificate_revoked',
        note: 'USG certificate revoked by admin action.',
        createdAt: now,
      });
    }
  });

  revalidatePath('/review');
  revalidatePath('/registry');
  revalidatePath('/gallery');
  revalidatePath('/certified');
  revalidatePath('/admin');
  revalidatePath('/admin/registry');
  revalidatePath('/admin/members');
  revalidatePath('/my-dogs');
}


export async function issueDogCertificateAction(formData: FormData) {
  const dogId = String(formData.get('dogId') ?? '').trim();
  const certificateImageUrl = String(formData.get('certificateImageUrl') ?? '').trim() || null;

  if (!dogId) {
    return;
  }

  const result = await issueReviewCertificate({ dogId, certificateImageUrl });

  revalidatePath('/review');
  revalidatePath('/my-dogs');
  revalidatePath('/registry');
  revalidatePath('/gallery');
  revalidatePath('/certified');
  revalidatePath('/admin');
  revalidatePath('/admin/registry');
  revalidatePath('/admin/members');

  if (result.verificationSlug) {
    revalidatePath(`/verify/${result.verificationSlug}`);
    revalidatePath(`/certificate/${result.verificationSlug}`);
  }

  if (result.certificateCode) {
    revalidatePath(`/verify/${result.certificateCode}`);
    revalidatePath(`/certificate/${result.certificateCode}`);
  }
}

export async function revokeDogCertificateAction(formData: FormData) {
  const dogId = String(formData.get('dogId') ?? '').trim();

  if (!dogId) {
    return;
  }

  await revokeReviewCertificate({ dogId });

  revalidatePath('/review');
  revalidatePath('/my-dogs');
  revalidatePath('/registry');
  revalidatePath('/gallery');
  revalidatePath('/certified');
  revalidatePath('/admin');
  revalidatePath('/admin/registry');
  revalidatePath('/admin/members');
}
