import type { Config } from 'drizzle-kit';

import 'dotenv/config';

export default {
  schema: './src/lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
} satisfies Config;
