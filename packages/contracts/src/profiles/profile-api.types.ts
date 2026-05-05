import type { AppSession } from '../auth/session';
import type { Profile } from './profile.types';

export interface CurrentProfileDocument {
  profile: Profile;
  session: AppSession;
  bootstrap: 'cookie' | 'dev-fallback';
}


export interface UpdateCurrentProfileInput {
  displayName?: string;
  avatarUrl?: string | null;
  city?: string | null;
  country?: string | null;
  bio?: string | null;
  locale?: string | null;
}

export interface CurrentProfileMutationDocument extends CurrentProfileDocument {
  updated: true;
}
