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
              <div className="flex items-center justify-between mb-2 gap-4">
                <p className="text-sm text-gray-500">{created}</p>

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

              {ocrText && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    OCR-text:
                  </p>
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {ocrText}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
