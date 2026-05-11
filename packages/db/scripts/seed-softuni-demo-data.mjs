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
  path.join(projectRoot, 'apps/web/.env.local'),
  path.join(projectRoot, 'packages/db/.env'),
]) {
  dotenv.config({ path: envPath, override: false });
}

const credentials = {
  memberPassword: 'DemoMember123!',
  partnerPassword: 'DemoPartner123!',
  adminPassword: 'DemoAdmin123!',
};

const identities = {
  member: {
    userId: '33333333-3333-4333-8333-333333333310',
    profileId: '33333333-3333-4333-8333-333333333311',
    authSubject: 'local:softuni.demo@usg.local',
    email: 'softuni.demo@usg.local',
    role: 'member',
    displayName: 'SoftUni demo',
    firstName: 'SoftUni',
    middleName: 'USG',
    lastName: 'Demo',
    avatarUrl: '/demo/step113/softuni-demo-owner.svg',
    phone: '+359 700 113 001',
    country: 'Bulgaria',
    city: 'Kardzhali',
    addressLine: 'Demo address 113, Kardzhali',
    websiteUrl: 'https://example.com/softuni-demo-owner',
    bio: 'Учебен SoftUni demo собственик с попълнен Cane Corso профил, измервания, здравен архив, Registry публикация, USG оценка и community активност.',
    locale: 'bg',
  },
  partner: {
    userId: '33333333-3333-4333-8333-333333333320',
    profileId: '33333333-3333-4333-8333-333333333321',
    authSubject: 'local:softuni.partner@usg.local',
    email: 'softuni.partner@usg.local',
    role: 'partner',
    displayName: 'SoftUni Partner',
    firstName: 'SoftUni',
    middleName: 'USG',
    lastName: 'Partner',
    avatarUrl: '/demo/step113/softuni-partner-cover.svg',
    phone: '+359 700 113 002',
    country: 'Bulgaria',
    city: 'Sofia',
    addressLine: 'Demo partner office 113, Sofia',
    websiteUrl: 'https://example.com/softuni-partner',
    bio: 'Учебен SoftUni Partner профил за проверка на партньорски услуги, partner application, directory, rating и ecosystem синхронизация.',
    locale: 'bg',
  },
  admin: {
    userId: '33333333-3333-4333-8333-333333333330',
    profileId: '33333333-3333-4333-8333-333333333331',
    authSubject: 'local:softuni.admin@usg.local',
    email: 'softuni.admin@usg.local',
    role: 'admin',
    displayName: 'SoftUni admin',
    firstName: 'SoftUni',
    middleName: 'USG',
    lastName: 'Admin',
    avatarUrl: '/demo/step113/softuni-community-cover.svg',
    phone: '+359 700 113 003',
    country: 'Bulgaria',
    city: 'Sofia',
    addressLine: 'Demo admin office 113, Sofia',
    websiteUrl: 'https://example.com/softuni-admin',
    bio: 'Учебен SoftUni admin профил за admin review, Registry moderation, Certificate issue/verify, Partners approval и Ecosystem moderation tests.',
    locale: 'bg',
  },
};

const dog = {
  id: '33333333-3333-4333-8333-333333333410',
  ownerProfileId: identities.member.profileId,
  name: 'Ares SoftUni demo',
  slug: 'ares-softuni-demo',
  sex: 'male',
  dateOfBirth: '2023-04-18',
  color: 'black brindle',
  microchipNumber: 'SOFTUNI-DEMO-000113',
  pedigreeNumber: 'USG-DEMO-PED-113',
  shortDescription: 'Пълен учебен Cane Corso профил за визуална проверка на собственик, измервания, Registry, Certificate, Verify, Gallery и FCI ориентир.',
  longDescription:
    'Ares SoftUni demo е измислен демонстрационен Cane Corso профил. Данните са създадени, за да се тества цялото преживяване: попълнен собственик, родословна информация, архив с килограми и възраст, здравни записи, админ оценка, community rating, Registry публикация и USG certificate verify flow.',
  city: 'Kardzhali',
  country: 'Bulgaria',
  bloodlineNote:
    'Demo lineage note: Mark I SoftUni Demo × Hera SoftUni Demo. Използва се само за учебни тестове и не представлява реално родословие.',
  registryClass: 'owner_declared_cane_corso',
  mainImageUrl: '/demo/step113/softuni-demo-cane-primary.svg',
  visibility: 'public',
  lifecycleStatus: 'published',
  pedigreeJson: {
    sire: {
      name: 'Mark I SoftUni Demo',
      country: 'Bulgaria',
      note: 'Измислен баща за проверка на pedigree tree визуализация.',
    },
    dam: {
      name: 'Hera SoftUni Demo',
      country: 'Bulgaria',
      note: 'Измислена майка за проверка на pedigree tree визуализация.',
    },
    paternalGrandSire: { name: 'Brutus Nero Demo', country: 'Italy' },
    paternalGrandDam: { name: 'Reia Demo Line', country: 'Bulgaria' },
    maternalGrandSire: { name: 'Thor Demo Guard', country: 'Bulgaria' },
    maternalGrandDam: { name: 'Ara Demo Heritage', country: 'Bulgaria' },
    notes:
      'Demo pedigree payload for Step 113. Not official pedigree data. Used to verify lineage cards and owner/admin visibility.',
  },
};

