"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, PlusCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createProduct } from "./_actions";

const foodFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  img: z.string().url("Invalid image URL"),
  amount: z.coerce.number().min(1, "Price must be at least 1"),
  currency: z.string().min(1, "Currency is required"),
});

type FoodFormInput = z.input<typeof foodFormSchema>;
type FoodFormOutput = z.output<typeof foodFormSchema>;

export default function AddProductPage() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FoodFormInput, unknown, FoodFormOutput>({
    resolver: zodResolver(foodFormSchema),
    defaultValues: {
      name: "",
      img: "",
      amount: 0,
      currency: "INR",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      toast.success("Product added successfully", {
        description: ``,
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const imageUrl = watch("img");

  const onSubmit: SubmitHandler<FoodFormOutput> = (values) => {
    mutate(values);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="bg-[#111] p-8 rounded-3xl border border-zinc-800/50 shadow-2xl space-y-8">
            <header className="space-y-1 text-center">
              <FieldLegend className="text-3xl font-bold tracking-tight text-white italic">
                PREMIUM EATS
              </FieldLegend>
              <FieldDescription className="text-zinc-500 uppercase tracking-widest text-[10px]">
                Inventory Management / New Entry
              </FieldDescription>
            </header>

            <FieldGroup className="space-y-6">
              <Field>
                <FieldLabel htmlFor="name" className="text-zinc-400">
                  Dish Name
                </FieldLabel>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g. Signature Truffle Burger"
                  className="bg-zinc-900 border-zinc-800 focus:ring-1 focus:ring-white/20"
                />
                {errors.name && (
                  <FieldError className="text-rose-500 mt-1">
                    {errors.name.message}
                  </FieldError>
                )}
              </Field>

              <div className="grid grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="amount" className="text-zinc-400">
                    Price
                  </FieldLabel>
                  <Input
                    id="amount"
                    type="number"
                    {...register("amount")}
                    placeholder="0.00"
                    className="bg-zinc-900 border-zinc-800"
                  />
                  {errors.amount && (
                    <FieldError className="text-rose-500 mt-1">
                      {errors.amount.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="currency" className="text-zinc-400">
                    Currency
                  </FieldLabel>
                  <Input
                    id="currency"
                    {...register("currency")}
                    readOnly
                    className="bg-zinc-900 border-zinc-800 opacity-50 cursor-not-allowed"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="img" className="text-zinc-400">
                  Image URL
                </FieldLabel>
                <Input
                  id="img"
                  {...register("img")}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-zinc-900 border-zinc-800"
                />
                {errors.img && (
                  <FieldError className="text-rose-500 mt-1">
                    {errors.img.message}
                  </FieldError>
                )}
              </Field>

              {imageUrl && !errors.img && (
                <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="object-cover w-full h-full opacity-60 transition-opacity"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-zinc-500 uppercase tracking-[0.3em]">
                    Visual Preview
                  </div>
                </div>
              )}
            </FieldGroup>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full py-6 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <span className="flex items-center gap-2 uppercase tracking-tight">
                  <PlusCircle size={18} /> Add Dish to Menu
                </span>
              )}
            </Button>
          </FieldSet>
        </form>
      </div>
    </main>
  );
}
