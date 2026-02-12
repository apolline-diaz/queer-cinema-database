'server-only';

import { z } from 'zod';

const schema = {
  BETTER_AUTH_SECRET: z.string().min(16).max(1024),
  BETTER_AUTH_URL: z.url(),
  DATABASE_URL: z.url(),
  MODE: z.enum(['development', 'production', 'preview', 'ci']).default('development'),
  RESEND_API_KEY: z.string(),
  STORAGE_ACCESS_KEY_ID: z.string(),
  STORAGE_BUCKET: z.string().default('default'),
  STORAGE_ENDPOINT: z.string(),
  STORAGE_REGION: z.string(),
  STORAGE_SECRET_ACCESS_KEY: z.string(),
  CRON_SECRET: z.string(),
};

const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;

const env = z.object(schema).parse({
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || BASE_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  MODE: process.env.MODE || process.env.NODE_ENV,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  STORAGE_ACCESS_KEY_ID: process.env.STORAGE_ACCESS_KEY_ID,
  STORAGE_BUCKET: process.env.STORAGE_BUCKET,
  STORAGE_ENDPOINT: process.env.STORAGE_ENDPOINT,
  STORAGE_REGION: process.env.STORAGE_REGION,
  STORAGE_SECRET_ACCESS_KEY: process.env.STORAGE_SECRET_ACCESS_KEY,
  CRON_SECRET: process.env.CRON_SECRET,
});

export { env };
