"use client";

import { createClient } from "@/lib/supabase/client";
import { AdjustmentsHorizontalIcon, ArrowLeftStartOnRectangleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Button, Menu } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Menu>
      <Menu.Target>
        <Button>
          <ChevronDownIcon width={16} height={16} />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<AdjustmentsHorizontalIcon width={16} height={16} />}>
          Settings
        </Menu.Item>
        <Menu.Item leftSection={<ArrowLeftStartOnRectangleIcon width={16} height={16} />} c="red" onClick={logout}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
