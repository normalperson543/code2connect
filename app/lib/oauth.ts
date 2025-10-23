"use server";
import { createClient } from "@/lib/supabase/server";

export default async function signInWithGoogle() {
  const supabase = await createClient();

  await supabase.auth.signInWithOAuth({
    provider: "google",
  });
}
