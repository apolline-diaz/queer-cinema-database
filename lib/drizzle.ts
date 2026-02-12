import { drizzle } from 'drizzle-orm/node-postgres';
import { schema } from '@plai/db';
import { env } from '../utils/env';

const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
  },
  schema,
});

export default db;
