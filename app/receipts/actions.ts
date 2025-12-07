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

export async function deleteReceipt(formData: FormData) {
  const receiptId = formData.get("receiptId") as string | null;
  if (!receiptId) return;

  const supabase = await createClient();

  // Kolla vem som är inloggad
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("Ingen användare inloggad – kan inte radera kvitto.");
    return;
  }

  // 1. Hämta kvittot för att få file_path
  const { data: receipt, error: fetchError } = await supabase
    .from("receipts")
    .select("file_path")
    .eq("id", receiptId)
    .eq("user_id", user.id)
    .single();

  if (fetchError) {
    console.error("Kunde inte hämta kvitto för radering:", fetchError);
  } else if (receipt?.file_path) {
    // 2. Ta bort filen från Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("receipts")
      .remove([receipt.file_path]);

    if (storageError) {
      console.error("Kunde inte ta bort filen från storage:", storageError);
    }
  }

  // 3. Ta bort raden i databasen
  const { error: deleteError } = await supabase
    .from("receipts")
    .delete()
    .eq("id", receiptId)
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("Kunde inte ta bort kvitto i databasen:", deleteError);
  }

  // 4. Ladda om /receipts så listan uppdateras
  revalidatePath("/receipts");
}