const media = [
  {
    id: '33333333-3333-4333-8333-333333333421',
    storageKey: 'demo/step113/ares-softuni-demo-primary.svg',
    publicUrl: '/demo/step113/softuni-demo-cane-primary.svg',
    altText: 'Ares SoftUni demo main Cane Corso placeholder',
    sortOrder: 0,
    isPrimary: true,
    visibleInRegistry: true,
    visibleInUsgGallery: true,
  },
  {
    id: '33333333-3333-4333-8333-333333333422',
    storageKey: 'demo/step113/ares-softuni-demo-side.svg',
    publicUrl: '/demo/step113/softuni-demo-cane-side.svg',
    altText: 'Ares SoftUni demo side profile placeholder',
    sortOrder: 1,
    isPrimary: false,
    visibleInRegistry: true,
    visibleInUsgGallery: true,
  },
  {
    id: '33333333-3333-4333-8333-333333333423',
    storageKey: 'demo/step113/ares-softuni-demo-structure.svg',
    publicUrl: '/demo/step113/softuni-community-cover.svg',
    altText: 'Ares SoftUni demo structure and evidence placeholder',
    sortOrder: 2,
    isPrimary: false,
    visibleInRegistry: true,
    visibleInUsgGallery: false,
  },
];

const measurements = [
  ['33333333-3333-4333-8333-333333333501', '2023-08-18', 4, 20.8, 47.5, 52.8, 63.0, 17.1, 5.7, 11.4, '4 months: steady puppy growth, social and confident.'],
  ['33333333-3333-4333-8333-333333333502', '2023-12-18', 8, 33.6, 58.4, 64.8, 75.0, 20.9, 6.9, 13.9, '8 months: strong adolescent phase; measurements remain owner-entered demo data.'],
  ['33333333-3333-4333-8333-333333333503', '2024-04-18', 12, 41.9, 63.8, 70.7, 82.0, 22.9, 7.6, 15.2, '12 months: young adult transition; still not final FCI judgment.'],
  ['33333333-3333-4333-8333-333333333504', '2024-10-18', 18, 46.7, 66.4, 73.7, 87.5, 23.8, 8.0, 15.9, '18 months: near mature profile, useful for USG/FCI orientation only.'],
  ['33333333-3333-4333-8333-333333333505', '2025-04-18', 24, 48.2, 67.0, 74.4, 89.0, 24.1, 8.1, 16.2, '24 months: complete demo record for weight/age table and FCI standard comparison.'],
];

const healthRecords = [
  ['33333333-3333-4333-8333-333333333531', 'vaccine', 'Core vaccine booster — demo', '2025-04-20', '2026-04-20', 'Dr. Demo Vet', 'SoftUni Demo Vet Clinic', 'VAC-DEMO-113', null, 'Demo vaccine record for owner health tracker table.'],
  ['33333333-3333-4333-8333-333333333532', 'vet_visit', 'Annual orthopedic check — demo', '2025-05-03', null, 'Dr. Demo Ortho', 'SoftUni Demo Vet Clinic', null, null, 'Demo note: no real medical meaning; only used for UI testing.'],
  ['33333333-3333-4333-8333-333333333533', 'deworming', 'Deworming schedule — demo', '2025-06-15', '2025-09-15', 'Dr. Demo Vet', 'SoftUni Demo Vet Clinic', 'DEW-DEMO-113', null, 'Demo deworming record with next due date.'],
];

const submission = {
  id: '33333333-3333-4333-8333-333333333601',
  status: 'published',
  currentReviewNote: 'SoftUni demo profile approved for public Registry and Certificate testing.',
};

const assessment = {
  id: '33333333-3333-4333-8333-333333333611',
  registryDecision: 'registry_approved',
  certificateDecision: 'usg_certified',
  breedTypeScore: 5,
  temperamentScore: 5,
  pedigreeScore: 4,
  healthScore: 4,
  presentationScore: 5,
  overallScore: 5,
  publicNote:
    'SoftUni demo admin assessment: complete owner-entered evidence, strong presentation, measurement archive available. This is educational demo data, not a real expert judgment.',
  privateNote:
    'Seeded by Step 113 for admin review, public Registry, Gallery, Certificate and Verify visual checks.',
};

const registryEntry = {
  id: '33333333-3333-4333-8333-333333333621',
  publicSlug: 'ares-softuni-demo',
  title: 'Ares SoftUni demo — Cane Corso Registry profile',
  summary:
    'Публикуван SoftUni demo Cane Corso профил с пълни owner данни, измервания, health archive, USG оценка, community rating и активен Verify код.',
  heroImageUrl: '/demo/step113/softuni-demo-cane-primary.svg',
};

