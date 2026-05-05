import { createPartnersRepository } from '@cane-corso-platform/db';
import type {
  PartnerDirectoryDocument,
  PartnerProfileDocument,
  PartnerWorkspaceDocument,
  ReviewPartnerApplicationInput,
  ReviewPartnerApplicationResult,
  SubmitPartnerApplicationInput,
  SubmitPartnerApplicationResult,
  UpdatePartnerAdminStateInput,
  UpdatePartnerAdminStateResult,
} from '@cane-corso-platform/contracts';
import { requireReviewAdminSession } from '@/lib/review.server';
import { requireRequestSessionCookie } from '@/lib/session.server';

export async function getPartnerDirectoryDocument(filters?: {
  category?: string | null;
}): Promise<PartnerDirectoryDocument> {
  const repository = createPartnersRepository();
  return repository.listPublicDirectory(filters);
}

export async function getPartnerProfileDocument(slug: string, viewerProfileId?: string | null): Promise<PartnerProfileDocument | null> {
  const repository = createPartnersRepository();
  return repository.getPublicPartnerProfile(slug, viewerProfileId);
}

export async function submitCurrentPartnerRating(partnerId: string, rating: number): Promise<void> {
  const repository = createPartnersRepository();
  const { session } = await requireRequestSessionCookie();
  return repository.submitPartnerRating(session.user.profileId, partnerId, rating);
}

export async function getPartnerModerationDocument() {
  const repository = createPartnersRepository();
  return repository.listModerationDocument();
}

export async function getCurrentPartnerWorkspaceDocument(): Promise<PartnerWorkspaceDocument> {
  const repository = createPartnersRepository();
  const { session } = await requireRequestSessionCookie();
  return repository.listWorkspaceDocument(session.user.profileId);
}

export async function submitCurrentPartnerApplication(
  input: SubmitPartnerApplicationInput,
): Promise<SubmitPartnerApplicationResult> {
  const repository = createPartnersRepository();
  const { session } = await requireRequestSessionCookie();
  return repository.submitApplication(session.user.profileId, input);
}

export async function reviewPartnerApplication(
  input: ReviewPartnerApplicationInput,
): Promise<ReviewPartnerApplicationResult> {
  const session = await requireReviewAdminSession();
  const repository = createPartnersRepository();

  return repository.reviewApplication(session.user.profileId, input);
}

export async function updatePartnerAdminState(
  input: UpdatePartnerAdminStateInput,
): Promise<UpdatePartnerAdminStateResult> {
  const session = await requireReviewAdminSession();
  const repository = createPartnersRepository();

  return repository.updateAdminState(session.user.profileId, input);
}
