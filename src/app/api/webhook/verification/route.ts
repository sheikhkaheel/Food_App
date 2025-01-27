import { orderSchema } from "@/db/schema";
import { db } from "@/index";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    const data = await req.json();
    console.log("data",data);
    console.log("Entity", data.payload.payment.entity);    

    const event = data?.event!;

    if (event === 'payment.captured') {
        const { order_id, payment_id } = data.payload.payment.entity;
    
        // Update the order status in the database
        await db.update(orderSchema)
          .set({ paymentStatus: 'paid', razorpayPaymentId: payment_id })
          .where(eq(orderSchema.razorpayOrderId,order_id));
          return Response.json({ success: true });
    }
  }