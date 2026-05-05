import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from './shared';
import { users } from './users';

export const authLocalCredentials = pgTable('auth_local_credentials', {
  userId: uuid('user_id')
    .notNull()
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  passwordHash: text('password_hash').notNull(),
  ...timestamps(),
});
