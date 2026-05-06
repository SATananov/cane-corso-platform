export interface HealthDocument {
  service: string;
  status: 'ok';
  environment: 'development' | 'production' | 'test';
  database: 'configured' | 'missing';
}

export interface DatabaseTargetHealthDocument {
  service: string;
  status: 'ok' | 'misconfigured' | 'unavailable';
  environment: 'development' | 'production' | 'test';
  provider: 'neon' | 'postgres' | 'unknown';
  expectedDatabase: string;
  activeDatabase: string | null;
  activeSchema: string | null;
  configuredRuntimeDatabase: string | null;
  configuredMigrationDatabase: string | null;
  runtimeDatabaseConfigured: boolean;
  migrationDatabaseConfigured: boolean;
  databaseMatchesExpected: boolean;
  runtimeDatabaseMatchesExpected: boolean;
  migrationDatabaseMatchesExpected: boolean;
}
