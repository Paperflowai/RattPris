"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message));
  }

  // Kolla om e-postbekräftelse krävs
  // Om användaren har en session direkt = ingen bekräftelse krävs
  // Om användaren INTE har en session = e-postbekräftelse krävs
  if (data.user && !data.session) {
    // E-postbekräftelse krävs
    redirect("/signup/confirm?email=" + encodeURIComponent(email));
  }

  // Användaren är inloggad direkt (ingen bekräftelse krävs)
  revalidatePath("/", "layout");
  redirect("/receipts");
}
