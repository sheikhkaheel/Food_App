import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";


export const foodSchema = pgTable('food', {
    id: uuid('id').primaryKey().defaultRandom(),
    img: varchar('img').notNull(),
    name: varchar('name', {length:255}).notNull()
})

export const orderSchema = pgTable('order', {
    id: uuid('id').primaryKey().defaultRandom(),
    foodId: uuid('food-id').references(()=> foodSchema.id).notNull(),
    amount: integer().notNull(),
    currency: varchar('currency', { length: 255}).notNull()
})

