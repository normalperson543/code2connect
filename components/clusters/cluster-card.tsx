"use client";

import { deleteClusterFromProfilePage } from "@/app/lib/actions";
import { ClusterWithOwner } from "@/app/lib/cluster-types";
import { CodeBracketIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Anchor,
  AspectRatio,
  Avatar,
  Button,
  Card,
  Menu,
  Title,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
export default function ClusterCard({
  clusterInfo,
  projectCount,
  canDelete = false,
}: {
  clusterInfo: ClusterWithOwner;
  projectCount: number;
  canDelete?: boolean;
}) {
  const [deleting, setDeleting] = useState(false);
  console.log(clusterInfo.thumbnail);
  return (
    <Card shadow="md" padding="lg" radius="md" className="min-w-60" withBorder>
      <Card.Section>
        <Link href={`/clusters/${clusterInfo.id}`}>
          <AspectRatio ratio={16 / 9}>
            <Image
              src={
                clusterInfo.thumbnail && clusterInfo.thumbnail !== ""
                  ? (clusterInfo.thumbnail as string)
                  : "/assets/placeholder-thumb.jpg"
              }
              height={135}
              width={240}
              alt="Cluster thumbnail"
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
        {canDelete && (
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
                  deleteClusterFromProfilePage(clusterInfo.id);
                  setDeleting(true);
                }}
              >
                Yes, delete this cluster
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </Card>
  );
}
