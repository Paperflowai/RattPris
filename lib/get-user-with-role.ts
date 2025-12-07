import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

export type UserProfile = {
  user_id: string;
  role: string;
  created_at: string;
};

export type UserWithRole = {
  user: User;
  profile: UserProfile | null;
  role: string; // 'user' | 'admin' eller null om ingen profil
};

/**
 * Hämtar aktuell inloggad användare och deras profil (roll) från profiles-tabellen.
 *
 * @returns UserWithRole-objekt med user, profile och role
 * @returns null om ingen användare är inloggad
 */
export async function getUserWithRole(): Promise<UserWithRole | null> {
  const supabase = await createClient();

  // Hämta aktuell inloggad användare
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  // Hämta användarens profil från profiles-tabellen
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    // Användaren är inloggad men har ingen profil (kan hända om profilen inte skapats än)
    return {
      user,
      profile: null,
      role: "user", // default till 'user' om ingen profil finns
    };
  }

  return {
    user,
    profile: profile as UserProfile,
    role: profile.role,
  };
}

/**
 * Enklare helper som bara kollar om användaren är admin
 *
 * @returns true om användaren är admin, annars false
 */
export async function isAdmin(): Promise<boolean> {
  const userWithRole = await getUserWithRole();

  if (!userWithRole) {
    return false;
  }

  return userWithRole.role === "admin";
}
