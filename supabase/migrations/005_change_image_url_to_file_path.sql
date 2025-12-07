-- Lägg till file_path kolumn för att spara relativ path istället för full URL
-- Detta gör att vi kan generera signed URLs dynamiskt för privata buckets

ALTER TABLE public.receipts
ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Om det finns gammal data med image_url, försök extrahera path
-- (Detta är en best-effort migration för befintlig data)
UPDATE public.receipts
SET file_path = CASE
  WHEN image_url LIKE '%/receipts/%' THEN
    REGEXP_REPLACE(image_url, '^.*/receipts/', '')
  ELSE
    NULL
END
WHERE file_path IS NULL AND image_url IS NOT NULL;

-- Kommentar
COMMENT ON COLUMN public.receipts.file_path IS 'Relativ sökväg till filen i Storage bucket "receipts" (t.ex. user-id/filename.jpg)';
