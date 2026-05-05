import type { DevAccessIdentity, Profile } from '@cane-corso-platform/contracts';
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
    lastName: row.lastName,
    avatarUrl: row.avatarUrl,
    phone: row.phone,
    country: row.country,
    city: row.city,
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
