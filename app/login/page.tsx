// @ts-nocheck

import Link from "next/link";
import { login } from "./actions";

export default function LoginPage(props: any) {
  const searchParams = props?.searchParams || {};
  const errorMessage = searchParams.error as string | undefined;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Bakgrundstexter - grid med "RÄTTPRIS" */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="grid grid-cols-3 gap-8 h-full w-full px-8 py-12">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              <span className="text-2xl font-bold tracking-[0.3em] text-white">
                RÄTTPRIS
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Inloggningskort */}
      <div className="relative z-10 w-full max-w-md px  -4">
        <div className="bg-white/95 rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">
            Logga in på RÄTTPRIS
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Skriv in din e-post och ditt lösenord för att logga in.
          </p>

          {/* Felmeddelande */}
          {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              <p className="font-semibold mb-1">Inloggning misslyckades</p>
              <p className="mb-1">{decodeURIComponent(errorMessage)}</p>
              {errorMessage.includes("bekräfta din e-post") && (
                <p className="text-xs mt-1">
                  Glöm inte att bekräfta din e-post genom att klicka på länken i
                  mejlet vi skickade!
                </p>
              )}
            </div>
          )}

          {/* Formulär */}
          <form action={login} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-post
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lösenord
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 text-white py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Logga in
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-600 text-center">
            Inget konto?{" "}
            <Link
              href="/signup"
              className="text-indigo-600 hover:underline font-medium"
            >
              Skapa konto här
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
