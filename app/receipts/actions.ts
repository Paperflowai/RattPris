"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function uploadReceipt(formData: FormData) {
  const supabase = await createClient();

  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;
  const rawText = formData.get("rawText") as string;

  if (!file) {
    return { success: false, error: "Ingen fil vald" };
  }

  if (!userId) {
    return { success: false, error: "Användare inte inloggad" };
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: "Filen är för stor (max 10MB)" };
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
    return { success: false, error: "Filtyp stöds inte" };
  }

  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { success: false, error: "Uppladdning misslyckades" };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("receipts").getPublicUrl(fileName);

    // Save receipt record to database (med OCR-text)
    const { error: dbError } = await supabase.from("receipts").insert({
      user_id: userId,
      image_url: publicUrl,
      raw_text: rawText || null,
    });

    if (dbError) {
      console.error("Database error:", dbError);
      // Try to delete uploaded file if db insert fails
      await supabase.storage.from("receipts").remove([fileName]);
      return { success: false, error: "Kunde inte spara kvitto i databasen" };
    }

    // Revalidate the receipts page to show new receipt
    revalidatePath("/receipts");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Ett oväntat fel uppstod" };
  }
}
