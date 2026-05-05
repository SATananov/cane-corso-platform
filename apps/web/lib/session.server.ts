import { cookies } from 'next/headers';
import {
  DEFAULT_SESSION_COOKIE_OPTIONS,
  SESSION_COOKIE_NAME,
  createAppSession,
  decodeSignedToken,
  encodeSignedToken,
  isSessionExpired,
} from '@cane-corso-platform/auth';
import type { AppRole, AppSession } from '@cane-corso-platform/contracts';
import { createProfilesRepository } from '@cane-corso-platform/db';
import { getAuthSecret, getAuthStrategy, isDevBootstrapSessionEnabled } from './runtime-env';

export const SEEDED_MEMBER_USER_ID = '11111111-1111-4111-8111-111111111110';
export const SEEDED_MEMBER_PROFILE_ID = '11111111-1111-4111-8111-111111111111';
export const SEEDED_MEMBER_EMAIL = 'member@demo.cane-corso.local';
export const DEMO_MEMBER_USER_ID = SEEDED_MEMBER_USER_ID;
export const DEMO_MEMBER_PROFILE_ID = SEEDED_MEMBER_PROFILE_ID;
export const DEMO_MEMBER_EMAIL = SEEDED_MEMBER_EMAIL;

export class SessionUnavailableError extends Error {
  constructor(message = 'No authenticated session is available.') {
    super(message);
    this.name = 'SessionUnavailableError';
  }
}

export interface MemberSessionPayload extends AppSession {
  firstName: string | null;
  lastName: string | null;
  city: string | null;
  country: string | null;
  bio: string | null;
}

export interface ResolvedMemberSession {
  session: MemberSessionPayload;
  bootstrap: 'cookie' | 'dev-fallback';
}

function buildSessionCookieOptions() {
  const authStrategy = getAuthStrategy();

  return {
    httpOnly: DEFAULT_SESSION_COOKIE_OPTIONS.httpOnly,
    sameSite: DEFAULT_SESSION_COOKIE_OPTIONS.sameSite,
    path: DEFAULT_SESSION_COOKIE_OPTIONS.path,
    secure: authStrategy.usesSecureCookies,
    maxAge: authStrategy.sessionTtlSeconds,
  } as const;
}

export function createSessionFromIdentity(identity: Awaited<ReturnType<ReturnType<typeof createProfilesRepository>['getIdentityByEmail']>>) {
  if (!identity) {
    throw new Error('Cannot create a session without a profile identity.');
  }

  if (!identity.profile.isActive) {
    throw new Error(`Profile ${identity.profile.id} is inactive and cannot start a session.`);
  }

  if (getAuthStrategy().requiresEmailVerification && !identity.emailVerified) {
    throw new Error(`Profile ${identity.profile.id} cannot start a session before email verification is complete.`);
  }

  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + getAuthStrategy().sessionTtlSeconds * 1000);

  const appSession = createAppSession(
    {
      userId: identity.profile.userId,
      profileId: identity.profile.id,
      email: identity.email,
      role: identity.profile.role,
      authProvider: identity.authProvider,
      emailVerified: identity.emailVerified,
      displayName: identity.profile.displayName,
      avatarUrl: identity.profile.avatarUrl,
    },
    {
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    },
  );

  return {
    ...appSession,
    firstName: identity.profile.firstName,
    lastName: identity.profile.lastName,
    city: identity.profile.city,
    country: identity.profile.country,
    bio: identity.profile.bio,
  } satisfies MemberSessionPayload;
}

function decodeCookieValue(value: string): MemberSessionPayload | null {
  return decodeSignedToken<MemberSessionPayload>(value, getAuthSecret());
}

async function hydrateValidatedCookieSession(cookieValue: string): Promise<MemberSessionPayload | null> {
  const parsed = decodeCookieValue(cookieValue);

  if (!parsed || isSessionExpired(parsed)) {
    return null;
  }

  const repository = createProfilesRepository();
  const identity = await repository.getIdentityByProfileId(parsed.user.profileId);

  if (!identity) {
    return null;
  }

  if (!identity.profile.isActive) {
    return null;
  }

  if (identity.profile.userId !== parsed.user.userId) {
    return null;
  }

  if (identity.email !== parsed.user.email) {
    return null;
  }

  if (getAuthStrategy().requiresEmailVerification && !identity.emailVerified) {
    return null;
  }

  return createSessionFromIdentity(identity);
}

export function createSignedSessionCookie(session: MemberSessionPayload): string {
  return encodeSignedToken(session, getAuthSecret());
}

export async function getBootstrapMemberSession(): Promise<MemberSessionPayload> {
  const repository = createProfilesRepository();
  const identity = await repository.getIdentityByEmail(SEEDED_MEMBER_EMAIL);

  if (!identity) {
    throw new Error(
      'The local test member is missing from the database. Run `pnpm db:bootstrap` before using development access.',
    );
  }

  return createSessionFromIdentity(identity);
}

export async function getOptionalCookieMemberSession(): Promise<MemberSessionPayload | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!cookieValue) {
    return null;
  }

  return hydrateValidatedCookieSession(cookieValue);
}

export async function getCurrentMemberSession(options?: { allowDevFallback?: boolean }): Promise<ResolvedMemberSession> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (cookieValue) {
    const session = await hydrateValidatedCookieSession(cookieValue);

    if (session) {
      return {
        session,
        bootstrap: 'cookie',
      };
    }
  }

  const allowDevFallback = options?.allowDevFallback ?? true;

  if (!allowDevFallback || !isDevBootstrapSessionEnabled()) {
    throw new SessionUnavailableError('No authenticated session is available.');
  }

  return {
    session: await getBootstrapMemberSession(),
    bootstrap: 'dev-fallback',
  };
}

export function getSessionCookieDescriptor(session: MemberSessionPayload) {
  return {
    name: SESSION_COOKIE_NAME,
    value: createSignedSessionCookie(session),
    options: buildSessionCookieOptions(),
  };
}

export function getClearedSessionCookieDescriptor() {
  return {
    name: SESSION_COOKIE_NAME,
    value: '',
    options: {
      ...buildSessionCookieOptions(),
      maxAge: 0,
    },
  };
}

export function getCurrentMemberRole(session: MemberSessionPayload): AppRole {
  return session.user.role;
}

export async function requireCurrentMemberSession(options?: { allowDevFallback?: boolean }): Promise<ResolvedMemberSession> {
  return getCurrentMemberSession(options);
}

export async function requireRequestSessionCookie(): Promise<ResolvedMemberSession> {
  return getCurrentMemberSession({ allowDevFallback: false });
}
