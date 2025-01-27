'use server'

import { foodSchema, orderSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "..";
import { NextResponse } from "next/server";

const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});


export async function getOrders(){
    try{
        const orders = await db
        .select().from(orderSchema)
        .leftJoin(foodSchema, eq(foodSchema.id, orderSchema.foodId))

        return orders
    } catch(err){
        throw new Error('Internal Server Error');
    }
}


export async function createOrder(data:{
    order: {
      id: string;
      foodId: string;
      amount: number;
      currency: string;
    };
    food: {
      id: string;
      name: string;
    } | null;
  }) {
    
    const orderOptions = {
      amount: Math.round(data.order.amount * 100), // Convert to paise or cent
      currency: data.order.currency,
      receipt: data.order.id,
      partial_payment: false,
      notes: {
        name: "kaheel",
        email: "sheikhkaheel@gmail.com"
      }
    };
  
    try {
      const order = await new Promise<any>((resolve, reject) => {
        instance.orders.create(orderOptions, (err: any, order: any) => {
          if (err) reject(err);
          else resolve(order);
        });
      });
  
      return {
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency
        }
      };
    } catch(err) {
      console.error(err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      };
    }
  }


export async function verification(res:NextResponse){
    console.log(res);
}