#!/usr/bin/env node
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dbPackageRequire = createRequire(path.join(root, 'packages/db/package.json'));
const pg = dbPackageRequire('pg');
const { Pool } = pg;

for (const envPath of ['.env', '.env.local', 'apps/web/.env.local', 'packages/db/.env']) {
  dotenv.config({ path: path.join(root, envPath), override: false });
}

const expectedSeedSlugs = {
  draft: 'step16-draft-cane-corso-walk-field',
  pendingReview: 'step16-pending-cross-border-cane-corso-transport',
  needsChanges: 'step16-needs-changes-cane-corso-friendly-terrace',
  approved: 'step16-approved-cane-corso-boarding-hotel',
  published: 'step16-published-cane-corso-play-field',
  suggestion: 'step16-suggestion-future-cane-corso-event-idea',
};

const expectedCredentials = [
  'ecosystem.member@demo.cane-corso.local',
  'ecosystem.admin@demo.cane-corso.local',
];

const failures = [];

function normalizeFlag(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : undefined;
}

function shouldUseSsl(databaseUrl) {
  const explicit = normalizeFlag(process.env.DATABASE_SSL);
  if (['true', '1', 'require', 'required'].includes(explicit)) return true;
  if (['false', '0', 'disable', 'disabled'].includes(explicit)) return false;
  if (normalizeFlag(process.env.DATABASE_PROVIDER) === 'neon') return true;

  try {
    const parsed = new URL(databaseUrl);
    const sslMode = normalizeFlag(parsed.searchParams.get('sslmode'));
    return parsed.hostname.includes('.neon.tech') || Boolean(sslMode && sslMode !== 'disable');
  } catch {
    return false;
  }
}

function createPool() {
  const connectionString = process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    console.error('FAIL DATABASE_URL is required for ecosystem:manual:db:qa.');
    console.error('Run this command locally after setting apps/web/.env.local or root .env.local.');
    process.exit(1);
  }

  return new Pool({
    connectionString,
    ...(shouldUseSsl(connectionString) ? { ssl: { rejectUnauthorized: false } } : {}),
  });
}

function pass(label, detail = '') {
  console.log(`PASS ${label}${detail ? ` — ${detail}` : ''}`);
}

function fail(label, detail = '') {
  failures.push(`${label}${detail ? ` — ${detail}` : ''}`);
  console.error(`FAIL ${label}${detail ? ` — ${detail}` : ''}`);
}

function expect(label, condition, detail = '') {
  if (condition) pass(label, detail);
  else fail(label, detail);
}

function bySlug(rows, slug) {
  return rows.find((row) => row.slug === slug);
}

function isEmpty(value) {
  return value === null || value === undefined;
}

async function main() {
  const database = createPool();
  const client = await database.connect();

  try {
    const credentials = await client.query(
      `SELECT u.email, p.role, p.is_active, c.user_id
       FROM users u
       JOIN profiles p ON p.user_id = u.id
       LEFT JOIN auth_local_credentials c ON c.user_id = u.id
       WHERE u.email = ANY($1::text[])
       ORDER BY u.email`,
      [expectedCredentials],
    );

    expect('Seeded member/admin login rows exist', credentials.rowCount === 2, `${credentials.rowCount}/2 found`);
    expect('Seeded browser credentials exist for both logins', credentials.rows.every((row) => row.user_id), 'auth_local_credentials linked to seeded users');
    expect('Seeded admin profile has admin role', credentials.rows.some((row) => row.email === 'ecosystem.admin@demo.cane-corso.local' && row.role === 'admin'), 'ecosystem.admin@demo.cane-corso.local');
    expect('Seeded member profile has member role', credentials.rows.some((row) => row.email === 'ecosystem.member@demo.cane-corso.local' && row.role === 'member'), 'ecosystem.member@demo.cane-corso.local');

    const { rows } = await client.query(
      `SELECT id, slug, status, submission_channel, published_at, reviewed_at, submitted_at, review_note
       FROM ecosystem_listings
       WHERE slug LIKE 'step16-%'
       ORDER BY slug`,
    );

    expect('Step 16 seeded ecosystem listings exist', rows.length >= 6, `${rows.length} step16 rows found`);

    const draft = bySlug(rows, expectedSeedSlugs.draft);
    const pending = bySlug(rows, expectedSeedSlugs.pendingReview);
    const needsChanges = bySlug(rows, expectedSeedSlugs.needsChanges);
    const approved = bySlug(rows, expectedSeedSlugs.approved);
    const published = bySlug(rows, expectedSeedSlugs.published);
    const suggestion = bySlug(rows, expectedSeedSlugs.suggestion);

    expect('Draft seed remains draft and unpublished', draft?.status === 'draft' && isEmpty(draft.published_at), expectedSeedSlugs.draft);
    expect('Pending seed remains pending review and unpublished', pending?.status === 'pending_review' && isEmpty(pending.published_at), expectedSeedSlugs.pendingReview);
    expect('Needs-changes seed remains unpublished with review note', needsChanges?.status === 'needs_changes' && isEmpty(needsChanges.published_at) && Boolean(needsChanges.review_note), expectedSeedSlugs.needsChanges);
    expect('Approved seed is approved but not public yet', approved?.status === 'approved' && isEmpty(approved.published_at), expectedSeedSlugs.approved);
    expect('Published seed is published with published_at set', published?.status === 'published' && Boolean(published.published_at), expectedSeedSlugs.published);
    expect('Community suggestion seed stays internal even when approved', suggestion?.submission_channel === 'community_suggestion' && suggestion.status === 'approved' && isEmpty(suggestion.published_at), expectedSeedSlugs.suggestion);

    const publicRows = rows.filter((row) => row.status === 'published' && row.submission_channel !== 'community_suggestion');
    expect('Only the Step 16 published real listing is public-visible from the seed set', publicRows.length === 1 && publicRows[0].slug === expectedSeedSlugs.published, publicRows.map((row) => row.slug).join(', ') || 'no public rows');

    const unsafePublicRows = rows.filter((row) => row.slug !== expectedSeedSlugs.published && (row.status === 'published' || Boolean(row.published_at)));
    expect('No draft/pending/needs-changes/approved/suggestion seed is accidentally public', unsafePublicRows.length === 0, unsafePublicRows.map((row) => row.slug).join(', '));

    const reviewRows = await client.query(
      `SELECT l.slug, r.decision, r.note
       FROM ecosystem_reviews r
       JOIN ecosystem_listings l ON l.id = r.listing_id
       WHERE l.slug LIKE 'step16-%'
       ORDER BY l.slug, r.created_at`,
    );

    expect('Seeded review history exists for moderated Step 16 records', reviewRows.rowCount >= 5, `${reviewRows.rowCount} review rows found`);
    expect('Review history includes request changes, approve, and publish decisions', ['needs_changes', 'approve', 'publish'].every((decision) => reviewRows.rows.some((row) => row.decision === decision)), [...new Set(reviewRows.rows.map((row) => row.decision))].join(', '));
  } finally {
    client.release();
    await database.end();
  }

  if (failures.length > 0) {
    console.error('\nEcosystem seeded DB state QA failed.');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log('\nEcosystem seeded DB state QA complete. Public visibility seed rules are safe.');
}

main().catch((error) => {
  console.error('ecosystem:manual:db:qa failed.');
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
