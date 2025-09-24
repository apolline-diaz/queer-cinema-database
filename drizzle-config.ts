import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url: process.env.POSTGRES_URL! },
  schema: './schema/schema.ts',
  out: './drizzle',
});
