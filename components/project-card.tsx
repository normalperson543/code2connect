"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Badge,
  Card,
  Title,
  Text,
  AspectRatio,
  Anchor,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({
  title,
  creator,
  likeCount,
  thumbnail,
  badge,
}: {
  title: string;
  creator: string;
  likeCount?: number;
  thumbnail: string;
  badge?: string;
}) {
  return (
    <Card shadow="sm" padding="lg" radius="md" className="min-w-1/4"  withBorder>
      <Card.Section>
        <AspectRatio ratio={240 / 135}>
          <Image
            src={thumbnail}
            height={135}
            width={240}
            alt="Project thumbnail"
          />
        </AspectRatio>
      </Card.Section>
      <div className="flex flex-col gap-2 mt-4">
        {badge && <Badge>{badge}</Badge>}
        <Title order={5}>{title}</Title>
        <div className="flex flex-row gap-2 items-center">
          <Avatar size="sm" />
          <Link href={`/profile/${creator}`}>
            <Anchor component="button">{creator}</Anchor>
          </Link>
        </div>
        <div className="flex flex-row gap-2 items-center">
          {likeCount && (
            <>
              <HandThumbUpIcon width={16} height={16} />
              <Text>{likeCount}</Text>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