const certificate = {
  id: '33333333-3333-4333-8333-333333333631',
  certificateCode: 'USG-SOFTUNI-DEMO-113',
  issueDate: '2026-05-11',
  status: 'active',
  verificationSlug: 'ares-softuni-demo-verify',
  certificateImageUrl: '/demo/step113/softuni-demo-cane-primary.svg',
  snapshotJson: {
    dogName: dog.name,
    dogSlug: dog.slug,
    ownerDisplayName: identities.member.displayName,
    registryPublicSlug: registryEntry.publicSlug,
    certificateCode: 'USG-SOFTUNI-DEMO-113',
    verificationSlug: 'ares-softuni-demo-verify',
    issueDate: '2026-05-11',
    evidenceLevel: 'demo_complete_profile',
    boundary: 'USG demo certificate data. Not an FCI pedigree, official club record, veterinary certificate, or real expert judgment.',
  },
};

const partner = {
  id: '33333333-3333-4333-8333-333333333710',
  ownerProfileId: identities.partner.profileId,
  businessName: 'SoftUni Partner',
  slug: 'softuni-partner',
  category: 'training_transport_owner_support',
  shortDescription:
    'Учебен партньор за Cane Corso обучение, транспорт и owner support — използва се за Partner Directory, ratings и ecosystem визуализация.',
  longDescription:
    'SoftUni Partner е измислен демо партньор, който комбинира обучение, поведенчески консултации, подготовка за снимки и безопасен транспорт за едри породи. Данните са само за тестове на партньорския flow и публичните карти.',
  country: 'Bulgaria',
  city: 'Sofia',
  websiteUrl: 'https://example.com/softuni-partner',
  phone: '+359 700 113 222',
  email: 'softuni.partner@usg.local',
  logoUrl: '/demo/step113/softuni-partner-cover.svg',
  coverImageUrl: '/demo/step113/softuni-partner-cover.svg',
  status: 'approved',
  isFeatured: true,
};

const partnerApplication = {
  id: '33333333-3333-4333-8333-333333333711',
  applicantProfileId: identities.partner.profileId,
  businessName: 'SoftUni Partner — Pending Expansion',
  category: 'boarding_transport',
  shortDescription: 'Pending demo application for admin partner review screens.',
  longDescription:
    'Additional SoftUni Partner service request for boarding and relocation. It stays pending to keep the admin Partner Applications queue visibly testable.',
  country: 'Bulgaria',
  city: 'Sofia',
  websiteUrl: 'https://example.com/softuni-partner-expansion',
  logoUrl: '/demo/step113/softuni-partner-cover.svg',
  coverImageUrl: '/demo/step113/softuni-partner-cover.svg',
  message:
    'Demo message: please review this additional partner service so the admin approval/refusal interface has realistic data.',
  contactEmail: 'softuni.partner@usg.local',
  contactPhone: '+359 700 113 222',
  status: 'pending_review',
};

