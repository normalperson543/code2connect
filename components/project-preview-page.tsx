"use client";

import {
  TextInput,
  Title,
  Text,
  Anchor,
  Flex,
  Stack,
  Textarea,
  Group,
  Avatar,
} from "@mantine/core";
import styles from "./project-preview-page.module.css";
import Link from "next/link";
import ThumbPreview from "./ui/thumb-preview";
import {
  ChatBubbleOvalLeftIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import Comment from "./comment";

export default function ProjectPreviewPageUI({
  creatorImageSrc,
  creator,
  canEditInfo,
  title,
}: {
  creatorImageSrc?: string;
  creator: string;
  canEditInfo: boolean;
  title: string;
}) {
  return (
    <div className="flex flex-col pl-16 pr-16 pt-3 pb-3 gap-2">
      <div className={styles.heading}>
        <Avatar src={creatorImageSrc} size="lg" />
        <div className={styles.userInfo}>
          <Title order={2}>{title}</Title>
          <Text>
            by{" "}
            <Link href={`/profile/${creator}`} target="_blank">
              <Anchor component="button">{creator}</Anchor>
            </Link>
          </Text>
        </div>
      </div>
      <div className="w-full h-full pt-4 pb-4 flex-row flex gap-2">
        <ThumbPreview
          projectId="a"
          thumbnailUrl="/assets/default-image.png"
          maxWidth="100%"
          width="100%"
        />
        <div className="flex flex-col h-full w-full">
          <div className="flex flex-row items-center">
            <DocumentIcon width={16} height={16} />
            <Text fw={700}>Description</Text>
          </div>

          <Textarea className="w-full h-full" w="100%" h="100%"></Textarea>
        </div>
      </div>
      <div className="w-full h-full flex flex-row gap-2">
        <div className="w-3/4 flex flex-col gap-2">
          <div className="w-full flex flex-row gap-2 items-center">
            <ChatBubbleOvalLeftIcon width={16} height={16} />
            <Title order={3}>Comments</Title>
          </div>
          <Comment
            username="normalperson543"
            profilePicture=""
            content="This is a comment."
            dateCreated={new Date()}
          />
        </div>
      </div>
    </div>
  );
}
