import { randomBytes, scryptSync } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import pg from 'pg';

const { Pool } = pg;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

for (const envPath of ['.env', '.env.local', 'apps/web/.env.local', 'packages/db/.env']) {
  dotenv.config({ path: path.join(root, envPath), override: false });
}

const member = {
  userId: '22222222-2222-4222-8222-222222222210',
  profileId: '22222222-2222-4222-8222-222222222211',
  email: 'ecosystem.member@demo.cane-corso.local',
  role: 'member',
  name: 'Ecosystem Demo Member',
  first: 'Ecosystem',
  last: 'Member',
};
const admin = {
  userId: '22222222-2222-4222-8222-222222222220',
  profileId: '22222222-2222-4222-8222-222222222221',
  email: 'ecosystem.admin@demo.cane-corso.local',
  role: 'admin',
  name: 'Ecosystem Demo Admin',
  first: 'Ecosystem',
  last: 'Admin',
};
const passwords = { member: 'DemoMember123!', admin: 'DemoAdmin123!' };

const listings = [
  ['22222222-2222-4222-8222-222222222301', 'walk_play_place', 'community_listing', 'Step 16 Draft — Cane Corso Walk Field', 'step16-draft-cane-corso-walk-field', 'walk_field', 'draft', false, null, null, null, null],
  ['22222222-2222-4222-8222-222222222302', 'transport_relocation', 'official_listing', 'Step 16 Pending — Cross-border Cane Corso Transport', 'step16-pending-cross-border-cane-corso-transport', 'transport_relocation', 'pending_review', false, new Date(), null, null, null],
  ['22222222-2222-4222-8222-222222222303', 'pet_friendly_place', 'community_listing', 'Step 16 Needs Changes — Cane Corso Friendly Terrace', 'step16-needs-changes-cane-corso-friendly-terrace', 'pet_friendly_place', 'needs_changes', false, new Date(), new Date(), null, 'Please clarify the local rules for large Cane Corso visitors before publication.'],
  ['22222222-2222-4222-8222-222222222304', 'hotel_boarding', 'official_listing', 'Step 16 Approved — Cane Corso Boarding Hotel', 'step16-approved-cane-corso-boarding-hotel', 'hotel_boarding', 'approved', false, new Date(), new Date(), null, 'Approved for manual publish testing.'],
  ['22222222-2222-4222-8222-222222222305', 'walk_play_place', 'community_listing', 'Step 16 Published — Cane Corso Play Field', 'step16-published-cane-corso-play-field', 'walk_play_place', 'published', true, new Date(), new Date(), new Date(), 'Published for Step 16 public visibility verification.'],
  ['22222222-2222-4222-8222-222222222306', 'event', 'community_suggestion', 'Step 16 Suggestion — Future Cane Corso Event Idea', 'step16-suggestion-future-cane-corso-event-idea', 'event_idea', 'approved', false, new Date(), new Date(), null, 'Approved as an internal community suggestion only.'],
];

const reviews = [
  ['22222222-2222-4222-8222-222222222401', listings[2][0], 'needs_changes', listings[2][11]],
  ['22222222-2222-4222-8222-222222222402', listings[3][0], 'approve', listings[3][11]],
  ['22222222-2222-4222-8222-222222222403', listings[4][0], 'approve', 'Approved before publication.'],
  ['22222222-2222-4222-8222-222222222404', listings[4][0], 'publish', listings[4][11]],
  ['22222222-2222-4222-8222-222222222405', listings[5][0], 'approve', listings[5][11]],
];

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
    throw new Error('DATABASE_URL is required for ecosystem:manual:seed.');
  }

  return new Pool({
    connectionString,
    ...(shouldUseSsl(connectionString) ? { ssl: { rejectUnauthorized: false } } : {}),
  });
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

