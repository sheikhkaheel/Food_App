import { timestamp } from "drizzle-orm/pg-core";
import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import Razorpay from "razorpay";


export const userSchema = pgTable('user',{
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name',{length:255}).notNull()
})

export const foodSchema = pgTable('food', {
    id: uuid('id').primaryKey().defaultRandom(),
    img: varchar('img').notNull(),
    name: varchar('name', {length:255}).notNull(),
    amount: integer().notNull(),
    currency: varchar('currency', { length: 255}).notNull(),
})

export const orderSchema = pgTable('order', {
    id: uuid('id').primaryKey().defaultRandom(),
    foodId: uuid('food-id').references(()=> foodSchema.id).notNull(),
    userId: uuid('user-id').references(()=>userSchema.id).notNull(),
    razorpayOrderId: varchar('rayzorpay-order-id',{length:255}),
    razorpayPaymentId: varchar('rayzorpay-payment-id',{length:255}),
    paymentStatus: varchar('payment-status',{length:255}).notNull().default('pending'),
    createdAt: timestamp('created_at').defaultNow(), 
    updatedAt: timestamp('updated_at').defaultNow(),
})