const ecosystemListings = [
  {
    id: '33333333-3333-4333-8333-333333333801',
    ownerProfileId: identities.partner.profileId,
    listingType: 'partner_service',
    submissionChannel: 'official_listing',
    title: 'SoftUni Partner — Cane Corso training & transport',
    slug: 'softuni-partner-cane-corso-training-transport',
    category: 'training_transport_owner_support',
    shortDescription: 'Published partner-service demo listing connected to SoftUni Partner.',
    longDescription:
      'Official demo listing for service directory cards, public detail page, contact visibility, featured state and admin moderation history.',
    country: 'Bulgaria',
    city: 'Sofia',
    websiteUrl: 'https://example.com/softuni-partner',
    phone: '+359 700 113 222',
    email: 'softuni.partner@usg.local',
    coverageNote: 'Bulgaria, Balkans and EU transport planning — demo only.',
    rulesNote: 'Large-breed handling, calm travel preparation and owner confirmation required — demo policy.',
    logoUrl: '/demo/step113/softuni-partner-cover.svg',
    coverImageUrl: '/demo/step113/softuni-partner-cover.svg',
    googlePlaceId: 'softuni-demo-place-id-113',
    googlePlaceName: 'SoftUni Partner Demo Office',
    googleFormattedAddress: 'Sofia, Bulgaria — demo address',
    googleMapsUrl: 'https://maps.google.com/?q=SoftUni+Partner+Demo+Office',
    latitude: '42.6977',
    longitude: '23.3219',
    status: 'published',
    isFeatured: true,
    reviewNote: 'Published official partner-service demo listing for Step 113.',
  },
  {
    id: '33333333-3333-4333-8333-333333333802',
    ownerProfileId: identities.member.profileId,
    listingType: 'breeding_match',
    submissionChannel: 'community_listing',
    title: 'Ares SoftUni demo — controlled match request',
    slug: 'ares-softuni-demo-controlled-match-request',
    category: 'admin_mediated_match',
    shortDescription: 'Demo breeding/match listing with admin-mediated contact protection.',
    longDescription:
      'This listing checks that sensitive matching requests do not expose direct public contact and are routed through admin review and match requests.',
    country: 'Bulgaria',
    city: 'Kardzhali',
    websiteUrl: null,
    phone: null,
    email: null,
    coverageNote: 'Admin-mediated connection only. Demo data; no real breeding offer.',
    rulesNote: 'USG must review owner intent, health evidence and suitability before any connection.',
    logoUrl: '/demo/step113/softuni-demo-cane-primary.svg',
    coverImageUrl: '/demo/step113/softuni-community-cover.svg',
    status: 'published',
    isFeatured: false,
    reviewNote: 'Published to test admin-mediated sensitive listing behavior.',
  },
  {
    id: '33333333-3333-4333-8333-333333333803',
    ownerProfileId: identities.member.profileId,
    listingType: 'pet_friendly_place',
    submissionChannel: 'community_listing',
    title: 'SoftUni demo Cane Corso-friendly terrace',
    slug: 'softuni-demo-cane-corso-friendly-terrace',
    category: 'pet_friendly_place',
    shortDescription: 'Demo public place where rules for large Cane Corso visitors are clearly visible.',
    longDescription:
      'Checks the pet-friendly place card, location copy, rules note, Google Maps fields and public detail page layout.',
    country: 'Bulgaria',
    city: 'Plovdiv',
    websiteUrl: 'https://example.com/softuni-demo-terrace',
    phone: '+359 700 113 333',
    email: 'terrace.demo@usg.local',
    coverageNote: 'Outdoor terrace, calm hours preferred, call before visiting with a large Cane Corso.',
    rulesNote: 'Leash required, muzzle according to local rules, owner responsible for space and behavior.',
    logoUrl: '/demo/step113/softuni-community-cover.svg',
    coverImageUrl: '/demo/step113/softuni-community-cover.svg',
    googlePlaceId: 'softuni-demo-terrace-place-id-113',
    googlePlaceName: 'SoftUni Demo Cane Corso Terrace',
    googleFormattedAddress: 'Plovdiv, Bulgaria — demo address',
    googleMapsUrl: 'https://maps.google.com/?q=SoftUni+Demo+Cane+Corso+Terrace',
    latitude: '42.1354',
    longitude: '24.7453',
    status: 'published',
    isFeatured: false,
    reviewNote: 'Published to test friendly-place and Google Maps UI fields.',
  },
  {
    id: '33333333-3333-4333-8333-333333333804',
    ownerProfileId: identities.member.profileId,
    listingType: 'lost_found',
    submissionChannel: 'community_listing',
    title: 'SoftUni demo lost/found alert — resolved example',
    slug: 'softuni-demo-lost-found-alert-resolved-example',
    category: 'lost_found_demo',
    shortDescription: 'Demo urgent community listing to verify lost/found visibility and admin moderation wording.',
    longDescription:
      'No real animal is missing. This entry exists only to test how urgent community data appears in the public ecosystem and admin moderation screens.',
    country: 'Bulgaria',
    city: 'Kardzhali',
    websiteUrl: null,
    phone: null,
    email: null,
    coverageNote: 'Demo alert radius: Kardzhali city area.',
    rulesNote: 'Admin-mediated contact only. Do not publish private personal contact by default.',
    logoUrl: '/demo/step113/softuni-community-cover.svg',
    coverImageUrl: '/demo/step113/softuni-community-cover.svg',
    status: 'pending_review',
    isFeatured: false,
    reviewNote: 'Pending on purpose so admin moderation queue has sensitive-listing data.',
  },
];

const ecosystemReviews = [
  ['33333333-3333-4333-8333-333333333851', ecosystemListings[0].id, 'approve', 'SoftUni Partner official service approved for Step 113 demo.'],
  ['33333333-3333-4333-8333-333333333852', ecosystemListings[0].id, 'publish', 'SoftUni Partner official service published for public directory testing.'],
  ['33333333-3333-4333-8333-333333333853', ecosystemListings[1].id, 'publish', 'Sensitive match listing published with admin-mediated contact protection.'],
  ['33333333-3333-4333-8333-333333333854', ecosystemListings[2].id, 'publish', 'Friendly place listing published with Google Maps demo fields.'],
  ['33333333-3333-4333-8333-333333333855', ecosystemListings[3].id, 'pending_review', 'Lost/found demo intentionally left pending for admin queue visibility.'],
];

const matchRequests = [
  {
    id: '33333333-3333-4333-8333-333333333861',
    listingId: ecosystemListings[1].id,
    requesterProfileId: identities.partner.profileId,
    message:
      'Demo match request: SoftUni Partner asks admin to review whether the owner connection should be allowed. No public direct contact should be exposed.',
    contactPreference: 'email',
    phone: '+359 700 113 222',
    email: 'softuni.partner@usg.local',
    status: 'pending_review',
    adminNote: 'Seeded pending request for admin-mediated matching tests.',
  },
];

