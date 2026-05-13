import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import pg from 'pg';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../..');

for (const envPath of [
  path.join(projectRoot, '.env'),
  path.join(projectRoot, '.env.local'),
  path.join(projectRoot, 'packages/db/.env'),
]) {
  dotenv.config({ path: envPath, override: false });
}

export const TARGET_RECORDS = 10_000;
const BATCH_SIZE = 500;
const OWNER_PROFILE_ID = process.env.SOFTUNI_SCALE_OWNER_PROFILE_ID ?? '33333333-3333-4333-8333-333333333321';
const SLUG_PREFIX = process.env.SOFTUNI_SCALE_SLUG_PREFIX ?? 'softuni-scale-listing';

const listingTypes = [
  'partner_service',
  'transport_relocation',
  'hotel_boarding',
  'walk_play_place',
  'pet_friendly_place',
  'event',
];

const categories = [
  'training',
  'transport',
  'boarding',
  'friendly_place',
  'owner_support',
  'event',
];

const cities = ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Kardzhali', 'Ruse', 'Stara Zagora', 'Pleven'];

function normalizeFlag(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : undefined;
}

function getDatabaseUrl() {
  const value = process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL;
  if (!value) {
    throw new Error('DATABASE_URL is required for the SoftUni scalability seed.');
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

  if (isTruthyFlag(explicitSsl)) return true;
  if (isFalseyFlag(explicitSsl)) return false;
  if (provider === 'neon') return true;

  try {
    const url = new URL(databaseUrl);
    const sslMode = normalizeFlag(url.searchParams.get('sslmode'));
    if (sslMode && sslMode !== 'disable') return true;
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

function deterministicUuid(input) {
  const hex = crypto.createHash('sha1').update(input).digest('hex').slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

function buildListing(index) {
  const oneBased = index + 1;
  const padded = String(oneBased).padStart(5, '0');
  const listingType = listingTypes[index % listingTypes.length];
  const category = categories[index % categories.length];
  const city = cities[index % cities.length];
  const slug = `${SLUG_PREFIX}-${padded}`;

  return {
    id: deterministicUuid(`softuni-scale-listing-${padded}`),
    ownerProfileId: OWNER_PROFILE_ID,
    listingType,
    submissionChannel: listingType === 'partner_service' ? 'official_listing' : 'community_listing',
    title: `SoftUni scalability listing ${padded}`,
    slug,
    category,
    shortDescription: `Generated SoftUni scalability record ${padded} for paging and indexed directory validation.`,
    longDescription:
      `This generated record is used to validate the platform with at least ${TARGET_RECORDS.toLocaleString('en-US')} ecosystem entities. ` +
      'It is deterministic, safe to re-run, and does not represent a real business or public Cane Corso service.',
    country: 'Bulgaria',
    city,
    websiteUrl: `https://example.com/${slug}`,
    phone: '+359 700 134 500',
    email: `scale-${padded}@demo.cane-corso.local`,
    coverageNote: `Scale dataset coverage group ${index % 20}.`,
    rulesNote: 'Generated for SoftUni scalability validation; not a real public listing.',
    logoUrl: '/demo/step113/softuni-partner-cover.svg',
    coverImageUrl: '/demo/step113/softuni-community-cover.svg',
    googlePlaceId: `softuni-scale-place-${padded}`,
    googlePlaceName: `SoftUni scale place ${padded}`,
    googleFormattedAddress: `${city}, Bulgaria — generated demo address ${padded}`,
    googleMapsUrl: `https://maps.example.com/softuni-scale-${padded}`,
    latitude: String(42.0 + (index % 100) / 1000),
    longitude: String(25.0 + (index % 100) / 1000),
    status: 'published',
    isFeatured: index % 25 === 0,
  };
}

async function ensureOwnerExists(client) {
  const result = await client.query('select id from profiles where id = $1 limit 1', [OWNER_PROFILE_ID]);
  if (result.rowCount === 0) {
    throw new Error(
      `SoftUni scalability owner profile ${OWNER_PROFILE_ID} is missing. Run pnpm demo:seed:softuni first, then rerun this seed.`,
    );
  }
}

async function insertBatch(client, records) {
  const columns = [
    'id',
    'owner_profile_id',
    'listing_type',
    'submission_channel',
    'title',
    'slug',
    'category',
    'short_description',
    'long_description',
    'country',
    'city',
    'website_url',
    'phone',
    'email',
    'coverage_note',
    'rules_note',
    'logo_url',
    'cover_image_url',
    'google_place_id',
    'google_place_name',
    'google_formatted_address',
    'google_maps_url',
    'latitude',
    'longitude',
    'status',
    'is_featured',
    'submitted_at',
    'reviewed_at',
    'published_at',
    'review_note',
  ];

  const values = [];
  const placeholders = records.map((record, rowIndex) => {
    const base = rowIndex * columns.length;
    values.push(
      record.id,
      record.ownerProfileId,
      record.listingType,
      record.submissionChannel,
      record.title,
      record.slug,
      record.category,
      record.shortDescription,
      record.longDescription,
      record.country,
      record.city,
      record.websiteUrl,
      record.phone,
      record.email,
      record.coverageNote,
      record.rulesNote,
      record.logoUrl,
      record.coverImageUrl,
      record.googlePlaceId,
      record.googlePlaceName,
      record.googleFormattedAddress,
      record.googleMapsUrl,
      record.latitude,
      record.longitude,
      record.status,
      record.isFeatured,
      new Date(),
      new Date(),
      new Date(),
      'Generated by pnpm softuni:scalability:seed for Capstone paging validation.',
    );

    return `(${columns.map((_, columnIndex) => `$${base + columnIndex + 1}`).join(', ')})`;
  });

  await client.query(
    `insert into ecosystem_listings (${columns.join(', ')}) values ${placeholders.join(', ')}
     on conflict (slug) do update set
       title = excluded.title,
       category = excluded.category,
       short_description = excluded.short_description,
       long_description = excluded.long_description,
       city = excluded.city,
       status = excluded.status,
       is_featured = excluded.is_featured,
       published_at = excluded.published_at,
       review_note = excluded.review_note,
       updated_at = now()`,
    values,
  );
}

async function main() {
  const databaseUrl = getDatabaseUrl();
  const pool = createPool(databaseUrl);
  const client = await pool.connect();

  try {
    await ensureOwnerExists(client);

    for (let start = 0; start < TARGET_RECORDS; start += BATCH_SIZE) {
      const end = Math.min(start + BATCH_SIZE, TARGET_RECORDS);
      const records = [];
      for (let index = start; index < end; index += 1) {
        records.push(buildListing(index));
      }
      await insertBatch(client, records);
      console.log(`Seeded scalability records ${start + 1}-${end} / ${TARGET_RECORDS}`);
    }

    const countResult = await client.query(
      `select count(*)::int as count
       from ecosystem_listings
       where slug like $1`,
      [`${SLUG_PREFIX}-%`],
    );

    const count = Number(countResult.rows[0]?.count ?? 0);
    if (count < TARGET_RECORDS) {
      throw new Error(`Expected at least ${TARGET_RECORDS} generated records, found ${count}.`);
    }

    console.log(`SoftUni scalability seed complete: ${count} generated ecosystem listings are present.`);
    console.log('Suggested validation: GET /api/ecosystem?page=1&pageSize=24 and /api/ecosystem?page=2&pageSize=24');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
