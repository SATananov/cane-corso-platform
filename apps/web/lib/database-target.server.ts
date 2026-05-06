import { getPgPool } from '@cane-corso-platform/db';
import type { DatabaseTargetHealthDocument } from '@cane-corso-platform/contracts';

const DEFAULT_EXPECTED_DATABASE = 'cane_corso_platform';

type RuntimeEnvironment = DatabaseTargetHealthDocument['environment'];

type QueryRow = {
  active_database: string;
  active_schema: string;
};

function getRuntimeEnvironment(): RuntimeEnvironment {
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }

  if (process.env.NODE_ENV === 'test') {
    return 'test';
  }

  return 'development';
}

function normalizeDatabaseName(value: string | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export function getExpectedDatabaseName(): string {
  return normalizeDatabaseName(process.env.DATABASE_EXPECTED_NAME) ?? DEFAULT_EXPECTED_DATABASE;
}

export function getConfiguredDatabaseName(connectionString: string | undefined): string | null {
  if (!connectionString) {
    return null;
  }

  try {
    const url = new URL(connectionString);
    const pathname = url.pathname.replace(/^\//, '').trim();
    return pathname ? decodeURIComponent(pathname) : null;
  } catch {
    return null;
  }
}

function getProvider(): DatabaseTargetHealthDocument['provider'] {
  const provider = process.env.DATABASE_PROVIDER?.trim().toLowerCase();

  if (provider === 'neon' || provider === 'postgres') {
    return provider;
  }

  return 'unknown';
}

function buildBaseDocument(): Omit<DatabaseTargetHealthDocument, 'status' | 'activeDatabase' | 'activeSchema' | 'databaseMatchesExpected'> {
  const expectedDatabase = getExpectedDatabaseName();
  const configuredRuntimeDatabase = getConfiguredDatabaseName(process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL);
  const configuredMigrationDatabase = getConfiguredDatabaseName(process.env.DATABASE_URL_DIRECT);

  return {
    service: 'cane-corso-platform-web',
    environment: getRuntimeEnvironment(),
    provider: getProvider(),
    expectedDatabase,
    configuredRuntimeDatabase,
    configuredMigrationDatabase,
    runtimeDatabaseConfigured: Boolean(process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL),
    migrationDatabaseConfigured: Boolean(process.env.DATABASE_URL_DIRECT),
    runtimeDatabaseMatchesExpected: configuredRuntimeDatabase === expectedDatabase,
    migrationDatabaseMatchesExpected: configuredMigrationDatabase === expectedDatabase,
  };
}

function resolveStatus(document: Omit<DatabaseTargetHealthDocument, 'status'>): DatabaseTargetHealthDocument['status'] {
  if (!document.runtimeDatabaseConfigured || !document.activeDatabase) {
    return 'unavailable';
  }

  if (
    !document.databaseMatchesExpected ||
    !document.runtimeDatabaseMatchesExpected ||
    !document.migrationDatabaseConfigured ||
    !document.migrationDatabaseMatchesExpected
  ) {
    return 'misconfigured';
  }

  return 'ok';
}

export async function getRuntimeDatabaseTargetDocument(): Promise<DatabaseTargetHealthDocument> {
  const base = buildBaseDocument();

  if (!base.runtimeDatabaseConfigured) {
    const document: Omit<DatabaseTargetHealthDocument, 'status'> = {
      ...base,
      activeDatabase: null,
      activeSchema: null,
      databaseMatchesExpected: false,
    };

    return {
      ...document,
      status: resolveStatus(document),
    };
  }

  try {
    const result = await getPgPool().query<QueryRow>(
      'select current_database() as active_database, current_schema() as active_schema',
    );
    const row = result.rows[0];
    const activeDatabase = row?.active_database ?? null;
    const activeSchema = row?.active_schema ?? null;
    const document: Omit<DatabaseTargetHealthDocument, 'status'> = {
      ...base,
      activeDatabase,
      activeSchema,
      databaseMatchesExpected: activeDatabase === base.expectedDatabase,
    };

    return {
      ...document,
      status: resolveStatus(document),
    };
  } catch {
    const document: Omit<DatabaseTargetHealthDocument, 'status'> = {
      ...base,
      activeDatabase: null,
      activeSchema: null,
      databaseMatchesExpected: false,
    };

    return {
      ...document,
      status: resolveStatus(document),
    };
  }
}
