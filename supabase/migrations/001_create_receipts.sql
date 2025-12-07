-- Skapa receipts-tabell
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  store_name TEXT,
  receipt_date DATE,
  total_amount NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aktivera Row Level Security
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- Policy: Användare kan bara se sina egna kvitton
CREATE POLICY "Users can view their own receipts"
  ON receipts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Användare kan bara skapa sina egna kvitton
CREATE POLICY "Users can insert their own receipts"
  ON receipts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Användare kan bara uppdatera sina egna kvitton
CREATE POLICY "Users can update their own receipts"
  ON receipts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Användare kan bara radera sina egna kvitton
CREATE POLICY "Users can delete their own receipts"
  ON receipts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index för snabbare queries
CREATE INDEX idx_receipts_user_id ON receipts(user_id);
CREATE INDEX idx_receipts_created_at ON receipts(created_at DESC);