function normalizeFlag(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : undefined;
}

function getDatabaseUrl() {
  const value = process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL;
  if (!value) {
    throw new Error('DATABASE_URL is required for demo:seed:softuni. Add it to .env or .env.local before running the seed.');
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
  return new Pool({
    connectionString: databaseUrl,
    ...(shouldUseSsl(databaseUrl) ? { ssl: { rejectUnauthorized: false } } : {}),
  });
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

function verifyPassword(password, storedValue) {
  const [salt, storedHash] = storedValue.split(':');
  if (!salt || !storedHash) return false;
  const candidateHash = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(storedHash, 'hex');
  if (candidateHash.length !== storedBuffer.length) return false;
  return timingSafeEqual(candidateHash, storedBuffer);
}

async function seedLocalCredentials(client, userId, password) {
  const existing = await client.query(
    `SELECT password_hash FROM auth_local_credentials WHERE user_id = $1 LIMIT 1`,
    [userId],
  );
  const currentHash = existing.rows[0]?.password_hash;
  if (currentHash && verifyPassword(password, currentHash)) return;

  await client.query(
    `INSERT INTO auth_local_credentials (user_id, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       updated_at = now()`,
    [userId, hashPassword(password)],
  );
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
    [identity.userId, identity.authSubject, identity.email],
  );

  await client.query(
    `INSERT INTO profiles (
       id, user_id, role, display_name, first_name, middle_name, last_name, avatar_url, phone,
       country, city, address_line, website_url, bio, locale, is_active
     )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,true)
     ON CONFLICT (id) DO UPDATE SET
       user_id = EXCLUDED.user_id,
       role = EXCLUDED.role,
       display_name = EXCLUDED.display_name,
       first_name = EXCLUDED.first_name,
       middle_name = EXCLUDED.middle_name,
       last_name = EXCLUDED.last_name,
       avatar_url = EXCLUDED.avatar_url,
       phone = EXCLUDED.phone,
       country = EXCLUDED.country,
       city = EXCLUDED.city,
       address_line = EXCLUDED.address_line,
       website_url = EXCLUDED.website_url,
       bio = EXCLUDED.bio,
       locale = EXCLUDED.locale,
       is_active = true,
       updated_at = now()`,
    [
      identity.profileId,
      identity.userId,
      identity.role,
      identity.displayName,
      identity.firstName,
      identity.middleName,
      identity.lastName,
      identity.avatarUrl,
      identity.phone,
      identity.country,
      identity.city,
      identity.addressLine,
      identity.websiteUrl,
      identity.bio,
      identity.locale,
    ],
  );

  await seedLocalCredentials(client, identity.userId, password);
}

async function seedDog(client) {
  await client.query(
    `INSERT INTO dogs (
       id, owner_profile_id, name, slug, sex, date_of_birth, color, microchip_number, pedigree_number,
       short_description, long_description, city, country, bloodline_note, registry_class, pedigree_json,
       main_image_url, visibility, lifecycle_status
     )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb,$17,$18,$19)
     ON CONFLICT (id) DO UPDATE SET
       owner_profile_id = EXCLUDED.owner_profile_id,
       name = EXCLUDED.name,
       slug = EXCLUDED.slug,
       sex = EXCLUDED.sex,
       date_of_birth = EXCLUDED.date_of_birth,
       color = EXCLUDED.color,
       microchip_number = EXCLUDED.microchip_number,
       pedigree_number = EXCLUDED.pedigree_number,
       short_description = EXCLUDED.short_description,
       long_description = EXCLUDED.long_description,
       city = EXCLUDED.city,
       country = EXCLUDED.country,
       bloodline_note = EXCLUDED.bloodline_note,
       registry_class = EXCLUDED.registry_class,
       pedigree_json = EXCLUDED.pedigree_json,
       main_image_url = EXCLUDED.main_image_url,
       visibility = EXCLUDED.visibility,
       lifecycle_status = EXCLUDED.lifecycle_status,
       updated_at = now()`,
    [
      dog.id,
      dog.ownerProfileId,
      dog.name,
      dog.slug,
      dog.sex,
      dog.dateOfBirth,
      dog.color,
      dog.microchipNumber,
      dog.pedigreeNumber,
      dog.shortDescription,
      dog.longDescription,
      dog.city,
      dog.country,
      dog.bloodlineNote,
      dog.registryClass,
      JSON.stringify(dog.pedigreeJson),
      dog.mainImageUrl,
      dog.visibility,
      dog.lifecycleStatus,
    ],
  );

  for (const item of media) {
    await client.query(
      `INSERT INTO dog_media (
         id, dog_id, storage_key, public_url, mime_type, size_bytes, media_type, alt_text, sort_order,
         is_primary, visible_in_registry, visible_in_usg_gallery, uploaded_by_profile_id
       )
       VALUES ($1,$2,$3,$4,'image/svg+xml',0,'image',$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO UPDATE SET
         storage_key = EXCLUDED.storage_key,
         public_url = EXCLUDED.public_url,
         mime_type = EXCLUDED.mime_type,
         alt_text = EXCLUDED.alt_text,
         sort_order = EXCLUDED.sort_order,
         is_primary = EXCLUDED.is_primary,
         visible_in_registry = EXCLUDED.visible_in_registry,
         visible_in_usg_gallery = EXCLUDED.visible_in_usg_gallery,
         uploaded_by_profile_id = EXCLUDED.uploaded_by_profile_id`,
      [
        item.id,
        dog.id,
        item.storageKey,
        item.publicUrl,
        item.altText,
        item.sortOrder,
        item.isPrimary,
        item.visibleInRegistry,
        item.visibleInUsgGallery,
        identities.member.profileId,
      ],
    );
  }
}

async function seedMeasurementArchive(client) {
  for (const item of measurements) {
    await client.query(
      `INSERT INTO dog_measurement_records (
         id, dog_id, recorded_by_profile_id, measured_at, age_months, weight_kg, height_withers_cm,
         body_length_cm, chest_circumference_cm, head_length_cm, muzzle_length_cm, skull_length_cm, note
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (id) DO UPDATE SET
         measured_at = EXCLUDED.measured_at,
         age_months = EXCLUDED.age_months,
         weight_kg = EXCLUDED.weight_kg,
         height_withers_cm = EXCLUDED.height_withers_cm,
         body_length_cm = EXCLUDED.body_length_cm,
         chest_circumference_cm = EXCLUDED.chest_circumference_cm,
         head_length_cm = EXCLUDED.head_length_cm,
         muzzle_length_cm = EXCLUDED.muzzle_length_cm,
         skull_length_cm = EXCLUDED.skull_length_cm,
         note = EXCLUDED.note,
         updated_at = now()`,
      [item[0], dog.id, identities.member.profileId, item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10]],
    );
  }
}

