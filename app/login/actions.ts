"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Ge användbart felmeddelande beroende på fel
    let errorMessage = "Fel e-post eller lösenord";

    if (error.message.includes("Email not confirmed")) {
      errorMessage = "Du måste bekräfta din e-post innan du kan logga in. Kolla din inkorg!";
    } else if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Fel e-post eller lösenord";
    } else {
      errorMessage = error.message;
    }

    redirect("/login?error=" + encodeURIComponent(errorMessage));
  }

  revalidatePath("/", "layout");
  redirect("/receipts");
}
