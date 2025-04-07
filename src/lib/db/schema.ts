import { integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';

export const mock = pgTable('mock', {
  id: text('id').primaryKey().$defaultFn(uuidv7),
  data: jsonb('data').notNull(),
  mockInterfaces: text('mockInterfaces').notNull(),
  mockInterface: text('mockInterface').notNull(),
  mockSize: integer('mockSize').notNull(),
  throttling: integer('throttling'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});
