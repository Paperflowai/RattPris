-- Skapa storage bucket för kvitton
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Användare kan ladda upp sina egna filer
CREATE POLICY "Users can upload their own receipts"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Användare kan läsa sina egna filer
CREATE POLICY "Users can view their own receipts"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Användare kan uppdatera sina egna filer
CREATE POLICY "Users can update their own receipts"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Användare kan radera sina egna filer
CREATE POLICY "Users can delete their own receipts"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
