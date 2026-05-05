import type { AppRole } from './roles';
import type { AppSession } from './session';

export interface DevAccessIdentity {
  profileId: string;
  email: string;
  displayName: string;
  role: AppRole;
}

export interface DevAccessIdentitiesDocument {
  identities: DevAccessIdentity[];
}

export interface DevSignInRequest {
  email: string;
}

export interface DevSignInDocument {
  session: AppSession;
  bootstrap: 'cookie';
}
