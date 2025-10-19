"use client";

import { Prisma } from "@prisma/client";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Card,
  Title,
  Text,
  AspectRatio,
  Anchor,
  Badge,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { ProjectWithOwner } from "@/app/lib/projects";

export default function ProjectCard({
  projectInfo,
}: {
  projectInfo: ProjectWithOwner;
}) {
  return (
    <Card shadow="md" padding="lg" radius="md" className="min-w-60" withBorder>
      <Card.Section>
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
      </Card.Section>
      <div className="flex flex-col gap-2 mt-4">
        <Title order={5}>{projectInfo.title}</Title>
        <div className="flex flex-row gap-2 items-center">
          <Avatar name={projectInfo.owner?.username} size="sm" />
          <Link href={`/profile/${projectInfo.owner?.username}`}>
            <Anchor component="button">{projectInfo.owner?.username}</Anchor>
          </Link>
        </div>
      </div>
    </Card>
  );
}
