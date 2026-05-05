import type { AppSession } from './session';

export interface SessionDocument {
  session: AppSession;
  bootstrap: 'cookie' | 'dev-fallback';
}

export interface LocalSignUpRequest {
  intent?: 'member' | 'partner';
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  city?: string | null;
  country?: string | null;
  locale?: string | null;
}

export interface LocalSignInRequest {
  intent?: 'member' | 'partner';
  email: string;
  password: string;
}

export interface LocalAuthDocument {
  session: AppSession;
  bootstrap: 'cookie';
  nextPath: string;
}
