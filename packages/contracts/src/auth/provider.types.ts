export type AuthProvider = 'clerk' | 'better_auth' | 'authjs' | 'custom';

export type SessionTransport = 'cookie' | 'bearer';

export interface AuthStrategyDocument {
  provider: AuthProvider;
  webSessionTransport: SessionTransport;
  mobileSessionTransport: SessionTransport;
  usesSecureCookies: boolean;
  requiresEmailVerification: boolean;
  developmentAccessEnabled: boolean;
  bootstrapFallbackEnabled: boolean;
  sessionTtlSeconds: number;
}
