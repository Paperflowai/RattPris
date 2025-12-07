# RATTPRIS 0.1

En enkel Next.js-app för att spara och hantera kvitton med Supabase.

## Setup

### 1. Installera dependencies

```bash
npm install
```

### 2. Konfigurera Supabase

Skapa ett Supabase-projekt på [supabase.com](https://supabase.com)

Kör SQL-migrationerna i Supabase SQL Editor:
- `supabase/migrations/001_create_receipts.sql`
- `supabase/migrations/002_create_storage_bucket.sql`

### 3. Skapa .env.local

Kopiera `.env.example` till `.env.local`:

```bash
cp .env.example .env.local
```

Fyll i dina Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=din_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=din_supabase_anon_key
```

Du hittar dessa i Supabase Dashboard under:
**Project Settings** → **API**

### 4. Starta utvecklingsservern

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000)

## Funktioner i v0.1

- ✅ Användarregistrering och inloggning
- ✅ Ladda upp kvitton (foto eller fil)
- ✅ Visa lista med dina kvitton
- ✅ Säker fillagring i Supabase Storage
- ✅ Row Level Security (RLS) på alla data

## Vad som INTE ingår ännu

- ❌ OCR / texttolkning
- ❌ Automatisk tolkning av butik/datum/belopp
- ❌ Filter, sök, statistik
- ❌ Admin-panel
- ❌ Delning mellan användare

## Databas

### Tabell: receipts

- `id` - UUID (primary key)
- `user_id` - UUID (kopplad till auth.users)
- `image_url` - Text (länk till fil i Storage)
- `store_name` - Text (nullable)
- `receipt_date` - Date (nullable)
- `total_amount` - Numeric (nullable)
- `created_at` - Timestamp

### Storage: receipts bucket

Privat bucket där filer sparas per användare i mappen `{user_id}/`

## Integritet

RATTPRIS lagrar dina kvitton kopplade till ditt konto. Vi sparar bara det du laddar upp. Kontakta oss om du vill få dina kvitton raderade.
