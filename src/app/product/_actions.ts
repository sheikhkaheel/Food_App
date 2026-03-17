"use server";

import { foodSchema } from "@/db/schema";
import { db } from "@/index";

interface CreateProductInput {
  name: string;
  img: string;
  amount: number;
  currency: string;
}

export const createProduct = async (data: CreateProductInput) => {
  await db.insert(foodSchema).values({
    name: data.name,
    img: data.img,
    amount: data.amount,
    currency: data.currency,
  });

  return {
    success: true,
    message: "Product created successfully",
    name: data.name,
  };
};
