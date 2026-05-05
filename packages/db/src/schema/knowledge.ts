import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { profiles } from './users';
import { timestamps } from './shared';

export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorProfileId: uuid('author_profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'restrict' }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImageUrl: text('cover_image_url'),
  status: text('status').notNull().default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  ...timestamps(),
});
