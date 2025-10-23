"use server";
import { createClient } from "@/lib/supabase/server";

export default async function signInWithGoogle() {
  const supabase = await createClient();

  console.log("Signing in");
  await supabase.auth.signInWithOAuth({
    provider: "google",
  });
}
