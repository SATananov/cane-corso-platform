import type { AppRole, AppSession, SessionUser } from '@cane-corso-platform/contracts';

export interface AuthenticatedProfileContext {
  userId: string;
  profileId: string;
  email: string;
  role: AppRole;
  authProvider: string;
  emailVerified: boolean;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface SessionTimestamps {
  issuedAt: string;
  expiresAt: string;
}

export function createSessionUser(context: AuthenticatedProfileContext): SessionUser {
  return {
    userId: context.userId,
    profileId: context.profileId,
    email: context.email,
    role: context.role,
    authProvider: context.authProvider,
    emailVerified: context.emailVerified,
    displayName: context.displayName,
    avatarUrl: context.avatarUrl,
  };
}

export function createAppSession(
  context: AuthenticatedProfileContext,
  timestamps: SessionTimestamps,
): AppSession {
  return {
    user: createSessionUser(context),
    issuedAt: timestamps.issuedAt,
    expiresAt: timestamps.expiresAt,
  };
}

export function isSessionExpired(session: Pick<AppSession, 'expiresAt'>, now = new Date()): boolean {
  return new Date(session.expiresAt).getTime() <= now.getTime();
}
