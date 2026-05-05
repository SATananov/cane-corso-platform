import type { AppRole } from './roles';

export interface SessionUser {
  userId: string;
  profileId: string;
  email: string;
  role: AppRole;
  authProvider: string;
  emailVerified: boolean;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface AppSession {
  user: SessionUser;
  issuedAt: string;
  expiresAt: string;
}
