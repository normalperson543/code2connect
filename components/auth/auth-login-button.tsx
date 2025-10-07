"use server";
import Link from "next/link";
import { Avatar, Button } from "@mantine/core";
import { createClient } from "@/lib/supabase/server";
import AuthLogoutButton from "./auth-logout-button";
import { ArrowRightStartOnRectangleIcon, UserPlusIcon } from "@heroicons/react/24/outline";

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
      <Button size="sm" leftSection={<ArrowRightStartOnRectangleIcon width={16} height={16} />}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button size="sm" variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 135 }} leftSection={<UserPlusIcon width={16} height={16} />}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
