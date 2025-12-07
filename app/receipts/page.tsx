import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import UploadForm from "./components/UploadForm";
import ReceiptsList from "./components/ReceiptsList";

export default async function ReceiptsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Kolla om användaren är admin
  const userIsAdmin = await isAdmin(user.id);

  // Hämta kvitton
  const { data: receipts, error } = await supabase
    .from("receipts")
    .select("id, created_at, raw_text, file_path")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">RÄTTPRIS</h1>
            <div className="flex items-center space-x-4">
              {userIsAdmin && (
                <a
                  href="/admin"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Admin-panel
                </a>
              )}
              <form action="/logout" method="post">
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Logga ut
                </button>
              </form>
            </div>
          </div>
          <p className="text-gray-600">Ladda upp kvitto</p>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-900">
            Fota eller ladda upp ditt kvitto och spara det här. I den här
            versionen lagrar vi bara bilden och kopplar den till ditt konto.
          </p>
        </div>

        {/* Upload form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Ladda upp nytt kvitto</h2>
          <UploadForm userId={user.id} />
        </div>

        {/* Receipts list – låt komponenten själv rita rubrik och box */}
        <ReceiptsList receipts={receipts} />

        {/* Privacy notice */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Integritet:</strong> RÄTTPRIS (testversion) lagrar dina
            kvitton kopplade till ditt konto i syfte att kunna analysera priser
            i framtiden. Vi sparar bara det du laddar upp här. Kontakta oss om
            du vill få dina kvitton raderade.
          </p>
        </div>
      </div>
    </div>
  );
}