async function seedIdentity(client, identity, password) {
  await client.query(
    `INSERT INTO users (id, auth_provider, auth_subject, email, email_verified)
     VALUES ($1, 'local', $2, $3, true)
     ON CONFLICT (id) DO UPDATE SET
       auth_provider = EXCLUDED.auth_provider,
       auth_subject = EXCLUDED.auth_subject,
       email = EXCLUDED.email,
       email_verified = true,
       updated_at = now()`,
    [identity.userId, `local:${identity.email}`, identity.email],
  );

  await client.query(
    `INSERT INTO profiles (id, user_id, role, display_name, first_name, last_name, phone, country, city, bio, locale, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, '+359 700 016 000', 'Bulgaria', 'Kardzhali',
       'Seeded profile for Step 16 manual ecosystem flow testing.', 'bg', true)
     ON CONFLICT (id) DO UPDATE SET
       user_id = EXCLUDED.user_id,
       role = EXCLUDED.role,
       display_name = EXCLUDED.display_name,
       first_name = EXCLUDED.first_name,
       last_name = EXCLUDED.last_name,
       is_active = true,
       updated_at = now()`,
    [identity.profileId, identity.userId, identity.role, identity.name, identity.first, identity.last],
  );

  await client.query(
    `INSERT INTO auth_local_credentials (user_id, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       updated_at = now()`,
    [identity.userId, hashPassword(password)],
  );
}

async function seedListing(client, item) {
  const [id, type, channel, title, slug, category, status, featured, submittedAt, reviewedAt, publishedAt, note] = item;

  await client.query(
    `INSERT INTO ecosystem_listings (
       id, owner_profile_id, listing_type, submission_channel, title, slug, category,
       short_description, long_description, country, city, website_url, phone, email,
       coverage_note, rules_note, status, is_featured, submitted_at, reviewed_at, published_at, review_note
     )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'Bulgaria','Kardzhali',$10,'+359 700 016 100',$11,$12,$13,$14,$15,$16,$17,$18,$19)
     ON CONFLICT (id) DO UPDATE SET
       listing_type = EXCLUDED.listing_type,
       submission_channel = EXCLUDED.submission_channel,
       title = EXCLUDED.title,
       slug = EXCLUDED.slug,
       category = EXCLUDED.category,
       short_description = EXCLUDED.short_description,
       long_description = EXCLUDED.long_description,
       status = EXCLUDED.status,
       is_featured = EXCLUDED.is_featured,
       submitted_at = EXCLUDED.submitted_at,
       reviewed_at = EXCLUDED.reviewed_at,
       published_at = EXCLUDED.published_at,
       review_note = EXCLUDED.review_note,
       updated_at = now()`,
    [
      id,
      member.profileId,
      type,
      channel,
      title,
      slug,
      category,
      `${status} seeded item for manual ecosystem evidence.`,
      `Step 16 seeded ${status} listing used to test member, admin, and public ecosystem lifecycle behavior.`,
      `https://example.com/${slug}`,
      `${slug}@step16.test`,
      'Seeded coverage note for Step 16 manual testing.',
      'Seeded rules note for Step 16 manual testing.',
      status,
      featured,
      submittedAt,
      reviewedAt,
      publishedAt,
      note,
    ],
  );
}

async function seedReview(client, review) {
  await client.query(
    `INSERT INTO ecosystem_reviews (id, listing_id, reviewer_profile_id, decision, note)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (id) DO UPDATE SET
       listing_id = EXCLUDED.listing_id,
       reviewer_profile_id = EXCLUDED.reviewer_profile_id,
       decision = EXCLUDED.decision,
       note = EXCLUDED.note,
       created_at = now()`,
    [review[0], review[1], admin.profileId, review[2], review[3]],
  );
}

async function main() {
  const database = createPool();
  const client = await database.connect();

  try {
    await client.query('BEGIN');
    await seedIdentity(client, member, passwords.member);
    await seedIdentity(client, admin, passwords.admin);

    for (const item of listings) {
      await seedListing(client, item);
    }

    for (const review of reviews) {
      await seedReview(client, review);
    }

    await client.query('COMMIT');

    console.log('Step 16 ecosystem manual test seed complete.');
    console.log(`Member login: ${member.email} / ${passwords.member}`);
    console.log(`Admin login:  ${admin.email} / ${passwords.admin}`);
    console.log('Manual test routes: /ecosystem, /admin/ecosystem, /partners');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
    await database.end();
  }
}

main().catch((error) => {
  console.error('ecosystem:manual:seed failed.');
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
