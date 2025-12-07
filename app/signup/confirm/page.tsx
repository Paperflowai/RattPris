import Link from "next/link";

export default function ConfirmPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email ? decodeURIComponent(searchParams.email) : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">
          Bekräfta din e-post
        </h1>

        <div className="space-y-4 text-sm text-gray-600">
          <p>
            Vi har skickat ett bekräftelsemail till:
          </p>
          {email && (
            <p className="font-semibold text-gray-900 text-center bg-gray-50 p-3 rounded">
              {email}
            </p>
          )}
          <p>
            Klicka på länken i e-postmeddelandet för att aktivera ditt konto.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-6">
            <p className="font-semibold text-blue-900 mb-2">📧 Vad händer nu?</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>Kolla din inkorg (och skräppostmapp)</li>
              <li>Klicka på bekräftelselänken i mejlet</li>
              <li>Logga in på RÄTTPRIS</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-4">
            <p className="text-yellow-800">
              <strong>OBS:</strong> Du kan inte logga in förrän du har bekräftat din e-postadress.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-4">
            Har du inte fått något email?
          </p>
          <ul className="text-xs text-gray-500 space-y-1 mb-4">
            <li>• Kolla skräppostmappen</li>
            <li>• Vänta några minuter och uppdatera inkorgen</li>
            <li>• Kontrollera att e-postadressen är rätt stavad</li>
          </ul>
          <Link
            href="/login"
            className="block text-center text-sm text-blue-600 hover:underline"
          >
            Gå till inloggning
          </Link>
        </div>
      </div>
    </div>
  );
}
