import { canManagePartners } from '@cane-corso-platform/auth';
import type { EcosystemReviewDecision, ReviewEcosystemMatchRequestInput, SubmitEcosystemMatchRequestInput, UpsertEcosystemListingInput } from '@cane-corso-platform/contracts';
import { createEcosystemRepository } from '@cane-corso-platform/db';
import { redirect } from 'next/navigation';
import {
  SessionUnavailableError,
  getCurrentMemberSession,
  getOptionalCookieMemberSession,
  requireRequestSessionCookie,
} from '@/lib/session.server';

export class EcosystemValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EcosystemValidationError';
  }
}

export async function requireEcosystemMemberSession() {
  return getCurrentMemberSession({ allowDevFallback: false });
}

export async function requireEcosystemAdminSession() {
  const session = await getOptionalCookieMemberSession();

  if (!session) {
    redirect('/access');
  }

  if (!canManagePartners(session.user.role)) {
    redirect('/my-dogs');
  }

  return session;
}

export async function getCurrentOwnerEcosystemDocument(options?: { allowDevFallback?: boolean }) {
  const allowDevFallback = options?.allowDevFallback ?? false;
  const { session } = await getCurrentMemberSession({ allowDevFallback });
  const repository = createEcosystemRepository();
  return repository.listOwnerWorkspace(session.user.profileId);
}

export async function getPublishedEcosystemDirectoryDocument(options?: { page?: number; pageSize?: number }) {
  const repository = createEcosystemRepository();
  return repository.listPublishedDirectory(options);
}

export async function getPublishedEcosystemProfileDocument(slug: string) {
  const repository = createEcosystemRepository();
  return repository.getPublishedListingBySlug(slug);
}

export async function getEcosystemModerationDocument() {
  await requireEcosystemAdminSession();
  const repository = createEcosystemRepository();
  return repository.listModerationQueue();
}

export async function saveCurrentOwnerEcosystemDraft(input: UpsertEcosystemListingInput) {
  try {
    const { session } = await requireEcosystemMemberSession();
    const repository = createEcosystemRepository();
    return repository.saveOwnerDraft(session.user.profileId, input);
  } catch (error) {
    if (error instanceof Error) {
      throw new EcosystemValidationError(error.message);
    }
    throw error;
  }
}

export async function submitCurrentOwnerEcosystemListing(input: UpsertEcosystemListingInput) {
  try {
    const { session } = await requireEcosystemMemberSession();
    const repository = createEcosystemRepository();
    return repository.submitOwnerListing(session.user.profileId, input);
  } catch (error) {
    if (error instanceof Error) {
      throw new EcosystemValidationError(error.message);
    }
    throw error;
  }
}

export async function reviewEcosystemListing(input: {
  listingId: string;
  decision: EcosystemReviewDecision;
  note?: string | null;
}) {
  const session = await requireEcosystemAdminSession();
  const repository = createEcosystemRepository();
  return repository.reviewListing(session.user.profileId, input);
}

export async function publishEcosystemListing(input: { listingId: string }) {
  const session = await requireEcosystemAdminSession();
  const repository = createEcosystemRepository();
  return repository.publishListing(session.user.profileId, input.listingId);
}


export async function submitCurrentMemberEcosystemMatchRequest(input: SubmitEcosystemMatchRequestInput) {
  try {
    const { session } = await requireEcosystemMemberSession();
    const repository = createEcosystemRepository();
    return repository.submitMatchRequest(session.user.profileId, input);
  } catch (error) {
    if (error instanceof Error) {
      throw new EcosystemValidationError(error.message);
    }
    throw error;
  }
}

export async function reviewEcosystemMatchRequest(input: ReviewEcosystemMatchRequestInput) {
  const session = await requireEcosystemAdminSession();
  const repository = createEcosystemRepository();
  return repository.reviewMatchRequest(session.user.profileId, input);
}

export async function getOwnerEcosystemDocumentForApi() {
  const session = await requireRequestSessionCookie();
  const repository = createEcosystemRepository();
  return repository.listOwnerWorkspace(session.session.user.profileId);
}

export async function saveOwnerEcosystemDraftForApi(input: UpsertEcosystemListingInput) {
  try {
    const session = await requireRequestSessionCookie();
    const repository = createEcosystemRepository();
    return repository.saveOwnerDraft(session.session.user.profileId, input);
  } catch (error) {
    if (error instanceof Error) {
      throw new EcosystemValidationError(error.message);
    }
    throw error;
  }
}

export async function submitOwnerEcosystemListingForApi(input: UpsertEcosystemListingInput) {
  try {
    const session = await requireRequestSessionCookie();
    const repository = createEcosystemRepository();
    return repository.submitOwnerListing(session.session.user.profileId, input);
  } catch (error) {
    if (error instanceof Error) {
      throw new EcosystemValidationError(error.message);
    }
    throw error;
  }
}

export async function getAdminEcosystemModerationDocumentForApi() {
  const session = await requireRequestSessionCookie();

  if (!canManagePartners(session.session.user.role)) {
    throw new SessionUnavailableError('Administrator session is required.');
  }

  const repository = createEcosystemRepository();
  return repository.listModerationQueue();
}

export async function reviewEcosystemListingForApi(input: {
  listingId: string;
  decision: EcosystemReviewDecision;
  note?: string | null;
}) {
  const session = await requireRequestSessionCookie();

  if (!canManagePartners(session.session.user.role)) {
    throw new SessionUnavailableError('Administrator session is required.');
  }

  const repository = createEcosystemRepository();
  return repository.reviewListing(session.session.user.profileId, input);
}

export async function publishEcosystemListingForApi(input: { listingId: string }) {
  const session = await requireRequestSessionCookie();

  if (!canManagePartners(session.session.user.role)) {
    throw new SessionUnavailableError('Administrator session is required.');
  }

  const repository = createEcosystemRepository();
  return repository.publishListing(session.session.user.profileId, input.listingId);
}


export async function submitEcosystemMatchRequestForApi(input: SubmitEcosystemMatchRequestInput) {
  try {
    const session = await requireRequestSessionCookie();
    const repository = createEcosystemRepository();
    return repository.submitMatchRequest(session.session.user.profileId, input);
  } catch (error) {
    if (error instanceof Error) {
      throw new EcosystemValidationError(error.message);
    }
    throw error;
  }
}

export async function reviewEcosystemMatchRequestForApi(input: ReviewEcosystemMatchRequestInput) {
  const session = await requireRequestSessionCookie();

  if (!canManagePartners(session.session.user.role)) {
    throw new SessionUnavailableError('Administrator session is required.');
  }

  const repository = createEcosystemRepository();
  return repository.reviewMatchRequest(session.session.user.profileId, input);
}
