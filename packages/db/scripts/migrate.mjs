import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import pg from 'pg';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../..');
const migrationsDir = path.resolve(__dirname, '../drizzle');

for (const envPath of [
  path.join(projectRoot, '.env'),
  path.join(projectRoot, '.env.local'),
  path.join(projectRoot, 'packages/db/.env'),
]) {
  dotenv.config({ path: envPath, override: false });
}

function normalizeFlag(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : undefined;
}

function getDatabaseUrl() {
  let selectedVarName = '';
  let value = '';

  // Check in priority order: direct URL first (preferred for migrations)
  if (process.env.DATABASE_URL_DIRECT) {
    selectedVarName = 'DATABASE_URL_DIRECT';
    value = process.env.DATABASE_URL_DIRECT;
  } else if (process.env.DIRECT_DATABASE_URL) {
    selectedVarName = 'DIRECT_DATABASE_URL';
    value = process.env.DIRECT_DATABASE_URL;
  } else if (process.env.DATABASE_URL) {
    selectedVarName = 'DATABASE_URL';
    value = process.env.DATABASE_URL;
  } else if (process.env.NEON_DATABASE_URL) {
    selectedVarName = 'NEON_DATABASE_URL';
    value = process.env.NEON_DATABASE_URL;
  }

  if (!value) {
    throw new Error(
      'No database URL found for migrations. Please provide one of:\n' +
      '  • DATABASE_URL_DIRECT (recommended for Neon migrations)\n' +
      '  • DIRECT_DATABASE_URL (alternative direct connection variable)\n' +
      '  • DATABASE_URL (acceptable for local/dev or non-pooled setups)\n' +
      '  • NEON_DATABASE_URL (legacy fallback)\n' +
      '\n' +
      'For Neon production, DATABASE_URL_DIRECT must use the direct connection URL (without -pooler in hostname).\n' +
      'Add it to the project root .env file.'
    );
  }

  console.log(`Using migration database connection from: ${selectedVarName}`);

  // Guard against using pooled connections for migrations on Neon
  const provider = normalizeFlag(process.env.DATABASE_PROVIDER);
  if (provider === 'neon' && value.includes('-pooler')) {
    throw new Error(
      `Pooled Neon connection cannot be used for migrations.\n` +
      `\n` +
      `Selected URL source: ${selectedVarName}\n` +
      `Database provider: ${provider}\n` +
      `\n` +
      `Issue: The selected connection string contains "-pooler", which is a Neon pooled connection.\n` +
      `Neon pooled connections do not support DDL (Data Definition Language) operations required by migrations.\n` +
      `\n` +
      `Solution:\n` +
      `  1. Set DATABASE_URL_DIRECT to your Neon direct connection URL\n` +
      `  2. Direct URL hostname should NOT contain "-pooler"\n` +
      `  3. Run pnpm db:migrate again\n` +
      `\n` +
      `Example direct URL (note: no -pooler):\n` +
      `  postgresql://user:password@DIRECT_NEON_HOST/dbname?sslmode=require`
    );
  }

  return value;
}

function isTruthyFlag(value) {
  return value === 'true' || value === '1' || value === 'require' || value === 'required';
}

function isFalseyFlag(value) {
  return value === 'false' || value === '0' || value === 'disable' || value === 'disabled';
}

function shouldUseSsl(databaseUrl) {
  const explicitSsl = normalizeFlag(process.env.DATABASE_SSL);
  const provider = normalizeFlag(process.env.DATABASE_PROVIDER);

  if (isTruthyFlag(explicitSsl)) {
    return true;
  }

  if (isFalseyFlag(explicitSsl)) {
    return false;
  }

  if (provider === 'neon') {
    return true;
  }

  try {
    const url = new URL(databaseUrl);
    const sslMode = normalizeFlag(url.searchParams.get('sslmode'));

    if (sslMode && sslMode !== 'disable') {
      return true;
    }

    return url.hostname.endsWith('.neon.tech') || url.hostname.includes('.neon.tech');
  } catch {
    return false;
  }
}

