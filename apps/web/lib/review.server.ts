import { canReviewDogs } from '@cane-corso-platform/auth';
import { redirect } from 'next/navigation';
import type { IssueCertificateInput, ReviewDecisionIntent, UpdateDogAdminAssessmentInput, UpdateDogMediaAdminControlInput } from '@cane-corso-platform/contracts';
import { createMyDogsRepository } from '@cane-corso-platform/db';
import type { MemberSessionPayload } from '@/lib/session.server';
import { getOptionalCookieMemberSession } from '@/lib/session.server';
import { buildAccessPath } from '@/lib/access-control';

export async function requireReviewAdminSession(): Promise<MemberSessionPayload> {
  const session = await getOptionalCookieMemberSession();

  if (!session) {
    redirect(buildAccessPath({ intent: 'member', notice: 'admin_required', next: '/review' }));
  }

  if (!canReviewDogs(session.user.role)) {
    redirect(buildAccessPath({ intent: 'member', notice: 'admin_required', next: '/review' }));
  }

  return session;
}

export async function getReviewQueueDocument() {
  const repository = createMyDogsRepository();
  return repository.listReviewQueue();
}

export async function applyReviewDecision(input: { submissionId: string; decision: ReviewDecisionIntent }) {
  const session = await requireReviewAdminSession();
  const repository = createMyDogsRepository();

  return repository.reviewSubmission(session.user.profileId, {
    submissionId: input.submissionId,
    decision: input.decision,
  });
}
export async function publishReviewedSubmission(input: { submissionId: string }) {
  const session = await requireReviewAdminSession();
  const repository = createMyDogsRepository();

  return repository.publishSubmission(session.user.profileId, input.submissionId);
}

export async function issueReviewCertificate(input: IssueCertificateInput) {
  const session = await requireReviewAdminSession();
  const repository = createMyDogsRepository();

  return repository.issueCertificate(session.user.profileId, input);
}

export async function revokeReviewCertificate(input: { dogId: string }) {
  const session = await requireReviewAdminSession();
  const repository = createMyDogsRepository();

  return repository.revokeCertificate(session.user.profileId, input.dogId);
}


export async function updateReviewDogAdminAssessment(input: UpdateDogAdminAssessmentInput) {
  const session = await requireReviewAdminSession();
  const repository = createMyDogsRepository();

  return repository.updateDogAdminAssessment(session.user.profileId, input);
}

export async function updateReviewDogMediaControl(input: UpdateDogMediaAdminControlInput) {
  const session = await requireReviewAdminSession();
  const repository = createMyDogsRepository();

  return repository.updateDogMediaAdminControl(session.user.profileId, input);
}
