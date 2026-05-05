import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { profiles } from './users';
import { timestamps } from './shared';

export const ecosystemListings = pgTable('ecosystem_listings', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerProfileId: uuid('owner_profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'restrict' }),
  listingType: text('listing_type').notNull(),
  submissionChannel: text('submission_channel').notNull().default('community_listing'),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category'),
  shortDescription: text('short_description'),
  longDescription: text('long_description'),
  country: text('country'),
  city: text('city'),
  websiteUrl: text('website_url'),
  phone: text('phone'),
  email: text('email'),
  coverageNote: text('coverage_note'),
  rulesNote: text('rules_note'),
  logoUrl: text('logo_url'),
  coverImageUrl: text('cover_image_url'),
  status: text('status').notNull().default('draft'),
  isFeatured: boolean('is_featured').notNull().default(false),
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  reviewNote: text('review_note'),
  ...timestamps(),
});

export const ecosystemReviews = pgTable('ecosystem_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  listingId: uuid('listing_id')
    .notNull()
    .references(() => ecosystemListings.id, { onDelete: 'cascade' }),
  reviewerProfileId: uuid('reviewer_profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'restrict' }),
  decision: text('decision').notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
