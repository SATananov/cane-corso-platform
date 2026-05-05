export type AppRuntimeEnvironment = 'development' | 'test' | 'production';

export interface BaseEnvConfig {
  nodeEnv: AppRuntimeEnvironment;
  appUrl: string;
  databaseUrl: string;
  authSecret: string;
  storageBucketDogs: string;
  storageBucketCertificates: string;
  storageBucketPartners: string;
}

export interface PublicEnvConfig {
  publicAppUrl: string;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getNodeEnv(): AppRuntimeEnvironment {
  const value = process.env.NODE_ENV;

  if (value === 'production' || value === 'test' || value === 'development') {
    return value;
  }

  return 'development';
}

export function getBaseEnvConfig(): BaseEnvConfig {
  return {
    nodeEnv: getNodeEnv(),
    appUrl: getRequiredEnv('APP_URL'),
    databaseUrl: getRequiredEnv('DATABASE_URL'),
    authSecret: getRequiredEnv('AUTH_SECRET'),
    storageBucketDogs: getRequiredEnv('STORAGE_BUCKET_DOGS'),
    storageBucketCertificates: getRequiredEnv('STORAGE_BUCKET_CERTIFICATES'),
    storageBucketPartners: getRequiredEnv('STORAGE_BUCKET_PARTNERS'),
  };
}

export function getPublicEnvConfig(): PublicEnvConfig {
  return {
    publicAppUrl: getRequiredEnv('NEXT_PUBLIC_APP_URL'),
  };
}
