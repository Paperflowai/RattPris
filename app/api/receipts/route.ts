import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  console.log("📥 API /api/receipts called");

  try {
    const supabase = await createClient();

    // Kolla auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("❌ Auth error:", authError);
      return NextResponse.json(
        { ok: false, error: "Användare inte inloggad" },
        { status: 401 }
      );
    }

    console.log("✓ User authenticated:", user.id);

    // Läs FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rawText = formData.get("rawText") as string | null;

    console.log("📄 File:", file?.name, file?.type, file?.size);
    console.log("📝 OCR text length:", rawText?.length || 0);

    if (!file) {
      console.error("❌ No file provided");
      return NextResponse.json(
        { ok: false, error: "Ingen fil vald" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error("❌ File too large:", file.size);
      return NextResponse.json(
        { ok: false, error: "Filen är för stor (max 10MB)" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      console.error("❌ Invalid file type:", file.type);
      return NextResponse.json(
        { ok: false, error: "Filtyp stöds inte" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    console.log("📦 Uploading to storage bucket 'receipts':", filePath);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ Upload error:", uploadError);
      return NextResponse.json(
        { ok: false, error: "Uppladdning misslyckades: " + uploadError.message },
        { status: 500 }
      );
    }

    console.log("✓ File uploaded to path:", uploadData.path);

    // Save receipt record to database with file_path (not URL)
    const { data: insertData, error: dbError } = await supabase
      .from("receipts")
      .insert({
        user_id: user.id,
        file_path: filePath,
        raw_text: rawText || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("❌ Database error:", dbError);
      // Try to delete uploaded file if db insert fails
      await supabase.storage.from("receipts").remove([filePath]);
      return NextResponse.json(
        { ok: false, error: "Kunde inte spara kvitto i databasen: " + dbError.message },
        { status: 500 }
      );
    }

    console.log("✓ Receipt saved to database:", insertData.id);

    return NextResponse.json({ ok: true, receipt: insertData }, { status: 200 });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Ett oväntat fel uppstod: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
