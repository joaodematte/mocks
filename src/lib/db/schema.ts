import { integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';

export const mock = pgTable('mock', {
  id: text('id').primaryKey().$defaultFn(uuidv7),
  content: jsonb('content').notNull(),
  interfaces: text('interfaces').notNull(),
  targetInterface: text('targetInterface').notNull(),
  size: integer('size').notNull(),
  throttling: integer('throttling'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});
