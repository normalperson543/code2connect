"use client";

import { createCluster, createProject } from "@/app/lib/actions";
import {
  BoltIcon,
  CodeBracketIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Button, Menu } from "@mantine/core";

export default function CreateButton() {
  return (
    <Menu>
      <Menu.Target>
        <Button
          leftSection={<BoltIcon width={16} height={16} />}
          className="self-start"
        >
          Create
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<CodeBracketIcon width={16} height={16} />}
          onClick={() => {
            createProject();
          }}
        >
          New project
        </Menu.Item>
        <Menu.Item
          leftSection={<RectangleStackIcon width={16} height={16} />}
          onClick={() => {
            createCluster();
          }}
        >
          New cluster
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
