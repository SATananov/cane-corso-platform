import { boolean, integer, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { profiles } from './users';
import { timestamps } from './shared';

export const partners = pgTable('partners', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerProfileId: uuid('owner_profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'restrict' }),
  businessName: text('business_name').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull(),
  shortDescription: text('short_description'),
  longDescription: text('long_description'),
  country: text('country'),
  city: text('city'),
  websiteUrl: text('website_url'),
  phone: text('phone'),
  email: text('email'),
  logoUrl: text('logo_url'),
  coverImageUrl: text('cover_image_url'),
  status: text('status').notNull().default('draft'),
  isFeatured: boolean('is_featured').notNull().default(false),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  ...timestamps(),
});

export const partnerApplications = pgTable('partner_applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  applicantProfileId: uuid('applicant_profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'restrict' }),
  businessName: text('business_name').notNull(),
  category: text('category').notNull(),
  shortDescription: text('short_description'),
  longDescription: text('long_description'),
  country: text('country'),
  city: text('city'),
  websiteUrl: text('website_url'),
  logoUrl: text('logo_url'),
  coverImageUrl: text('cover_image_url'),
  message: text('message'),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone'),
  status: text('status').notNull().default('pending_review'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  reviewNote: text('review_note'),
});

export const partnerRatings = pgTable(
  'partner_ratings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    partnerId: uuid('partner_id')
      .notNull()
      .references(() => partners.id, { onDelete: 'cascade' }),
    voterProfileId: uuid('voter_profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    ...timestamps(),
  },
  (table) => ({
    uniqueVote: unique('partner_ratings_unique_vote').on(table.partnerId, table.voterProfileId),
  }),
);
