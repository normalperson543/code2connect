"use server";
import Link from "next/link";
import { Avatar, Button } from "@mantine/core";
import { createClient } from "@/lib/supabase/server";
import AuthLogoutButton from "./auth-logout-button";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-2">
      <Avatar size="sm" bg="white" />
      <div className="flex items-center gap-4">{user.email}</div>
      <AuthLogoutButton />
    </div>
  ) : (
    <div className="flex flex-row gap-2">
      <Button size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
