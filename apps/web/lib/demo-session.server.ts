import type { AppRole } from '@cane-corso-platform/contracts';
import {
  DEMO_MEMBER_EMAIL,
  DEMO_MEMBER_PROFILE_ID,
  DEMO_MEMBER_USER_ID,
  getCurrentMemberSession,
  SEEDED_MEMBER_EMAIL,
  SEEDED_MEMBER_PROFILE_ID,
  SEEDED_MEMBER_USER_ID,
} from './session.server';

export {
  SEEDED_MEMBER_EMAIL,
  SEEDED_MEMBER_PROFILE_ID,
  SEEDED_MEMBER_USER_ID,
  DEMO_MEMBER_EMAIL,
  DEMO_MEMBER_PROFILE_ID,
  DEMO_MEMBER_USER_ID,
};

export interface DemoMemberSession {
  userId: string;
  profileId: string;
  email: string;
  role: AppRole;
  displayName: string;
  firstName: string | null;
  lastName: string | null;
  city: string | null;
  country: string | null;
  bio: string | null;
}

export async function getDemoMemberSession(): Promise<DemoMemberSession> {
  const { session } = await getCurrentMemberSession();

  return {
    userId: session.user.userId,
    profileId: session.user.profileId,
    email: session.user.email,
    role: session.user.role,
    displayName: session.user.displayName ?? session.user.email,
    firstName: session.firstName,
    lastName: session.lastName,
    city: session.city,
    country: session.country,
    bio: session.bio,
  };
}