function createPool(databaseUrl) {
  const config = { connectionString: databaseUrl };

  if (shouldUseSsl(databaseUrl)) {
    config.ssl = { rejectUnauthorized: false };
  }

  return new Pool(config);
}

function isNeonDatabaseUrl(databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    return url.hostname.endsWith('.neon.tech') || url.hostname.includes('.neon.tech');
  } catch {
    return false;
  }
}

function quoteIdentifier(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function getDatabaseName(databaseUrl) {
  const url = new URL(databaseUrl);
  const databaseName = decodeURIComponent(url.pathname.replace(/^\//, ''));

  if (!databaseName) {
    throw new Error('DATABASE_URL must include a database name, for example .../cane_corso_platform');
  }

  return databaseName;
}

function buildAdminConnectionString(databaseUrl) {
  const url = new URL(databaseUrl);
  url.pathname = '/postgres';
  return url.toString();
}

async function ensureDatabaseExists(databaseUrl) {
  const databaseName = getDatabaseName(databaseUrl);
  if (isNeonDatabaseUrl(databaseUrl)) {
    throw new Error('The target Neon database does not exist or is not reachable. Create/select it in Neon first, then run pnpm db:migrate again.');
  }

  const adminPool = createPool(buildAdminConnectionString(databaseUrl));
  const adminClient = await adminPool.connect();

  try {
    const existsResult = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [databaseName]);
    if (existsResult.rowCount && existsResult.rowCount > 0) {
      console.log(`Database already exists: ${databaseName}`);
      return;
    }

    console.log(`Creating missing database: ${databaseName}`);
    await adminClient.query(`CREATE DATABASE ${quoteIdentifier(databaseName)}`);
    console.log(`Database created: ${databaseName}`);
  } finally {
    adminClient.release();
    await adminPool.end();
  }
}

async function connectWithBootstrap(databaseUrl) {
  const pool = createPool(databaseUrl);

  try {
    const client = await pool.connect();
    return { pool, client };
  } catch (error) {
    await pool.end().catch(() => undefined);

    if (error && typeof error === 'object' && 'code' in error && error.code === '3D000') {
      await ensureDatabaseExists(databaseUrl);
      const retryPool = createPool(databaseUrl);
      const retryClient = await retryPool.connect();
      return { pool: retryPool, client: retryClient };
    }

    throw error;
  }
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS __ccp_migrations (
      id serial PRIMARY KEY,
      file_name text NOT NULL UNIQUE,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

async function getAppliedMigrations(client) {
  const result = await client.query('SELECT file_name FROM __ccp_migrations ORDER BY id ASC');
  return new Set(result.rows.map((row) => row.file_name));
}

async function listMigrationFiles() {
  const entries = await fs.readdir(migrationsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => entry.name)
    .sort();
}

async function main() {
  const databaseUrl = getDatabaseUrl();
  console.log(`Using database: ${getDatabaseName(databaseUrl)}`);

  const { pool, client } = await connectWithBootstrap(databaseUrl);

  try {
    await ensureMigrationsTable(client);
    const appliedMigrations = await getAppliedMigrations(client);
    const migrationFiles = await listMigrationFiles();

    if (migrationFiles.length === 0) {
      console.log(`No SQL migration files found in ${migrationsDir}`);
      return;
    }

    for (const fileName of migrationFiles) {
      if (appliedMigrations.has(fileName)) {
        console.log(`Skipping already applied migration: ${fileName}`);
        continue;
      }

      const migrationPath = path.join(migrationsDir, fileName);
      const sql = await fs.readFile(migrationPath, 'utf8');

      console.log(`Applying migration: ${fileName}`);
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO __ccp_migrations (file_name) VALUES ($1)', [fileName]);
      await client.query('COMMIT');
    }

    console.log('Database migrations complete.');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('db:migrate failed.');
  if (error instanceof Error) {
    console.error(error.stack ?? error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});