async function seedHealthArchive(client) {
  for (const item of healthRecords) {
    await client.query(
      `INSERT INTO dog_health_records (
         id, dog_id, recorded_by_profile_id, category, title, performed_at, next_due_at,
         veterinarian, clinic, batch_number, document_url, note
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (id) DO UPDATE SET
         category = EXCLUDED.category,
         title = EXCLUDED.title,
         performed_at = EXCLUDED.performed_at,
         next_due_at = EXCLUDED.next_due_at,
         veterinarian = EXCLUDED.veterinarian,
         clinic = EXCLUDED.clinic,
         batch_number = EXCLUDED.batch_number,
         document_url = EXCLUDED.document_url,
         note = EXCLUDED.note,
         updated_at = now()`,
      [item[0], dog.id, identities.member.profileId, item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9]],
    );
  }
}

async function seedRegistryAndCertificate(client) {
  await client.query(
    `INSERT INTO dog_submissions (id, dog_id, submitted_by_profile_id, status, submitted_at, last_reviewed_at, current_review_note, published_at)
     VALUES ($1,$2,$3,$4,now(),now(),$5,now())
     ON CONFLICT (id) DO UPDATE SET
       status = EXCLUDED.status,
       last_reviewed_at = now(),
       current_review_note = EXCLUDED.current_review_note,
       published_at = now()`,
    [submission.id, dog.id, identities.member.profileId, submission.status, submission.currentReviewNote],
  );

  await client.query(
    `INSERT INTO submission_reviews (id, submission_id, reviewer_profile_id, decision, note)
     VALUES ($1,$2,$3,'approve',$4)
     ON CONFLICT (id) DO UPDATE SET
       reviewer_profile_id = EXCLUDED.reviewer_profile_id,
       decision = EXCLUDED.decision,
       note = EXCLUDED.note,
       created_at = now()`,
    ['33333333-3333-4333-8333-333333333602', submission.id, identities.admin.profileId, 'SoftUni admin approved the demo profile for Registry testing.'],
  );

  await client.query(
    `INSERT INTO dog_admin_assessments (
       id, dog_id, reviewer_profile_id, registry_decision, certificate_decision, breed_type_score,
       temperament_score, pedigree_score, health_score, presentation_score, overall_score, public_note, private_note
     )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     ON CONFLICT (dog_id) DO UPDATE SET
       reviewer_profile_id = EXCLUDED.reviewer_profile_id,
       registry_decision = EXCLUDED.registry_decision,
       certificate_decision = EXCLUDED.certificate_decision,
       breed_type_score = EXCLUDED.breed_type_score,
       temperament_score = EXCLUDED.temperament_score,
       pedigree_score = EXCLUDED.pedigree_score,
       health_score = EXCLUDED.health_score,
       presentation_score = EXCLUDED.presentation_score,
       overall_score = EXCLUDED.overall_score,
       public_note = EXCLUDED.public_note,
       private_note = EXCLUDED.private_note,
       updated_at = now()`,
    [
      assessment.id,
      dog.id,
      identities.admin.profileId,
      assessment.registryDecision,
      assessment.certificateDecision,
      assessment.breedTypeScore,
      assessment.temperamentScore,
      assessment.pedigreeScore,
      assessment.healthScore,
      assessment.presentationScore,
      assessment.overallScore,
      assessment.publicNote,
      assessment.privateNote,
    ],
  );

  await client.query(
    `INSERT INTO registry_entries (id, dog_id, public_slug, title, summary, hero_image_url, published_at, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,now(),true)
     ON CONFLICT (dog_id) DO UPDATE SET
       public_slug = EXCLUDED.public_slug,
       title = EXCLUDED.title,
       summary = EXCLUDED.summary,
       hero_image_url = EXCLUDED.hero_image_url,
       published_at = COALESCE(registry_entries.published_at, now()),
       is_active = true`,
    [registryEntry.id, dog.id, registryEntry.publicSlug, registryEntry.title, registryEntry.summary, registryEntry.heroImageUrl],
  );

  await client.query(
    `INSERT INTO certificates (
       id, dog_id, certificate_code, issue_date, status, verification_slug, certificate_image_url,
       snapshot_json, issued_by_profile_id
     )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9)
     ON CONFLICT (certificate_code) DO UPDATE SET
       dog_id = EXCLUDED.dog_id,
       issue_date = EXCLUDED.issue_date,
       status = EXCLUDED.status,
       verification_slug = EXCLUDED.verification_slug,
       certificate_image_url = EXCLUDED.certificate_image_url,
       snapshot_json = EXCLUDED.snapshot_json,
       issued_by_profile_id = EXCLUDED.issued_by_profile_id`,
    [
      certificate.id,
      dog.id,
      certificate.certificateCode,
      certificate.issueDate,
      certificate.status,
      certificate.verificationSlug,
      certificate.certificateImageUrl,
      JSON.stringify(certificate.snapshotJson),
      identities.admin.profileId,
    ],
  );

  const ratings = [
    ['33333333-3333-4333-8333-333333333641', identities.partner.profileId, 5],
    ['33333333-3333-4333-8333-333333333642', identities.admin.profileId, 5],
  ];
  for (const [id, voterProfileId, rating] of ratings) {
    await client.query(
      `INSERT INTO registry_entry_ratings (id, registry_entry_id, voter_profile_id, rating)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (registry_entry_id, voter_profile_id) DO UPDATE SET
         rating = EXCLUDED.rating,
         updated_at = now()`,
      [id, registryEntry.id, voterProfileId, rating],
    );
  }
}

