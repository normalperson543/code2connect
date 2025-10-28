"use server";

import { createClient } from "@/lib/supabase/server";
import { BoltIcon } from "@heroicons/react/24/solid";
import { Button, Menu } from "@mantine/core";
import Link from "next/link";
import CreateButton from "./create-button";

export default async function CreateButtonWrapper() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Button
        leftSection={<BoltIcon width={16} height={16} />}
        className="self-start"
        component={Link}
        href="/auth/login"
      >
        Create
      </Button>
    );
  }

  return <CreateButton />;
}
