'use server';

import { revalidatePath } from 'next/cache';
import type { DogAdminAssessmentDecision } from '@cane-corso-platform/contracts';
import {
  applyReviewDecision,
  issueReviewCertificate,
  publishReviewedSubmission,
  revokeReviewCertificate,
  updateReviewDogAdminAssessment,
  updateReviewDogMediaControl,
} from '@/lib/review.server';

function isReviewDecision(value: FormDataEntryValue | null): value is 'approve' | 'needs_changes' {
  return value === 'approve' || value === 'needs_changes';
}


function isAssessmentDecision(value: FormDataEntryValue | null): value is DogAdminAssessmentDecision {
  return (
    value === 'not_reviewed' ||
    value === 'registry_approved' ||
    value === 'needs_changes' ||
    value === 'usg_candidate' ||
    value === 'usg_certified'
  );
}

function readOptionalText(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function readOptionalScore(formData: FormData, key: string): number | null {
  const value = formData.get(key);

  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  const score = Number.parseInt(value, 10);

  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw new Error(key + ' must be a score from 1 to 5.');
  }

  return score;
}

function readRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

export async function applyReviewDecisionAction(formData: FormData) {
  const submissionId = formData.get('submissionId');
  const decision = formData.get('decision');

  if (typeof submissionId !== 'string' || submissionId.trim().length === 0) {
    throw new Error('Submission id is required.');
  }

  if (!isReviewDecision(decision)) {
    throw new Error('Unsupported review decision.');
  }

  await applyReviewDecision({
    submissionId,
    decision,
  });

  revalidatePath('/review');
  revalidatePath('/my-dogs');
}

export async function publishReviewedSubmissionAction(formData: FormData) {
  const submissionId = formData.get('submissionId');

  if (typeof submissionId !== 'string' || submissionId.trim().length === 0) {
    throw new Error('Submission id is required.');
  }

  const result = await publishReviewedSubmission({
    submissionId,
  });

  revalidatePath('/review');
  revalidatePath('/my-dogs');
  revalidatePath('/registry');
  revalidatePath('/gallery');
  revalidatePath('/admin/registry');
  revalidatePath(`/registry/${result.publicSlug}`);

  if (result.verificationSlug) {
    revalidatePath(`/verify/${result.verificationSlug}`);
  }
}

export async function issueReviewCertificateAction(formData: FormData) {
  const dogId = formData.get('dogId');
  const certificateImageUrl = readOptionalText(formData, 'certificateImageUrl');

  if (typeof dogId !== 'string' || dogId.trim().length === 0) {
    throw new Error('Dog id is required.');
  }

  const result = await issueReviewCertificate({ dogId, certificateImageUrl });

  revalidatePath('/review');
  revalidatePath('/my-dogs');
  revalidatePath('/registry');
  revalidatePath('/gallery');
  revalidatePath('/admin/registry');
  revalidatePath(`/verify/${result.verificationSlug}`);
  revalidatePath(`/verify/${result.certificateCode}`);
  revalidatePath(`/certificate/${result.verificationSlug}`);
  revalidatePath(`/certificate/${result.certificateCode}`);
  revalidatePath('/certified');
}

export async function revokeReviewCertificateAction(formData: FormData) {
  const dogId = formData.get('dogId');

  if (typeof dogId !== 'string' || dogId.trim().length === 0) {
    throw new Error('Dog id is required.');
  }

  await revokeReviewCertificate({ dogId });

  revalidatePath('/review');
  revalidatePath('/my-dogs');
  revalidatePath('/registry');
  revalidatePath('/gallery');
  revalidatePath('/admin/registry');
}

export async function updateReviewDogAdminAssessmentAction(formData: FormData) {
  const dogId = readRequiredString(formData, 'dogId');
  const registryDecision = formData.get('registryDecision');
  const certificateDecision = formData.get('certificateDecision');

  if (!isAssessmentDecision(registryDecision) || !isAssessmentDecision(certificateDecision)) {
    throw new Error('Unsupported admin assessment decision.');
  }

  const result = await updateReviewDogAdminAssessment({
    dogId,
    registryDecision,
    certificateDecision,
    breedTypeScore: readOptionalScore(formData, 'breedTypeScore'),
    temperamentScore: readOptionalScore(formData, 'temperamentScore'),
    pedigreeScore: readOptionalScore(formData, 'pedigreeScore'),
    healthScore: readOptionalScore(formData, 'healthScore'),
    presentationScore: readOptionalScore(formData, 'presentationScore'),
    overallScore: readOptionalScore(formData, 'overallScore'),
    publicNote: readOptionalText(formData, 'publicNote'),
    privateNote: readOptionalText(formData, 'privateNote'),
  });

  revalidatePath('/review');
  revalidatePath('/registry');
  revalidatePath('/gallery');
  revalidatePath('/admin/registry');

  if (result.publicSlug) {
    revalidatePath(`/registry/${result.publicSlug}`);
  }

  if (result.verificationSlug) {
    revalidatePath(`/verify/${result.verificationSlug}`);
    revalidatePath(`/certificate/${result.verificationSlug}`);
  }

  if (result.certificateCode) {
    revalidatePath(`/verify/${result.certificateCode}`);
    revalidatePath(`/certificate/${result.certificateCode}`);
  revalidatePath('/certified');
  }
}

export async function updateReviewDogMediaControlAction(formData: FormData) {
  const dogId = readRequiredString(formData, 'dogId');
  const mediaId = readRequiredString(formData, 'mediaId');
  const intent = formData.get('intent');

  if (intent !== 'set_primary' && intent !== 'update_visibility') {
    throw new Error('Unsupported media control action.');
  }

  const result = await updateReviewDogMediaControl({
    dogId,
    mediaId,
    makePrimary: intent === 'set_primary',
    ...(intent === 'update_visibility'
      ? {
          visibleInRegistry: formData.get('visibleInRegistry') === 'on',
          visibleInUsgGallery: formData.get('visibleInUsgGallery') === 'on',
        }
      : {}),
  });

  revalidatePath('/review');
  revalidatePath('/my-dogs');
  revalidatePath('/registry');
  revalidatePath('/gallery');
  revalidatePath('/admin/registry');

  if (result.publicSlug) {
    revalidatePath(`/registry/${result.publicSlug}`);
  }

  if (result.verificationSlug) {
    revalidatePath(`/verify/${result.verificationSlug}`);
  }

  if (result.certificateCode) {
    revalidatePath(`/verify/${result.certificateCode}`);
  }
}
