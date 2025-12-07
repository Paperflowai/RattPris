import { getUserWithRole } from "@/lib/get-user-with-role";
import Link from "next/link";

export default async function AdminPage() {
  const userWithRole = await getUserWithRole();

  // Ingen användare inloggad
  if (!userWithRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
          <h1 className="text-2xl font-bold mb-4">Åtkomst nekad</h1>
          <p className="text-gray-600 mb-6">
            Du måste vara inloggad för att komma åt admin.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Logga in
          </Link>
        </div>
      </div>
    );
  }

  // Användare inloggad men inte admin
  if (userWithRole.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold mb-4">Åtkomst nekad</h1>
          <p className="text-gray-600 mb-6">
            Endast administratörer har åtkomst till den här sidan.
          </p>
          <Link
            href="/receipts"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tillbaka till mina kvitton
          </Link>
        </div>
      </div>
    );
  }

  // Användare är admin - visa admin-panel
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Admin-panel</h1>
            <div className="space-x-4">
              <Link
                href="/receipts"
                className="text-sm text-blue-600 hover:underline"
              >
                Mina kvitton
              </Link>
              <form action="/logout" method="post" className="inline">
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Logga ut
                </button>
              </form>
            </div>
          </div>
          <p className="text-gray-600">
            Välkommen, {userWithRole.user.email}! Du har rollen:{" "}
            <span className="font-semibold text-green-600">
              {userWithRole.role}
            </span>
          </p>
        </div>

        {/* Admin content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Översikt</h2>
            <p className="text-gray-600">
              Här kan du hantera användare, kvitton och systemet.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Snabblänkar</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Hantera användare
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Visa alla kvitton
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Systeminställningar
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Info om hur man sätter admin-roll */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 Hur du sätter admin-roll:
          </h3>
          <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
            <li>Gå till Supabase Dashboard → Table Editor</li>
            <li>Välj tabellen "profiles"</li>
            <li>Hitta användaren du vill göra till admin</li>
            <li>
              Ändra fältet "role" från "user" till "admin"
            </li>
            <li>Spara</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
