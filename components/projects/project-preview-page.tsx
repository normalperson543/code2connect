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
  Button,
  Divider,
  ThemeIcon,
} from "@mantine/core";
import styles from "./project-preview-page.module.css";
import Link from "next/link";
import ThumbPreview from "../thumb-preview";
import {
  Bars3CenterLeftIcon,
  ChatBubbleOvalLeftIcon,
  CodeBracketIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  PlusIcon,
  RectangleStackIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import SolidHandThumbUpIcon from "@heroicons/react/24/solid/HandThumbUpIcon";
import ProjectCarousel from "../project-carousel";
import Heading from "../heading";
import { Cluster, Comment as CommentData } from "@prisma/client";
import Comment from "../comment";

export default function ProjectPreviewPageUI({
  creatorImageSrc,
  creator,
  title,
  description,
  comments,
  clusters,
  likes
}: {
  creatorImageSrc?: string;
  creator: string;
  canEditInfo: boolean;
  title: string;
  description: string;
  comments: CommentData[];
  clusters: Cluster[];
  likes: number
}) {
  return (
    <div className="flex flex-col ap-2">
      <Heading>
        <div className="flex flex-row gap-2">
          <Avatar src={creatorImageSrc} size="lg" />
          <div className={styles.userInfo}>
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
        <div className="w-full h-full flex flex-col gap-2">
          <ThumbPreview
            projectId="a"
            thumbnailUrl="/assets/default-image.png"
            maxWidth="100%"
            width="100%"
          />
        </div>

        <div className="flex flex-col h-full w-full gap-2">
          <div className="flex-1 flex flex-row items-center gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <Bars3CenterLeftIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={4}>Description</Title>
          </div>

          <Textarea className="w-full h-full" w="100%" h="100%"></Textarea>
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
          <Button leftSection={<SparklesIcon width={16} height={16} />}>
            Fork
          </Button>
          <Button leftSection={<CodeBracketIcon width={16} height={16} />}>
            Embed
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
        <ProjectCarousel
          projects={[
            {
              name: "Guess the Number",
              projectId: "a",
              owner: {
                username: "normalperson543",
              },
              likes: 69,
              featured: false,
              thumbnail: "/assets/default-image.png",
            },
            {
              name: "Guess the Number",
              projectId: "a",
              owner: {
                username: "normalperson543",
              },
              likes: 69,
              featured: false,
              thumbnail: "/assets/default-image.png",
            },
            {
              name: "Guess the Number",
              projectId: "a",
              owner: {
                username: "normalperson543",
              },
              likes: 69,
              featured: false,
              thumbnail: "/assets/default-image.png",
            },
            {
              name: "Guess the Number",
              projectId: "a",
              owner: {
                username: "normalperson543",
              },
              likes: 69,
              featured: false,
              thumbnail: "/assets/default-image.png",
            },
            {
              name: "Guess the Number",
              projectId: "a",
              owner: {
                username: "normalperson543",
              },
              likes: 69,
              featured: false,
              thumbnail: "/assets/default-image.png",
            },
            {
              name: "Guess the Number",
              projectId: "a",
              owner: {
                username: "normalperson543",
              },
              likes: 69,
              featured: false,
              thumbnail: "/assets/default-image.png",
            },
            {
              name: "Guess the Number",
              projectId: "a",
              owner: {
                username: "normalperson543",
              },
              likes: 69,
              featured: false,
              thumbnail: "/assets/default-image.png",
            },
            {
              name: "Guess the Number",
              projectId: "a",
              owner: {
                username: "normalperson543",
              },
              likes: 69,
              featured: false,
              thumbnail: "/assets/default-image.png",
            },
            {
              name: "Guess the Number",
              projectId: "a",
              owner: {
                username: "normalperson543",
              },
              likes: 69,
              featured: false,
              thumbnail: "/assets/default-image.png",
            },
            {
              name: "Guess the Number",
              projectId: "a",
              owner: {
                username: "normalperson543",
              },
              likes: 69,
              featured: false,
              thumbnail: "/assets/default-image.png",
            },
          ]}
        />
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
