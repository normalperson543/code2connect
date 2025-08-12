"use client";

import { AspectRatio, Button, Center, Flex, Overlay } from "@mantine/core";
import { PlayIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ThumbPreview({
  projectId,
  thumbnailUrl,
  width,
  maxWidth,
}: {
  projectId: string;
  thumbnailUrl: string;
  width: string | number;
  maxWidth: string | number;
}) {
  return (
    <Link href={`/projects/${projectId}/editor`} className="w-full h-full">
      <AspectRatio
        ratio={16 / 9}
        maw={maxWidth}
        w={width}
        mx="auto"
        pos="relative"
      >
        <div
          className="flex justify-center items-center w-full h-full rounded-sm bg-cover!"
          style={{
            background: `url(${thumbnailUrl})`,
          }}
        >
          <div className="flex justify-center items-center w-full h-full backdrop-blur-xs">
            <Button leftSection={<PlayIcon width={16} height={16} />}>
              See Inside to Run
            </Button>
          </div>
        </div>
      </AspectRatio>
    </Link>
  );
}
