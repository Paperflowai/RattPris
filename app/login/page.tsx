import { login } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
      {/* Bakgrundstexter - Grid layout */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-4 md:gap-12 p-4 md:p-12">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              <span className="text-lg md:text-2xl lg:text-3xl font-semibold text-white/10 select-none whitespace-nowrap">
                RÄTTPRIS
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Inloggningskort */}
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl relative z-10 mx-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Logga in på RÄTTPRIS
        </h1>

        {/* Felmeddelande */}
        {searchParams.error && (
          <div className="mb-4 p-3 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded text-sm text-red-800">
            <p className="font-semibold mb-1">Inloggning misslyckades</p>
            <p>{decodeURIComponent(searchParams.error)}</p>
            {searchParams.error.includes("Email not confirmed") && (
              <p className="mt-2 text-xs">
                💡 Glöm inte att bekräfta din e-post genom att klicka på länken i mejlet vi skickade!
              </p>
            )}
          </div>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              E-post
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Lösenord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Logga in
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Inget konto?{" "}
          <a href="/signup" className="text-purple-600 hover:underline font-medium">
            Skapa konto här
          </a>
        </p>
      </div>
    </div>
  );
}
