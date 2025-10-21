"use client";

import {
  Avatar,
  Card,
  Title,
  Anchor,
  Badge,
  Button,
  Menu,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { ProjectWithOwner } from "@/app/lib/projects";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteProject } from "@/app/lib/actions";
import { useState } from "react";

export default function ProjectCard({
  projectInfo,
  isOwner = false,
}: {
  projectInfo: ProjectWithOwner;
  isOwner?: boolean;
}) {
  const [deleting, setDeleting] = useState(false);
  console.log("from pc")
  console.log(projectInfo)
  return (
    <Card shadow="md" padding="lg" radius="md" className="min-w-60" withBorder>
      <Card.Section>
        <Link href={`/projects/${projectInfo.id}`} key={projectInfo.id}>
          {!projectInfo.isPublic && (
            <Badge className="absolute right-1 top-1 z-1" color="orange">
              Unshared
            </Badge>
          )}
          <div className="relative h-[135] w-[240]">
            <Image
              src={projectInfo.thumbnail ?? "/assets/placeholder-thumb.jpg"}
              fill
              className="object-cover"
              alt="Project thumbnail"
            />
          </div>
        </Link>
      </Card.Section>
      <div className="flex flex-col gap-2 mt-4">
        <Link href={`/projects/${projectInfo.id}`} key={projectInfo.id}>
          <Title order={5}>{projectInfo.title}</Title>
        </Link>
        <Link
          href={`/profile/${projectInfo.owner?.username}`}
          className="flex flex-row gap-2"
        >
          <div className="flex flex-row gap-2 items-center">
            <Avatar name={projectInfo.owner?.username} size="sm" />
          </div>
          <Anchor component="button">{projectInfo.owner?.username}</Anchor>
        </Link>
        {isOwner && (
          <Menu>
            <Menu.Target>
              <Button
                color="red"
                leftSection={<TrashIcon width={16} height={16} />}
                loading={deleting}
              >
                Delete
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<TrashIcon width={16} height={16} />}
                c="red"
                onClick={() => {
                  deleteProject(
                    projectInfo.id,
                    projectInfo.owner?.username as string,
                  );
                  setDeleting(true);
                }}
              >
                Yes, delete this project
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </Card>
  );
}
