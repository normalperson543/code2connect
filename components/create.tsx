"use client";

import { createCluster, createProject } from "@/app/lib/actions";
import {
  BoltIcon,
  CodeBracketIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import { Button, Menu } from "@mantine/core";
import { useState } from "react";

export default function CreateButton() {
  const [creating, setCreating] = useState(false);
  return (
    <Menu>
      <Menu.Target>
        <Button
          leftSection={<BoltIcon width={16} height={16} />}
          loading={creating}
        >
          Create
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<CodeBracketIcon width={16} height={16} />}
          onClick={() => {
            createProject();
            setCreating(true);
          }}
        >
          New project
        </Menu.Item>
        <Menu.Item
          leftSection={<RectangleStackIcon width={16} height={16} />}
          onClick={() => {
            createCluster();
            setCreating(true);
          }}
        >
          New cluster
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
