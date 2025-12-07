import { createClient } from "@/lib/supabase/server";

export type UserRole = "user" | "admin";

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.role as UserRole;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === "admin";
}
