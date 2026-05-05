import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
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

const seededUser = {
  id: '11111111-1111-4111-8111-111111111110',
  authProvider: 'seed',
  authSubject: 'seed:member:starter',
  email: 'member@demo.cane-corso.local',
  emailVerified: true,
};

const demoMemberPassword = 'DemoMember123!';

const seededProfile = {
  id: '11111111-1111-4111-8111-111111111111',
  userId: seededUser.id,
  role: 'member',
  displayName: 'Starter Member',
  firstName: 'Starter',
  lastName: 'Member',
  avatarUrl: null,
  phone: '+359 000 000 000',
  country: 'Bulgaria',
  city: 'Kardzhali',
  bio: 'Seeded member profile used to bootstrap the first real My Dogs database flow.',
  locale: 'en',
  isActive: true,
};

const seededPartner = {
  id: '11111111-1111-4111-8111-111111111112',
  ownerProfileId: seededProfile.id,
  businessName: 'Corso Elite Vet Center',
  slug: 'corso-elite-vet-center',
  category: 'veterinary_clinic',
  shortDescription: 'A premium Cane Corso-focused veterinary service profile for public directory testing.',
  longDescription:
    'Demo approved service entry used to validate the Partners and Services vertical, detail page rendering, and category filtering.',
  country: 'Bulgaria',
  city: 'Sofia',
  websiteUrl: 'https://example.com/corso-elite-vet-center',
  phone: '+359 700 000 111',
  email: 'contact@corso-elite-vet-center.test',
  logoUrl: null,
  coverImageUrl: null,
  status: 'approved',
  isFeatured: true,
};

const seededPartnerApplication = {
  id: '11111111-1111-4111-8111-111111111113',
  applicantProfileId: seededProfile.id,
  businessName: 'Titan Boarding & Transport',
  category: 'boarding',
  shortDescription: 'Premium boarding and relocation support for large-breed Cane Corso owners.',
  longDescription:
    'Structured boarding, calm handling, and relocation preparation tailored to large-breed Cane Corso, with clear communication for owners before travel and arrival.',
  country: 'Bulgaria',
  city: 'Plovdiv',
  websiteUrl: 'https://example.com/titan-boarding-transport',
  logoUrl: null,
  coverImageUrl: null,
  message:
    'We focus on premium boarding and relocation support for large-breed Cane Corso, including travel preparation and calm handling.',
  contactEmail: 'hello@titan-boarding-transport.test',
  contactPhone: '+359 700 000 222',
  status: 'pending_review',
};

function normalizeFlag(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : undefined;
}

