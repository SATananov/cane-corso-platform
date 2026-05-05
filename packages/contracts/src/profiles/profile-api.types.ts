import type { AppSession } from '../auth/session';
import type { Profile } from './profile.types';

export interface CurrentProfileDocument {
  profile: Profile;
  session: AppSession;
  bootstrap: 'cookie' | 'dev-fallback';
}
