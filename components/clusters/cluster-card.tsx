'use client'

import { HandThumbUpIcon, UserGroupIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { Anchor, AspectRatio, Avatar, Card, Title } from "@mantine/core";
import { Cluster } from "@prisma/client";
import cluster from "cluster";
import Image from "next/image"
import Link from "next/link";
export default function ClusterCard(clusterInfo: Cluster, clusterMembers: number) {
  return (
    <Card shadow="md" padding="lg" radius="md" className="min-w-60" withBorder>
      <Card.Section>
        <AspectRatio ratio={16 / 9}>
          <Image
            src={clusterInfo.thumbnail}
            height={135}
            width={240}
            alt="Project thumbnail"
          />
        </AspectRatio>
      </Card.Section>
      <div className="flex flex-col gap-2 mt-4">
        <Title order={5}>{clusterInfo.title}</Title>
        <div className="flex flex-row gap-2 items-center">
          <Avatar size="sm" />
          <Link href={`/profile/${clusterInfo.owner.username}`}>
            <Anchor component="button">{clusterInfo.owner.username}</Anchor>
          </Link>
        </div>
        <div className="flex flex-row gap-2 items-center">
              <UserGroupIcon width={16} height={16} />
              <p>{clusterMembers}</p>
        </div>
      </div>
    </Card>
  );
}