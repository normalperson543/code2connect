"use client";

import {
  Title,
  Text,
  Anchor,
  Textarea,
  Avatar,
  Button,
  Divider,
  ThemeIcon,
} from "@mantine/core";
import Link from "next/link";
import ThumbPreview from "../thumb-preview";
import {
  Bars3CenterLeftIcon,
  ChatBubbleOvalLeftIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  PlusIcon,
  RectangleStackIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import SolidHandThumbUpIcon from "@heroicons/react/24/solid/HandThumbUpIcon";
import ProjectCarousel from "../project-carousel";
import Heading from "../heading";
import { Cluster, Comment as CommentData, Project } from "@prisma/client";
import Comment from "../comment";
import { fork } from "@/app/lib/actions";
import { useState } from "react";

import { ProjectWithOwner } from "@/app/lib/projects";

export default function ProjectPreviewPageUI({
  creatorImageSrc,
  creator,
  title,
  description,
  comments,
  clusters,
  likes,
  id,
  thumbnail,
  forks,
}: {
  creatorImageSrc?: string;
  creator: string;
  canEditInfo: boolean;
  title: string;
  description: string;
  comments: CommentData[] | null;
  clusters: Cluster[] | null;
  likes: number;
  id: string;
  thumbnail: string;
  forks: Project[];
}) {
  const [isForking, setIsForking] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <Heading>
        <div className="flex flex-row gap-2">
          <Avatar name={creator} src={creatorImageSrc} size="lg" />
          <div className="flex flex-col gap-2 justify-center">
            <Title order={2}>{title}</Title>
            <Text>
              by{" "}
              <Link href={`/profile/${creator}`} target="_blank">
                <Anchor component="button" c="white">
                  {creator}
                </Anchor>
              </Link>
            </Text>
          </div>
        </div>
      </Heading>
      <div className="w-full h-full pl-16 pr-16 pt-4 pb-4 flex-row flex gap-2">
        <div className="h-full flex flex-col gap-2 w-1/2 stretch">
          <ThumbPreview
            projectId={id}
            thumbnailUrl={thumbnail}
            maxWidth="100%"
            width="100%"
          />
        </div>

        <div className="flex flex-col h-full w-1/2 gap-2">
          <div className="flex-1 flex flex-row items-center gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <Bars3CenterLeftIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={4}>Description</Title>
          </div>

          <textarea className="w-full h-full"></textarea>
        </div>
      </div>
      <div className="w-full pl-16 pr-16 flex flex-row gap-2 justify-between">
        <div className="w-full flex flex-row gap-2">
          <Button
            leftSection={<SolidHandThumbUpIcon width={16} height={16} />}
            variant="subtle"
          >
            <div className="flex flex-row gap-1">
              <Text fw={700}>{likes}</Text> <Text>likes</Text>
            </div>
          </Button>
        </div>
        <div className="w-full flex flex-row gap-2 justify-end">
          <Button
            leftSection={<SparklesIcon width={16} height={16} />}
            onClick={() => {
              fork(id);
              setIsForking(true);
            }}
            loading={isForking}
          >
            Fork
          </Button>
          <Button leftSection={<PlusIcon width={16} height={16} />}>
            Add to cluster
          </Button>
          <Button
            leftSection={<ExclamationTriangleIcon width={16} height={16} />}
            color="orange"
          >
            Report
          </Button>
        </div>
      </div>
      <Divider orientation="horizontal" className="mt-4 mb-4" />
      <div className="w-full pl-16 pr-16 flex flex-col gap-2">
        <div className="flex-1 flex flex-row items-center gap-2">
          <ThemeIcon radius="xl" className="shadow-md">
            <ChatBubbleOvalLeftIcon width={16} height={16} />
          </ThemeIcon>
          <Title order={4}>Comments (20+)</Title>
        </div>
        <Title order={4}>Add a comment</Title>
        <div className="flex flex-row gap-2 w-full">
          <Avatar src="" size="md" />
          <div className="flex flex-col gap-2 w-full">
            <Textarea w="100%" rows={3} />
            <div className="flex flex-row gap-2 w-full">
              <Button
                leftSection={<PaperAirplaneIcon width={16} height={16} />}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
        <Comment
          id="570abbc9-b1e1-456f-9fbf-559c584faf73"
          username="normalperson543"
          profilePicture=""
          content="This is a comment."
          dateCreated={new Date()}
          pinned
          isCreator
          handleDelete={() => {}}
          handleReport={() => {}}
          handleTogglePin={() => {}}
        />
      </div>

      <Divider orientation="horizontal" className="mt-4 mb-4" />

      <div className="w-full pl-16 pr-16 flex flex-col gap-2">
        <div className="flex-1 flex flex-row items-center gap-2">
          <ThemeIcon radius="xl" className="shadow-md">
            <SparklesIcon width={16} height={16} />
          </ThemeIcon>
          <Title order={4}>Forks</Title>
        </div>
        <ProjectCarousel projects={forks as ProjectWithOwner[]} />
      </div>

      <Divider orientation="horizontal" />

      <div className="w-full pl-16 pr-16 flex flex-col gap-2">
        <div className="flex-1 flex flex-row items-center gap-2">
          <ThemeIcon radius="xl" className="shadow-md">
            <RectangleStackIcon width={16} height={16} />
          </ThemeIcon>
          <Title order={4}>Clusters</Title>
        </div>
      </div>
    </div>
  );
}
