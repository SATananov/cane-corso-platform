export const SESSION_COOKIE_NAME = 'ccp_session';
export const REFRESH_COOKIE_NAME = 'ccp_refresh';

export interface SessionCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  maxAgeSeconds: number;
}

export const DEFAULT_SESSION_COOKIE_OPTIONS: SessionCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  maxAgeSeconds: 60 * 60 * 24 * 7,
};

export const DEFAULT_REFRESH_COOKIE_OPTIONS: SessionCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  maxAgeSeconds: 60 * 60 * 24 * 30,
};