async function seedPartner(client) {
  await client.query(
    `INSERT INTO partners (
       id, owner_profile_id, business_name, slug, category, short_description, long_description,
       country, city, website_url, phone, email, logo_url, cover_image_url, status, is_featured, published_at
     )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,now())
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
       published_at = COALESCE(partners.published_at, now()),
       updated_at = now()`,
    [
      partner.id,
      partner.ownerProfileId,
      partner.businessName,
      partner.slug,
      partner.category,
      partner.shortDescription,
      partner.longDescription,
      partner.country,
      partner.city,
      partner.websiteUrl,
      partner.phone,
      partner.email,
      partner.logoUrl,
      partner.coverImageUrl,
      partner.status,
      partner.isFeatured,
    ],
  );

  await client.query(
    `INSERT INTO partner_applications (
       id, applicant_profile_id, business_name, category, short_description, long_description,
       country, city, website_url, logo_url, cover_image_url, message, contact_email, contact_phone, status
     )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
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
       review_note = null`,
    [
      partnerApplication.id,
      partnerApplication.applicantProfileId,
      partnerApplication.businessName,
      partnerApplication.category,
      partnerApplication.shortDescription,
      partnerApplication.longDescription,
      partnerApplication.country,
      partnerApplication.city,
      partnerApplication.websiteUrl,
      partnerApplication.logoUrl,
      partnerApplication.coverImageUrl,
      partnerApplication.message,
      partnerApplication.contactEmail,
      partnerApplication.contactPhone,
      partnerApplication.status,
    ],
  );

  const ratings = [
    ['33333333-3333-4333-8333-333333333721', identities.member.profileId, 5],
    ['33333333-3333-4333-8333-333333333722', identities.admin.profileId, 4],
  ];
  for (const [id, voterProfileId, rating] of ratings) {
    await client.query(
      `INSERT INTO partner_ratings (id, partner_id, voter_profile_id, rating)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (partner_id, voter_profile_id) DO UPDATE SET
         rating = EXCLUDED.rating,
         updated_at = now()`,
      [id, partner.id, voterProfileId, rating],
    );
  }
}

