"use client";

import { ClusterWithOwner } from "@/app/lib/cluster-types";
import { CodeBracketIcon } from "@heroicons/react/24/outline";
import { Anchor, AspectRatio, Avatar, Card, Title } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { Prisma } from "@prisma/client";
export default function ClusterCard({
  clusterInfo,
  projectCount,
}: {
  clusterInfo: ClusterWithOwner;
  projectCount: number;
}) {
  return (
    <Card shadow="md" padding="lg" radius="md" className="min-w-60" withBorder>
      <Card.Section>
        <Link href={`/clusters/${clusterInfo.id}`}>
          <AspectRatio ratio={16 / 9}>
            <Image
              src={clusterInfo.thumbnail as string}
              height={135}
              width={240}
              alt="Project thumbnail"
            />
          </AspectRatio>
        </Link>
      </Card.Section>
      <div className="flex flex-col gap-2 mt-4">
        <Link href={`/clusters/${clusterInfo.id}`}>
          <Title order={5}>{clusterInfo.title}</Title>
        </Link>
        <div className="flex flex-row gap-2 items-center">
          <Avatar name={clusterInfo.owner?.username} size="sm" />
          <Link href={`/profile/${clusterInfo.owner.username}`}>
            <Anchor component="button">{clusterInfo.owner.username}</Anchor>
          </Link>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <CodeBracketIcon width={16} height={16} />
          <p>{projectCount}</p>
        </div>
      </div>
    </Card>
  );
}
