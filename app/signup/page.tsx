"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setInfoMessage(null);
    setErrorMessage(null);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMessage(
        "Något gick fel när vi skulle skapa ditt konto. Försök igen."
      );
      setIsLoading(false);
      return;
    }

    // Kontot skapat framgångsrikt
    setInfoMessage(
      `Ditt konto är skapat! Vi har skickat ett bekräftelsemail till ${email}. Klicka på länken i mejlet för att aktivera kontot innan du loggar in.`
    );
    setEmail("");
    setPassword("");
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Skapa konto på RÄTTPRIS</h1>

        {/* Info-meddelande (grön) */}
        {infoMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-sm text-emerald-800">
            <p className="font-semibold mb-1">✓ Kontot är skapat!</p>
            <p>{infoMessage}</p>
          </div>
        )}

        {/* Felmeddelande (röd) */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            <p className="font-semibold mb-1">✗ Något gick fel</p>
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              E-post
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Lösenord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Minst 6 tecken</p>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Skapar konto..." : "Skapa konto"}
          </button>
        </form>

        <div className="mt-6 space-y-2">
          <p className="text-center text-sm text-gray-600">
            Har du redan ett konto?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Logga in här
            </Link>
          </p>
          <p className="text-center text-xs text-gray-500">
            Har du redan bekräftat ditt konto?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Gå till inloggningen
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
