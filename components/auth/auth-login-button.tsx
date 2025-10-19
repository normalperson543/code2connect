"use server";
import Link from "next/link";
import { Avatar, Button } from "@mantine/core";
import { createClient } from "@/lib/supabase/server";
import AuthLogoutButton from "./auth-logout-button";
import {
  ArrowRightStartOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { getProfile } from "@/app/lib/data";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getProfile(user.id) : null;

  return user && profile ? (
    <div className="flex items-center gap-2">
      <Link href={`/profile/${profile.username}`} className="flex items-center gap-2">
        <Avatar size="sm" bg="white" />
        <div className="flex items-center gap-4">{profile.username}</div>
      </Link>
      <AuthLogoutButton />
    </div>
  ) : (
    <div className="flex flex-row gap-2">
      <Button
        size="sm"
        leftSection={<ArrowRightStartOnRectangleIcon width={16} height={16} />}
      >
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Link href="/auth/sign-up">
        <Button
          size="sm"
          variant="gradient"
          gradient={{ from: "blue", to: "cyan", deg: 135 }}
          leftSection={<UserPlusIcon width={16} height={16} />}
        >
          Sign up
        </Button>
      </Link>
    </div>
  );
}
