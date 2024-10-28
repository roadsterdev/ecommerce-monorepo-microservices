import { pgTable, integer, uuid, varchar } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').primaryKey(),
  name: varchar('name').notNull(),
  inventoryCount: integer('inventory_count').notNull(),
});
