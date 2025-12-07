import { createClient } from "@/lib/supabase/server";

type User = {
  id: string;
  email: string;
  created_at: string;
  role: string;
};

type Receipt = {
  id: string;
  user_id: string;
  image_url: string;
  created_at: string;
  store_name: string | null;
};

export default async function AdminPanel() {
  const supabase = await createClient();

  // Hämta alla användare med deras roller
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, role")
    .order("created_at", { ascending: false });

  // Hämta user emails från auth (vi behöver använda admin API för detta i produktion)
  // För nu visar vi bara user_id
  const usersWithRoles = profiles || [];

  // Hämta alla kvitton (för statistik)
  const { data: allReceipts, count: totalReceipts } = await supabase
    .from("receipts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(10);

  // Räkna antal användare
  const totalUsers = usersWithRoles.length;
  const totalAdmins = usersWithRoles.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-6">
      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Totalt antal användare
          </h3>
          <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Antal administratörer
          </h3>
          <p className="text-3xl font-bold text-green-600">{totalAdmins}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Totalt antal kvitton
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {totalReceipts || 0}
          </p>
        </div>
      </div>

      {/* Senaste kvitton */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Senaste kvitton</h2>
        {allReceipts && allReceipts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Användare ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Datum
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Butik
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Åtgärd
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allReceipts.map((receipt: Receipt) => (
                  <tr key={receipt.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {receipt.user_id.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(receipt.created_at).toLocaleString("sv-SE")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {receipt.store_name || "–"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <a
                        href={receipt.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visa
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Inga kvitton ännu.</p>
        )}
      </div>

      {/* Användare med roller */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Användare och roller</h2>
        <div className="space-y-2">
          {usersWithRoles.map((user) => (
            <div
              key={user.user_id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded"
            >
              <span className="text-sm font-mono text-gray-700">
                {user.user_id.substring(0, 8)}...
              </span>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  user.role === "admin"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {user.role}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <p className="text-sm text-blue-900">
            <strong>Tips:</strong> För att göra en användare till admin, gå
            till Supabase Dashboard → Table Editor → profiles och ändra{" "}
            <code className="bg-blue-100 px-1 rounded">role</code> från "user"
            till "admin".
          </p>
        </div>
      </div>
    </div>
  );
}
