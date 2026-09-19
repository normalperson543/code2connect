"use server";

import Link from "next/link";
import { Avatar, Button } from "@mantine/core";
import AuthLogoutButton from "./auth-logout-button";
import {
  ArrowRightStartOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { getProfile } from "@/app/lib/data";
import { getSession } from "@/lib/session";

export default async function AuthButton() {
  const session = await getSession();
  const user = session?.user;

  const profile = user ? await getProfile(user.id) : null;

  return user && profile ? (
    <div className="flex items-center gap-2">
      <Link
        href={`/profile/${profile.username}`}
        className="flex items-center gap-2"
      >
        <Avatar name={profile.username} src={null} size="sm" bg="white" />
        <div className="flex items-center gap-4">{profile.username}</div>
      </Link>
      <AuthLogoutButton />
    </div>
  ) : (
    <div className="flex flex-row gap-2">
      <Button
        size="sm"
        leftSection={<ArrowRightStartOnRectangleIcon width={16} height={16} />}
        component={Link}
        href="/auth/login"
      >
        Sign in
      </Button>
      <Button
        size="sm"
        variant="gradient"
        gradient={{ from: "blue", to: "cyan", deg: 135 }}
        leftSection={<UserPlusIcon width={16} height={16} />}
        component={Link}
        href="/auth/sign-up"
      >
        Sign up
      </Button>
    </div>
  );
}
