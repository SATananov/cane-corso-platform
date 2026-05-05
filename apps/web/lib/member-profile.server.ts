import type { CurrentProfileDocument } from '@cane-corso-platform/contracts';
import { createProfilesRepository } from '@cane-corso-platform/db';
import { requireCurrentMemberSession } from './session.server';

export class CurrentProfileNotFoundError extends Error {
  readonly profileId: string;

  constructor(profileId: string) {
    super(`The current member profile ${profileId} could not be found.`);
    this.name = 'CurrentProfileNotFoundError';
    this.profileId = profileId;
  }
}

export async function getCurrentProfileDocument(options?: { allowDevFallback?: boolean }): Promise<CurrentProfileDocument> {
  const { session, bootstrap } = await requireCurrentMemberSession(options);
  const repository = createProfilesRepository();
  const profile = await repository.getById(session.user.profileId);

  if (!profile) {
    throw new CurrentProfileNotFoundError(session.user.profileId);
  }

  return {
    profile,
    session,
    bootstrap,
  };
}
