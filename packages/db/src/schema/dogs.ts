import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  unique,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import type { CertificateSnapshot, DogPedigreeProfile } from '@cane-corso-platform/contracts';
import { profiles } from './users';
import { timestamps } from './shared';

export const dogs = pgTable('dogs', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerProfileId: uuid('owner_profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'restrict' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  sex: text('sex').notNull(),
  dateOfBirth: date('date_of_birth'),
  color: text('color'),
  microchipNumber: text('microchip_number').unique(),
  pedigreeNumber: text('pedigree_number'),
  shortDescription: text('short_description'),
  longDescription: text('long_description'),
  city: text('city'),
  country: text('country'),
  bloodlineNote: text('bloodline_note'),
  registryClass: text('registry_class').default('owner_declared_cane_corso'),
  pedigreeJson: jsonb('pedigree_json').$type<DogPedigreeProfile | null>().default({}),
  mainImageUrl: text('main_image_url'),
  visibility: text('visibility').notNull().default('private'),
  lifecycleStatus: text('lifecycle_status').notNull().default('draft'),
  ...timestamps(),
});

export const dogMedia = pgTable('dog_media', {
  id: uuid('id').defaultRandom().primaryKey(),
  dogId: uuid('dog_id')
    .notNull()
    .references(() => dogs.id, { onDelete: 'cascade' }),
  storageKey: text('storage_key').notNull(),
  publicUrl: text('public_url'),
  mimeType: text('mime_type'),
  sizeBytes: integer('size_bytes'),
  mediaType: text('media_type').notNull().default('image'),
  altText: text('alt_text'),
  sortOrder: integer('sort_order').notNull().default(0),
  isPrimary: boolean('is_primary').notNull().default(false),
  visibleInRegistry: boolean('visible_in_registry').notNull().default(true),
  visibleInUsgGallery: boolean('visible_in_usg_gallery').notNull().default(false),
  uploadedByProfileId: uuid('uploaded_by_profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const dogSubmissions = pgTable('dog_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  dogId: uuid('dog_id')
    .notNull()
    .references(() => dogs.id, { onDelete: 'cascade' }),
  submittedByProfileId: uuid('submitted_by_profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'restrict' }),
  status: text('status').notNull().default('submitted'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
  lastReviewedAt: timestamp('last_reviewed_at', { withTimezone: true }),
  currentReviewNote: text('current_review_note'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
});

export const submissionReviews = pgTable('submission_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id')
    .notNull()
    .references(() => dogSubmissions.id, { onDelete: 'cascade' }),
  reviewerProfileId: uuid('reviewer_profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'restrict' }),
  decision: text('decision').notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});


export const dogAdminAssessments = pgTable('dog_admin_assessments', {
  id: uuid('id').defaultRandom().primaryKey(),
  dogId: uuid('dog_id')
    .notNull()
    .references(() => dogs.id, { onDelete: 'cascade' })
    .unique(),
  reviewerProfileId: uuid('reviewer_profile_id').references(() => profiles.id, { onDelete: 'set null' }),
  registryDecision: text('registry_decision').notNull().default('not_reviewed'),
  certificateDecision: text('certificate_decision').notNull().default('not_reviewed'),
  breedTypeScore: integer('breed_type_score'),
  temperamentScore: integer('temperament_score'),
  pedigreeScore: integer('pedigree_score'),
  healthScore: integer('health_score'),
  presentationScore: integer('presentation_score'),
  overallScore: integer('overall_score'),
  publicNote: text('public_note'),
  privateNote: text('private_note'),
  ...timestamps(),
});

export const registryEntries = pgTable('registry_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  dogId: uuid('dog_id')
    .notNull()
    .references(() => dogs.id, { onDelete: 'cascade' })
    .unique(),
  publicSlug: text('public_slug').notNull().unique(),
  title: text('title').notNull(),
  summary: text('summary'),
  heroImageUrl: text('hero_image_url'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  isActive: boolean('is_active').notNull().default(true),
});

export const certificates = pgTable('certificates', {
  id: uuid('id').defaultRandom().primaryKey(),
  dogId: uuid('dog_id')
    .notNull()
    .references(() => dogs.id, { onDelete: 'cascade' }),
  certificateCode: text('certificate_code').notNull().unique(),
  issueDate: date('issue_date').notNull(),
  status: text('status').notNull().default('active'),
  verificationSlug: text('verification_slug').notNull().unique(),
  certificateImageUrl: text('certificate_image_url'),
  snapshotJson: jsonb('snapshot_json').$type<CertificateSnapshot | null>(),
  issuedByProfileId: uuid('issued_by_profile_id').references(() => profiles.id, { onDelete: 'set null' }),
  pdfStorageKey: text('pdf_storage_key'),
  pdfUrl: text('pdf_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const registryEntryRatings = pgTable(
  'registry_entry_ratings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    registryEntryId: uuid('registry_entry_id')
      .notNull()
      .references(() => registryEntries.id, { onDelete: 'cascade' }),
    voterProfileId: uuid('voter_profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    ...timestamps(),
  },
  (table) => ({
    uniqueVote: unique('registry_entry_ratings_unique_vote').on(table.registryEntryId, table.voterProfileId),
  }),
);
