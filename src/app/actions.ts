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
        const food = await db
        .select().from(foodSchema)

        return food ?? []
    } catch(err){
        throw new Error('Internal Server Error');
    }
}


export async function createOrder({food, userId}: {
  food: {
    id: string;
  name: string;
  img: string;
  amount: number;
  currency: string;
  },
  userId: string;
}) {
    
    const orderOptions = {
      amount: Math.round(food.amount * 100), // Convert to paise or cent
      currency: food.currency,
      receipt: food.id,
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

      console.log("Order",order)

      await db.insert(orderSchema).values({foodId:food?.id, userId: userId, razorpayOrderId: order.id });

  
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


// export async function POST(res:Response, req:Request){
//   const data = await req.json();
//   console.log("Verification Triggered", data);
//   return Response.json({ success: true });
// }