async function seedEcosystem(client) {
  for (const listing of ecosystemListings) {
    await client.query(
      `INSERT INTO ecosystem_listings (
         id, owner_profile_id, listing_type, submission_channel, title, slug, category,
         short_description, long_description, country, city, website_url, phone, email,
         coverage_note, rules_note, logo_url, cover_image_url, google_place_id, google_place_name,
         google_formatted_address, google_maps_url, latitude, longitude, status, is_featured,
         submitted_at, reviewed_at, published_at, review_note
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,now(),now(),CASE WHEN $25 = 'published' THEN now() ELSE null END,$27)
       ON CONFLICT (id) DO UPDATE SET
         owner_profile_id = EXCLUDED.owner_profile_id,
         listing_type = EXCLUDED.listing_type,
         submission_channel = EXCLUDED.submission_channel,
         title = EXCLUDED.title,
         slug = EXCLUDED.slug,
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
         google_place_id = EXCLUDED.google_place_id,
         google_place_name = EXCLUDED.google_place_name,
         google_formatted_address = EXCLUDED.google_formatted_address,
         google_maps_url = EXCLUDED.google_maps_url,
         latitude = EXCLUDED.latitude,
         longitude = EXCLUDED.longitude,
         status = EXCLUDED.status,
         is_featured = EXCLUDED.is_featured,
         reviewed_at = now(),
         published_at = CASE WHEN EXCLUDED.status = 'published' THEN COALESCE(ecosystem_listings.published_at, now()) ELSE null END,
         review_note = EXCLUDED.review_note,
         updated_at = now()`,
      [
        listing.id,
        listing.ownerProfileId,
        listing.listingType,
        listing.submissionChannel,
        listing.title,
        listing.slug,
        listing.category,
        listing.shortDescription,
        listing.longDescription,
        listing.country,
        listing.city,
        listing.websiteUrl,
        listing.phone,
        listing.email,
        listing.coverageNote,
        listing.rulesNote,
        listing.logoUrl,
        listing.coverImageUrl,
        listing.googlePlaceId ?? null,
        listing.googlePlaceName ?? null,
        listing.googleFormattedAddress ?? null,
        listing.googleMapsUrl ?? null,
        listing.latitude ?? null,
        listing.longitude ?? null,
        listing.status,
        listing.isFeatured,
        listing.reviewNote,
      ],
    );
  }

  for (const [id, listingId, decision, note] of ecosystemReviews) {
    await client.query(
      `INSERT INTO ecosystem_reviews (id, listing_id, reviewer_profile_id, decision, note)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET
         listing_id = EXCLUDED.listing_id,
         reviewer_profile_id = EXCLUDED.reviewer_profile_id,
         decision = EXCLUDED.decision,
         note = EXCLUDED.note,
         created_at = now()`,
      [id, listingId, identities.admin.profileId, decision, note],
    );
  }

  for (const request of matchRequests) {
    await client.query(
      `INSERT INTO ecosystem_match_requests (
         id, listing_id, requester_profile_id, message, contact_preference, phone, email, status, admin_note
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO UPDATE SET
         listing_id = EXCLUDED.listing_id,
         requester_profile_id = EXCLUDED.requester_profile_id,
         message = EXCLUDED.message,
         contact_preference = EXCLUDED.contact_preference,
         phone = EXCLUDED.phone,
         email = EXCLUDED.email,
         status = EXCLUDED.status,
         admin_note = EXCLUDED.admin_note,
         updated_at = now()`,
      [
        request.id,
        request.listingId,
        request.requesterProfileId,
        request.message,
        request.contactPreference,
        request.phone,
        request.email,
        request.status,
        request.adminNote,
      ],
    );
  }
}

async function main() {
  const pool = createPool(getDatabaseUrl());
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await seedIdentity(client, identities.member, credentials.memberPassword);
    await seedIdentity(client, identities.partner, credentials.partnerPassword);
    await seedIdentity(client, identities.admin, credentials.adminPassword);
    await seedDog(client);
    await seedMeasurementArchive(client);
    await seedHealthArchive(client);
    await seedRegistryAndCertificate(client);
    await seedPartner(client);
    await seedEcosystem(client);

    await client.query('COMMIT');

    console.log('Step 113 SoftUni demo data pack seeded successfully.');
    console.log(`Member:  ${identities.member.email} / ${credentials.memberPassword} / ${identities.member.displayName}`);
    console.log(`Partner: ${identities.partner.email} / ${credentials.partnerPassword} / ${identities.partner.displayName}`);
    console.log(`Admin:   ${identities.admin.email} / ${credentials.adminPassword} / ${identities.admin.displayName}`);
    console.log('Public checks: /registry/ares-softuni-demo, /verify/USG-SOFTUNI-DEMO-113, /partners/softuni-partner, /community/softuni-partner-cane-corso-training-transport');
    console.log('Member checks: /member, /my-dogs, /my-dogs/ares-softuni-demo/edit, health/growth tracker, FCI tools.');
    console.log('Admin checks: /review, /admin/registry, /admin/partners, /admin/ecosystem.');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('demo:seed:softuni failed.');
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
