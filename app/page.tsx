import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">RÄTTPRIS</h1>
        <p className="text-gray-600 mb-8">Spara och hantera dina kvitton</p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Logga in
          </Link>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Skapa konto
          </Link>
        </div>
      </div>
    </div>
  );
}
