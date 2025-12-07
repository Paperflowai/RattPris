-- Lägg till raw_text kolumn i receipts-tabellen för OCR-text
ALTER TABLE public.receipts
ADD COLUMN IF NOT EXISTS raw_text TEXT;

-- Kommentar på kolumnen
COMMENT ON COLUMN public.receipts.raw_text IS 'OCR-tolkad text från kvittot (Tesseract.js)';
