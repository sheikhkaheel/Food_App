"use client";

import { ChangeEvent, useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "../actions";
import { Loader2, UserPlus, ArrowRight } from "lucide-react";

export function AddUser() {
  const router = useRouter();
  const [name, setName] = useState("");

  const [error, action, isPending] = useActionState(async () => {
    try {
      if (!name.trim()) return "Please enter a valid name";

      const userId = await createUser(name);

      if (userId) {
        localStorage.setItem("user-id", userId);
        // Redirect back to the home page to see the specials
        router.push("/");
        return null;
      }
      return "Failed to create user";
    } catch (err) {
      return "Something went wrong. Please try again.";
    }
  }, null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <header className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4">
            <UserPlus className="text-indigo-500" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome to Premium Eats
          </h1>
          <p className="text-zinc-500">Enter your name to start ordering</p>
        </header>

        <form action={action} className="space-y-4">
          <div className="relative group">
            <input
              required
              className="w-full bg-[#141414] border border-zinc-800 text-white px-5 py-4 rounded-xl outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 placeholder:text-zinc-600"
              type="text"
              placeholder="Your Full Name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </div>

          <button
            disabled={isPending || !name.trim()}
            className={`
              w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300
              ${
                isPending || !name.trim()
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_20px_rgba(79,70,229,0.2)] active:scale-[0.98]"
              }
            `}
          >
            {isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Setting up...</span>
              </>
            ) : (
              <>
                <span>Get Started</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {error && (
            <p className="text-rose-500 text-sm text-center font-medium animate-pulse">
              {error}
            </p>
          )}
        </form>

        <p className="text-center text-zinc-600 text-xs uppercase tracking-widest">
          Secure Guest Checkout
        </p>
      </div>
    </div>
  );
}
