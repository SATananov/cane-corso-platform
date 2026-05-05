import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import type { ProfileIdentity } from './profiles.repository';
import { eq } from 'drizzle-orm';
import { getDb } from '../client';
import { authLocalCredentials, profiles, users } from '../schema';
import { createProfilesRepository } from './profiles.repository';

export interface CreateLocalMemberInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  locale?: string | null;
}

export interface VerifyLocalCredentialsInput {
  email: string;
  password: string;
}

export class LocalAuthRepositoryError extends Error {
  constructor(message: string, readonly code: 'EMAIL_EXISTS' | 'INVALID_CREDENTIALS' | 'INVALID_PASSWORD' | 'INVALID_NAME') {
    super(message);
    this.name = 'LocalAuthRepositoryError';
  }
}

export interface LocalAuthRepository {
  createMemberAccount(input: CreateLocalMemberInput): Promise<ProfileIdentity>;
  verifyMemberCredentials(input: VerifyLocalCredentialsInput): Promise<ProfileIdentity>;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function buildDisplayName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedValue: string): boolean {
  const [salt, storedHash] = storedValue.split(':');

  if (!salt || !storedHash) {
    return false;
  }

  const candidateHash = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (candidateHash.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateHash, storedBuffer);
}

class DrizzleLocalAuthRepository implements LocalAuthRepository {
  async createMemberAccount(input: CreateLocalMemberInput): Promise<ProfileIdentity> {
    const email = normalizeEmail(input.email);
    const firstName = normalizeName(input.firstName);
    const lastName = normalizeName(input.lastName);

    if (firstName.length < 2 || lastName.length < 2) {
      throw new LocalAuthRepositoryError('First and last name must each contain at least 2 characters.', 'INVALID_NAME');
    }

    if (input.password.trim().length < 8) {
      throw new LocalAuthRepositoryError('Password must contain at least 8 characters.', 'INVALID_PASSWORD');
    }

    const displayName = buildDisplayName(firstName, lastName);
    const db = getDb();
    const userId = randomUUID();
    const profileId = randomUUID();
    const passwordHash = hashPassword(input.password);

    await db.transaction(async (tx) => {
      const existing = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existing[0]) {
        throw new LocalAuthRepositoryError(`An account with ${email} already exists.`, 'EMAIL_EXISTS');
      }

      await tx.insert(users).values({
        id: userId,
        authProvider: 'local',
        authSubject: `local:${userId}`,
        email,
        emailVerified: true,
      });

      await tx.insert(profiles).values({
        id: profileId,
        userId,
        role: 'member',
        displayName,
        firstName,
        lastName,
        locale: input.locale?.trim() || 'en',
        isActive: true,
      });

      await tx.insert(authLocalCredentials).values({
        userId,
        passwordHash,
      });
    });

    const identity = await createProfilesRepository().getIdentityByEmail(email);

    if (!identity) {
      throw new Error('The new local member account was created, but the identity could not be resolved afterwards.');
    }

    return identity;
  }

  async verifyMemberCredentials(input: VerifyLocalCredentialsInput): Promise<ProfileIdentity> {
    const email = normalizeEmail(input.email);
    const db = getDb();
    const rows = await db
      .select({
        passwordHash: authLocalCredentials.passwordHash,
        userId: users.id,
      })
      .from(users)
      .innerJoin(authLocalCredentials, eq(authLocalCredentials.userId, users.id))
      .where(eq(users.email, email))
      .limit(1);

    const row = rows[0];

    if (!row || !verifyPassword(input.password, row.passwordHash)) {
      throw new LocalAuthRepositoryError('The email or password is not valid.', 'INVALID_CREDENTIALS');
    }

    const identity = await createProfilesRepository().getIdentityByEmail(email);

    if (!identity) {
      throw new LocalAuthRepositoryError('The email or password is not valid.', 'INVALID_CREDENTIALS');
    }

    return identity;
  }
}

export function createLocalAuthRepository(): LocalAuthRepository {
  return new DrizzleLocalAuthRepository();
}
