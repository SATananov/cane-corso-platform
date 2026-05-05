import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to use drizzle-kit. For Neon, paste the Neon pooled or direct PostgreSQL URL into DATABASE_URL.');
}

export default defineConfig({
  out: './packages/db/drizzle',
  schema: './packages/db/src/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
