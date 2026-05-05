import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { profiles } from './users';

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  actorProfileId: uuid('actor_profile_id').references(() => profiles.id, {
    onDelete: 'set null',
  }),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  action: text('action').notNull(),
  metadataJson: jsonb('metadata_json').$type<Record<string, unknown> | null>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
