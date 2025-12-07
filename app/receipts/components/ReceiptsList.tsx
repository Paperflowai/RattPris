// app/receipts/components/ReceiptsList.tsx

import { deleteReceipt } from "../actions";

type Receipt = {
  id: string;
  created_at: string | null;
  file_path: string | null;   // var bilden ligger i bucketen
  raw_text?: string | null;   // OCR-text från kvittot
  ocr_text?: string | null;   // ev. annan kolumn
};

type Props = {
  receipts: Receipt[] | null;
};

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("sv-SE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function ReceiptsList({ receipts }: Props) {
  // Om inga kvitton
  if (!receipts || receipts.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4">Dina kvitton</h2>
        <p className="text-gray-500 text-sm">
          Du har inga kvitton ännu. Ladda upp ditt första kvitto ovan!
        </p>
      </section>
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const baseUrl =
    typeof supabaseUrl === "string" && supabaseUrl.length > 0
      ? supabaseUrl.replace(/\/$/, "")
      : null;

  const buildImageUrl = (filePath: string | null) => {
    if (!baseUrl || !filePath) return null;
    return `${baseUrl}/storage/v1/object/public/receipts/${filePath}`;
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Dina kvitton</h2>

      <div className="space-y-4">
        {receipts.map((receipt) => {
          const imageUrl = buildImageUrl(receipt.file_path);
          const ocrText = receipt.raw_text ?? receipt.ocr_text ?? "";
          const created = formatDate(receipt.created_at);

          return (
            <article
              key={receipt.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3 gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">{created}</p>

                  {/* Grön bock när kvittot är sparat */}
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Kvitto sparat och skickat
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {imageUrl ? (
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      Visa kvitto
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Kunde inte ladda bilden
                    </span>
                  )}

                  {/* Radera-knapp */}
                  <form action={deleteReceipt}>
                    <input type="hidden" name="receiptId" value={receipt.id} />
                    <button
                      type="submit"
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Radera
                    </button>
                  </form>
                </div>
              </div>

              {/* Testfunktion: OCR */}
              {ocrText && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-900 mb-1">
                      Testfunktion: automatisk avläsning (OCR)
                    </p>
                    <p className="text-xs text-blue-700 mb-2">
                      Texten nedan är automatiskt avläst och kan innehålla fel.
                    </p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                      {ocrText}
                    </p>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
