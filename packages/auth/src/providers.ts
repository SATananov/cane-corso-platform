import type { AuthProvider, AuthStrategyDocument } from '@cane-corso-platform/contracts';

export type { AuthProvider, AuthStrategyDocument } from '@cane-corso-platform/contracts';

export const AUTH_PROVIDERS = ['clerk', 'better_auth', 'authjs', 'custom'] as const satisfies readonly AuthProvider[];

export type SessionTransport = AuthStrategyDocument['webSessionTransport'];

export interface AuthStrategyDecision extends AuthStrategyDocument {}

export interface ResolveAuthStrategyOptions {
  provider?: string | null;
  nodeEnv?: string | null;
  enableDevBootstrapSession?: boolean;
  requiresEmailVerification?: boolean;
}

export const DEFAULT_AUTH_STRATEGY: AuthStrategyDecision = {
  provider: 'custom',
  webSessionTransport: 'cookie',
  mobileSessionTransport: 'bearer',
  usesSecureCookies: true,
  requiresEmailVerification: false,
  developmentAccessEnabled: true,
  bootstrapFallbackEnabled: true,
  sessionTtlSeconds: 60 * 60 * 24 * 7,
};

export function isAuthProvider(value: string | null | undefined): value is AuthProvider {
  return Boolean(value) && AUTH_PROVIDERS.includes(value as AuthProvider);
}

export function normalizeAuthProvider(value: string | null | undefined): AuthProvider {
  if (!value) {
    return DEFAULT_AUTH_STRATEGY.provider;
  }

  const normalized = value.trim().toLowerCase();
  return isAuthProvider(normalized) ? normalized : DEFAULT_AUTH_STRATEGY.provider;
}

function resolveBooleanOverride(value: boolean | undefined, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

export function resolveAuthStrategy(options: ResolveAuthStrategyOptions = {}): AuthStrategyDecision {
  const provider = normalizeAuthProvider(options.provider);
  const isProduction = options.nodeEnv === 'production';
  const requiresEmailVerification = resolveBooleanOverride(
    options.requiresEmailVerification,
    provider !== 'custom',
  );
  const developmentAccessEnabled = provider === 'custom' && resolveBooleanOverride(
    options.enableDevBootstrapSession,
    !isProduction,
  );

  return {
    provider,
    webSessionTransport: 'cookie',
    mobileSessionTransport: 'bearer',
    usesSecureCookies: isProduction,
    requiresEmailVerification,
    developmentAccessEnabled,
    bootstrapFallbackEnabled: developmentAccessEnabled,
    sessionTtlSeconds: DEFAULT_AUTH_STRATEGY.sessionTtlSeconds,
  } satisfies AuthStrategyDecision;
}
