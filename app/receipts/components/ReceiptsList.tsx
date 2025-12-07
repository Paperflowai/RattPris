// app/receipts/components/ReceiptsList.tsx

type Receipt = {
  id: string;
  created_at: string | null;
  // Någon av dessa (eller båda) kan finnas i databasen:
  image_url?: string | null; // full URL som ligger i kolumnen image_url
  file_path?: string | null; // relativ sökväg i bucketen, t.ex. "userId/filnamn.jpg"
  raw_text?: string | null;  // OCR-text från kvittot
  ocr_text?: string | null;  // ev. annan textkolumn
};

type Props = {
  receipts: Receipt[] | null;
};

// Läs in din SUPABASE-URL EN gång
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const baseUrl =
  typeof supabaseUrl === "string" && supabaseUrl.length > 0
    ? supabaseUrl.replace(/\/$/, "")
    : null;

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("sv-SE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

// Bygger en bild-URL på ett “tåligt” sätt
function buildImageUrl(imageUrl?: string | null, filePath?: string | null) {
  // 1) Om databasen redan har en färdig URL → använd den
  if (imageUrl && imageUrl.length > 0) return imageUrl;

  // 2) Annars, om vi har file_path → bygg en public-URL
  if (!baseUrl || !filePath) return null;
  return `${baseUrl}/storage/v1/object/public/receipts/${filePath}`;
}

export default function ReceiptsList({ receipts }: Props) {
  if (!receipts || receipts.length === 0) {
    return (
      <section className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Dina kvitton</h2>
        <p className="text-gray-500 text-sm">
          Du har inga kvitton ännu. Ladda upp ditt första kvitto ovan!
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Dina kvitton</h2>

      <div className="space-y-4">
        {receipts.map((receipt) => {
          const imageUrl = buildImageUrl(
            receipt.image_url,
            receipt.file_path
          );
          const ocrText = receipt.raw_text ?? receipt.ocr_text ?? "";
          const created = formatDate(receipt.created_at);

          return (
            <article
              key={receipt.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">{created}</p>

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
