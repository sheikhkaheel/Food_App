"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "../actions";
import { Loader2, ShoppingBag, CheckCircle2, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function OrderButton({
  food,
}: {
  food: {
    id: string;
    name: string;
    img: string;
    amount: number;
    currency: string;
  };
}) {
  const router = useRouter();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) return;

    const userId = localStorage.getItem("user-id");
    if (!userId) {
      router.push("/user");
      return;
    }

    setStatus("processing");
    setErrorMessage("");

    try {
      if (!food) throw new Error("Item unavailable");

      const data = await createOrder({ food, userId });

      if (!data.success) throw new Error(data.error || "Order creation failed");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order?.amount,
        currency: data.order?.currency,
        order_id: data.order?.id,
        name: "Premium Eats",
        description: `Ordering ${food?.name}`,
        image: food.img,
        handler: (response: any) => {
          setStatus("success");
          setTimeout(() => setStatus("idle"), 3000);
        },
        modal: {
          ondismiss: () => setStatus("idle"),
        },
        prefill: {
          name: "Guest User",
          email: "user@example.com",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Payment failed:", error);
      setStatus("error");
      setErrorMessage(error.message || "Something went wrong");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        disabled={
          status === "processing" || status === "success" || !razorpayLoaded
        }
        className={`
          relative w-full py-4 rounded-xl font-bold transition-all duration-300 
          flex items-center justify-center gap-2 overflow-hidden
          ${status === "idle" && "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-95"}
          ${status === "processing" && "bg-zinc-800 text-zinc-400 cursor-wait"}
          ${status === "success" && "bg-emerald-500 text-white"}
          ${status === "error" && "bg-rose-500 text-white"}
          ${!razorpayLoaded && "opacity-50 cursor-not-allowed"}
        `}
        onClick={handlePayment}
      >
        {status === "idle" && (
          <>
            <ShoppingBag size={18} />
            <span>Order Now</span>
          </>
        )}

        {status === "processing" && (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Processing...</span>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 size={18} />
            <span>Success</span>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle size={18} />
            <span>Failed</span>
          </>
        )}
      </button>

      {status === "error" && (
        <p className="text-rose-500 text-[10px] uppercase tracking-widest font-bold text-center">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
