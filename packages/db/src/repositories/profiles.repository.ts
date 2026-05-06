import type { DevAccessIdentity, Profile, UpdateCurrentProfileInput } from '@cane-corso-platform/contracts';
import { eq } from 'drizzle-orm';
import { getDb } from '../client';
import { profiles, users } from '../schema';

export interface ProfileIdentity {
  profile: Profile;
  email: string;
  authProvider: string;
  authSubject: string;
  emailVerified: boolean;
}

export interface ProfilesRepository {
  getIdentityByEmail(email: string): Promise<ProfileIdentity | null>;
  getIdentityByProfileId(profileId: string): Promise<ProfileIdentity | null>;
  getById(profileId: string): Promise<Profile | null>;
  updateProfile(profileId: string, input: UpdateCurrentProfileInput): Promise<Profile | null>;
  listAccessIdentities(limit?: number): Promise<DevAccessIdentity[]>;
}

type ProfileRow = typeof profiles.$inferSelect;
type UserRow = typeof users.$inferSelect;

function toIsoDateTime(value: string | Date | null | undefined): string {
  if (!value) {
    return new Date(0).toISOString();
  }

  return typeof value === 'string' ? value : value.toISOString();
}

function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    userId: row.userId,
    role: row.role as Profile['role'],
    displayName: row.displayName,
    firstName: row.firstName,
    middleName: row.middleName,
    lastName: row.lastName,
    avatarUrl: row.avatarUrl,
    phone: row.phone,
    country: row.country,
    city: row.city,
    addressLine: row.addressLine,
    websiteUrl: row.websiteUrl,
    bio: row.bio,
    locale: row.locale,
    isActive: row.isActive,
    createdAt: toIsoDateTime(row.createdAt),
    updatedAt: toIsoDateTime(row.updatedAt),
  };
}


function mapDevAccessIdentity(profileIdentity: ProfileIdentity): DevAccessIdentity {
  return {
    profileId: profileIdentity.profile.id,
    email: profileIdentity.email,
    displayName: profileIdentity.profile.displayName,
    role: profileIdentity.profile.role,
  };
}
function mapIdentity(profileRow: ProfileRow, userRow: UserRow): ProfileIdentity {
  return {
    profile: mapProfileRow(profileRow),
    email: userRow.email,
    authProvider: userRow.authProvider,
    authSubject: userRow.authSubject,
    emailVerified: userRow.emailVerified,
  };
}

class DrizzleProfilesRepository implements ProfilesRepository {
  async getById(profileId: string): Promise<Profile | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, profileId))
      .limit(1);

    return rows[0] ? mapProfileRow(rows[0]) : null;
  }



  async updateProfile(profileId: string, input: UpdateCurrentProfileInput): Promise<Profile | null> {
    const db = getDb();
    const updates: Partial<ProfileRow> = {
      updatedAt: new Date(),
    };

    if (typeof input.displayName === 'string') {
      const displayName = input.displayName.trim();
      if (displayName) {
        updates.displayName = displayName;
      }
    }

    if ('firstName' in input) {
      updates.firstName = input.firstName?.trim() || null;
    }

    if ('middleName' in input) {
      updates.middleName = input.middleName?.trim() || null;
    }

    if ('lastName' in input) {
      updates.lastName = input.lastName?.trim() || null;
    }

    if ('phone' in input) {
      updates.phone = input.phone?.trim() || null;
    }

    if ('avatarUrl' in input) {
      updates.avatarUrl = input.avatarUrl?.trim() || null;
    }

    if ('city' in input) {
      updates.city = input.city?.trim() || null;
    }

    if ('country' in input) {
      updates.country = input.country?.trim() || null;
    }

    if ('addressLine' in input) {
      updates.addressLine = input.addressLine?.trim() || null;
    }

    if ('websiteUrl' in input) {
      updates.websiteUrl = input.websiteUrl?.trim() || null;
    }

    if ('bio' in input) {
      updates.bio = input.bio?.trim() || null;
    }

    if ('locale' in input) {
      updates.locale = input.locale?.trim() || null;
    }

    const rows = await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.id, profileId))
      .returning();

    return rows[0] ? mapProfileRow(rows[0]) : null;
  }

  async listAccessIdentities(limit = 12): Promise<DevAccessIdentity[]> {
    const db = getDb();
    const rows = await db
      .select({
        profile: profiles,
        user: users,
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(eq(profiles.isActive, true))
      .limit(limit);

    return rows.map((row) => mapDevAccessIdentity(mapIdentity(row.profile, row.user)));
  }
  async getIdentityByEmail(email: string): Promise<ProfileIdentity | null> {
    const db = getDb();
    const rows = await db
      .select({
        profile: profiles,
        user: users,
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(eq(users.email, email))
      .limit(1);

    const result = rows[0];
    return result ? mapIdentity(result.profile, result.user) : null;
  }

  async getIdentityByProfileId(profileId: string): Promise<ProfileIdentity | null> {
    const db = getDb();
    const rows = await db
      .select({
        profile: profiles,
        user: users,
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(eq(profiles.id, profileId))
      .limit(1);

    const result = rows[0];
    return result ? mapIdentity(result.profile, result.user) : null;
  }
}

export function createProfilesRepository(): ProfilesRepository {
  return new DrizzleProfilesRepository();
}
