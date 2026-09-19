"use server";

import { BoltIcon } from "@heroicons/react/24/solid";
import { Button } from "@mantine/core";
import Link from "next/link";
import CreateButton from "./create-button";
import { getSession } from "@/lib/session";

export default async function CreateButtonWrapper() {
  const session = await getSession();

  if (!session?.user) {
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
