import { resolveAuthStrategy } from '@cane-corso-platform/auth';

const DEFAULT_APP_URL = 'http://localhost:3000';
const DEV_AUTH_SECRET = 'dev-only-cane-corso-platform-secret';
const INSECURE_AUTH_SECRET_VALUES = new Set(['change-me', 'dev-only-cane-corso-platform-secret']);

export function getAppUrl(): string {
  return process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_APP_URL;
}

export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === 'production';
}

function isUnsafeConfiguredSecret(value: string): boolean {
  return value.trim().length < 24 || INSECURE_AUTH_SECRET_VALUES.has(value.trim());
}

export function getAuthSecret(): string {
  const configuredSecret = process.env.AUTH_SECRET ?? process.env.SESSION_SECRET;

  if (configuredSecret) {
    if (isProductionRuntime() && isUnsafeConfiguredSecret(configuredSecret)) {
      throw new Error(
        'AUTH_SECRET (or SESSION_SECRET) must be a strong secret with at least 24 characters in production.',
      );
    }

    return configuredSecret;
  }

  if (isProductionRuntime()) {
    throw new Error('AUTH_SECRET (or SESSION_SECRET) is required in production.');
  }

  return DEV_AUTH_SECRET;
}

export function getAuthStrategy() {
  return resolveAuthStrategy({
    provider: process.env.AUTH_PROVIDER,
    nodeEnv: process.env.NODE_ENV,
    enableDevBootstrapSession:
      process.env.ENABLE_DEV_BOOTSTRAP_SESSION === 'true'
        ? true
        : process.env.ENABLE_DEV_BOOTSTRAP_SESSION === 'false'
          ? false
          : undefined,
  });
}

export function isDevBootstrapSessionEnabled(): boolean {
  return getAuthStrategy().bootstrapFallbackEnabled;
}

export function isDevelopmentAccessEnabled(): boolean {
  return getAuthStrategy().developmentAccessEnabled;
}
