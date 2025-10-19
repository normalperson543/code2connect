"use client";

import { Project } from "@/app/lib/projects";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { Avatar, Card, Title, Text, AspectRatio, Anchor } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({ projectInfo }: { projectInfo: Project }) {
  console.log("project card");
  console.log("project: " + projectInfo);
  console.log("project owener: " + projectInfo.owner);
  console.log("project name: " + projectInfo.name);
  console.log(projectInfo.thumbnail);

  return (
    <Card shadow="md" padding="lg" radius="md" className="min-w-60" withBorder>
      <Card.Section>
        <AspectRatio ratio={16 / 9}>
          <Image
            src={projectInfo.thumbnail}
            height={135}
            width={240}
            alt="Project thumbnail"
          />
        </AspectRatio>
      </Card.Section>
      <div className="flex flex-col gap-2 mt-4">
        <Title order={5}>{projectInfo.title}</Title>
        <div className="flex flex-row gap-2 items-center">
          <Avatar name={projectInfo.owner?.username} size="sm" />
          <Link href={`/profile/${projectInfo.owner.username}`}>
            <Anchor component="button">{projectInfo.owner.username}</Anchor>
          </Link>
        </div>
        <div className="flex flex-row gap-2 items-center">
          {projectInfo.likes && (
            <>
              <HandThumbUpIcon width={16} height={16} />
              <Text>{projectInfo.likes}</Text>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
