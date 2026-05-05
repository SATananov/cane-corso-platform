import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from './shared';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  authProvider: text('auth_provider').notNull(),
  authSubject: text('auth_subject').notNull().unique(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  ...timestamps(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  role: text('role').notNull().default('member'),
  displayName: text('display_name').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  avatarUrl: text('avatar_url'),
  phone: text('phone'),
  country: text('country'),
  city: text('city'),
  bio: text('bio'),
  locale: text('locale').default('en'),
  isActive: boolean('is_active').notNull().default(true),
  ...timestamps(),
});
