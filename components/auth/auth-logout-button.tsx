"use client";

import { authClient } from "@/lib/auth-client";
import {
  ArrowLeftStartOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Button, Menu } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await authClient.signOut();
    router.push("/auth/login");
  };

  return (
    <Menu>
      <Menu.Target>
        <Button p="xs">
          <ChevronDownIcon width={16} height={16} />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<ArrowLeftStartOnRectangleIcon width={16} height={16} />}
          c="red"
          onClick={logout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
