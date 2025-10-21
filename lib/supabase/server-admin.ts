"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SB_BACKEND_KEY!,
    {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );
}