function getDatabaseUrl() {
  const value = process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL;
  if (!value) {
    throw new Error('DATABASE_URL is required for db:seed. Add it to the project root .env file. For Neon, paste the Neon PostgreSQL URL into DATABASE_URL.');
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

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

function verifyPassword(password, storedValue) {
  const [salt, storedHash] = storedValue.split(':');

  if (!salt || !storedHash) {
    return false;
  }

  const candidateHash = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (candidateHash.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateHash, storedBuffer);
}

async function seedLocalCredentials(client, userId, password) {
  const existing = await client.query(
    `SELECT password_hash
     FROM auth_local_credentials
     WHERE user_id = $1
     LIMIT 1`,
    [userId],
  );

  const currentHash = existing.rows[0]?.password_hash;

  if (currentHash && verifyPassword(password, currentHash)) {
    return;
  }

  await client.query(
    `INSERT INTO auth_local_credentials (user_id, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       updated_at = now()`,
    [userId, hashPassword(password)],
  );
}

async function main() {
  const pool = createPool(getDatabaseUrl());
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `
      INSERT INTO users (id, auth_provider, auth_subject, email, email_verified)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO UPDATE SET
        auth_provider = EXCLUDED.auth_provider,
        auth_subject = EXCLUDED.auth_subject,
        email = EXCLUDED.email,
        email_verified = EXCLUDED.email_verified,
        updated_at = now()
      `,
      [
        seededUser.id,
        seededUser.authProvider,
        seededUser.authSubject,
        seededUser.email,
        seededUser.emailVerified,
      ],
    );

    await client.query(
      `
      INSERT INTO profiles (
        id,
        user_id,
        role,
        display_name,
        first_name,
        last_name,
        avatar_url,
        phone,
        country,
        city,
        bio,
        locale,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        role = EXCLUDED.role,
        display_name = EXCLUDED.display_name,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        avatar_url = EXCLUDED.avatar_url,
        phone = EXCLUDED.phone,
        country = EXCLUDED.country,
        city = EXCLUDED.city,
        bio = EXCLUDED.bio,
        locale = EXCLUDED.locale,
        is_active = EXCLUDED.is_active,
        updated_at = now()
      `,
      [
        seededProfile.id,
        seededProfile.userId,
        seededProfile.role,
        seededProfile.displayName,
        seededProfile.firstName,
        seededProfile.lastName,
        seededProfile.avatarUrl,
        seededProfile.phone,
        seededProfile.country,
        seededProfile.city,
        seededProfile.bio,
        seededProfile.locale,
        seededProfile.isActive,
      ],
    );

    await seedLocalCredentials(client, seededUser.id, demoMemberPassword);


    await client.query(
      `
      INSERT INTO partners (
        id,
        owner_profile_id,
        business_name,
        slug,
        category,
        short_description,
        long_description,
        country,
        city,
        website_url,
        phone,
        email,
        logo_url,
        cover_image_url,
        status,
        is_featured,
        published_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, now())
      ON CONFLICT (id) DO UPDATE SET
        owner_profile_id = EXCLUDED.owner_profile_id,
        business_name = EXCLUDED.business_name,
        slug = EXCLUDED.slug,
        category = EXCLUDED.category,
        short_description = EXCLUDED.short_description,
        long_description = EXCLUDED.long_description,
        country = EXCLUDED.country,
        city = EXCLUDED.city,
        website_url = EXCLUDED.website_url,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        logo_url = EXCLUDED.logo_url,
        cover_image_url = EXCLUDED.cover_image_url,
        status = EXCLUDED.status,
        is_featured = EXCLUDED.is_featured,
        published_at = EXCLUDED.published_at,
        updated_at = now()
      `,
      [
        seededPartner.id,
        seededPartner.ownerProfileId,
        seededPartner.businessName,
        seededPartner.slug,
        seededPartner.category,
        seededPartner.shortDescription,
        seededPartner.longDescription,
        seededPartner.country,
        seededPartner.city,
        seededPartner.websiteUrl,
        seededPartner.phone,
        seededPartner.email,
        seededPartner.logoUrl,
        seededPartner.coverImageUrl,
        seededPartner.status,
        seededPartner.isFeatured,
      ],
    );

    await client.query(
      `
      INSERT INTO ecosystem_listings (
        owner_profile_id,
        listing_type,
        submission_channel,
        title,
        slug,
        category,
        short_description,
        long_description,
        country,
        city,
        website_url,
        phone,
        email,
        coverage_note,
        rules_note,
        logo_url,
        cover_image_url,
        status,
        is_featured,
        submitted_at,
        reviewed_at,
        published_at,
        review_note
      )
      VALUES ($1, 'partner_service', 'official_listing', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'published', $16, now(), now(), now(), $17)
      ON CONFLICT (slug) DO UPDATE SET
        owner_profile_id = EXCLUDED.owner_profile_id,
        listing_type = EXCLUDED.listing_type,
        submission_channel = EXCLUDED.submission_channel,
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        short_description = EXCLUDED.short_description,
        long_description = EXCLUDED.long_description,
        country = EXCLUDED.country,
        city = EXCLUDED.city,
        website_url = EXCLUDED.website_url,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        coverage_note = EXCLUDED.coverage_note,
        rules_note = EXCLUDED.rules_note,
        logo_url = EXCLUDED.logo_url,
        cover_image_url = EXCLUDED.cover_image_url,
        status = EXCLUDED.status,
        is_featured = EXCLUDED.is_featured,
        reviewed_at = now(),
        published_at = COALESCE(ecosystem_listings.published_at, now()),
        review_note = EXCLUDED.review_note,
        updated_at = now()
      `,
      [
        seededPartner.ownerProfileId,
        seededPartner.businessName,
        `partner-service-${seededPartner.slug}`,
        seededPartner.category,
        seededPartner.shortDescription,
        seededPartner.longDescription,
        seededPartner.country,
        seededPartner.city,
        seededPartner.websiteUrl,
        seededPartner.phone,
        seededPartner.email,
        'Official Partner / Services profile approved for the Cane Corso ecosystem.',
        'Visible after administrator approval. Community ratings remain separate from official approval.',
        seededPartner.logoUrl,
        seededPartner.coverImageUrl,
        seededPartner.isFeatured,
        'Seeded from approved Partner / Services profile.',
      ],
    );

    await client.query(
      `
      INSERT INTO partner_applications (
        id,
        applicant_profile_id,
        business_name,
        category,
        short_description,
        long_description,
        country,
        city,
        website_url,
        logo_url,
        cover_image_url,
        message,
        contact_email,
        contact_phone,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (id) DO UPDATE SET
        applicant_profile_id = EXCLUDED.applicant_profile_id,
        business_name = EXCLUDED.business_name,
        category = EXCLUDED.category,
        short_description = EXCLUDED.short_description,
        long_description = EXCLUDED.long_description,
        country = EXCLUDED.country,
        city = EXCLUDED.city,
        website_url = EXCLUDED.website_url,
        logo_url = EXCLUDED.logo_url,
        cover_image_url = EXCLUDED.cover_image_url,
        message = EXCLUDED.message,
        contact_email = EXCLUDED.contact_email,
        contact_phone = EXCLUDED.contact_phone,
        status = EXCLUDED.status,
        reviewed_at = null,
        review_note = null
      `,
      [
        seededPartnerApplication.id,
        seededPartnerApplication.applicantProfileId,
        seededPartnerApplication.businessName,
        seededPartnerApplication.category,
        seededPartnerApplication.shortDescription,
        seededPartnerApplication.longDescription,
        seededPartnerApplication.country,
        seededPartnerApplication.city,
        seededPartnerApplication.websiteUrl,
        seededPartnerApplication.logoUrl,
        seededPartnerApplication.coverImageUrl,
        seededPartnerApplication.message,
        seededPartnerApplication.contactEmail,
        seededPartnerApplication.contactPhone,
        seededPartnerApplication.status,
      ],
    );

    await client.query('COMMIT');
    console.log(`Seeded member profile: ${seededProfile.displayName} <${seededUser.email}>`);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('db:seed failed.');
  if (error instanceof Error) {
    console.error(error.stack ?? error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});
