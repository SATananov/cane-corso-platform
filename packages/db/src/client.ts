import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, type PoolConfig } from 'pg';
import * as schema from './schema';

type DatabaseProvider = 'postgres' | 'neon';

function normalizeFlag(value: string | undefined): string | undefined {
  return value?.trim().toLowerCase();
}

function getDatabaseProvider(): DatabaseProvider {
  const explicitProvider = normalizeFlag(process.env.DATABASE_PROVIDER);

  if (explicitProvider === 'neon') {
    return 'neon';
  }

  return 'postgres';
}

function getDatabaseUrl(): string {
  const value = process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL;

  if (!value) {
    throw new Error('Missing required environment variable: DATABASE_URL');
  }

  return value;
}

function isTruthyFlag(value: string | undefined): boolean {
  return value === 'true' || value === '1' || value === 'require' || value === 'required';
}

function isFalseyFlag(value: string | undefined): boolean {
  return value === 'false' || value === '0' || value === 'disable' || value === 'disabled';
}

function shouldUseSsl(connectionString: string): boolean {
  const explicitSsl = normalizeFlag(process.env.DATABASE_SSL);

  if (isTruthyFlag(explicitSsl)) {
    return true;
  }

  if (isFalseyFlag(explicitSsl)) {
    return false;
  }

  if (getDatabaseProvider() === 'neon') {
    return true;
  }

  try {
    const url = new URL(connectionString);
    const sslMode = normalizeFlag(url.searchParams.get('sslmode') ?? undefined);

    if (sslMode && sslMode !== 'disable') {
      return true;
    }

    return url.hostname.endsWith('.neon.tech') || url.hostname.includes('.neon.tech');
  } catch {
    return false;
  }
}

function getPoolConfig(): PoolConfig {
  const connectionString = getDatabaseUrl();
  const config: PoolConfig = { connectionString };

  if (shouldUseSsl(connectionString)) {
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
}

declare global {
  // eslint-disable-next-line no-var
  var __ccpPgPool: Pool | undefined;
}

function createPool(): Pool {
  return new Pool(getPoolConfig());
}

export function getPgPool(): Pool {
  if (!globalThis.__ccpPgPool) {
    globalThis.__ccpPgPool = createPool();
  }

  return globalThis.__ccpPgPool;
}

function createDb() {
  return drizzle(getPgPool(), { schema });
}

export type CaneCorsoDb = ReturnType<typeof createDb>;

let dbSingleton: CaneCorsoDb | undefined;

export function getDb(): CaneCorsoDb {
  if (dbSingleton) {
    return dbSingleton;
  }

  dbSingleton = createDb();
  return dbSingleton;
}
