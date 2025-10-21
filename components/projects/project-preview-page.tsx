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
  Menu,
} from "@mantine/core";
import Link from "next/link";
import ThumbPreview from "../thumb-preview";
import {
  Bars3CenterLeftIcon,
  ChatBubbleOvalLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  GlobeAmericasIcon,
  PaperAirplaneIcon,
  PlusIcon,
  RectangleStackIcon,
  ShareIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import SolidHandThumbUpIcon from "@heroicons/react/24/solid/HandThumbUpIcon";
import ProjectCarousel from "../project-carousel";
import Heading from "../heading";
import { Cluster, Comment as CommentData, Project } from "@prisma/client";
import Comment from "../comment";
import { fork, shareProject } from "@/app/lib/actions";
import { useState } from "react";

import { ProjectWithOwner } from "@/app/lib/projects";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

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
  isPublic,
  parent,
  saveDescription,
  canEdit,
  isLiked: isLikedDb,
  handleLike,
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
  isPublic: boolean;
  parent: ProjectWithOwner | null;
  saveDescription: (newDesc: string) => void;
  canEdit: boolean;
  isLiked: boolean;
  handleLike: () => void;
}) {
  const [isForking, setIsForking] = useState(false);
  const [isLiked, setIsLiked] = useState(isLikedDb)
  const [sessionDesc, setSessionDesc] = useState(description);

  const searchParams = useSearchParams();

  const debounceSave = useDebouncedCallback(() => {
    saveDescription(sessionDesc);
  }, 2000);

  const debounceLike = useDebouncedCallback(() => handleLike(), 1000)
  return (
    <div className="flex flex-col gap-2">
      <Heading>
        <div className="flex flex-row gap-4 items-center">
          <Avatar name={creator} src={creatorImageSrc} size="lg" bg="white" />
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
      {!isPublic && (
        <div className="flex flex-row gap-2 pl-16 pr-16 pt-4 pb-4 bg-orange-700 border-orange-800 text-white border-1 items-center">
          <div className="flex flex-row gap-2 flex-1 items-center">
            <ExclamationTriangleIcon width={16} height={16} />{" "}
            <p>
              This project is not public. Click Share so others can access it.
            </p>
          </div>
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Button
                color="orange"
                leftSection={<ShareIcon width={16} height={16} />}
                autoContrast
              >
                Share
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<GlobeAmericasIcon width={16} height={16} />}
                onClick={() => shareProject(id)}
              >
                Publish to the world
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      )}
      {searchParams.get("shared") === "1" && isPublic && (
        <div className="flex flex-row gap-2 pl-16 pr-16 pt-4 pb-4 bg-green-50 border-green-200 border-1 items-center">
          <CheckIcon width={16} height={16} />{" "}
          <p>You&apos;ve successfully shared your project!</p>
        </div>
      )}

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
          {parent && (
            <div className="p-2 rounded-sm border-2 border-offblue-200 bg-offblue-50">
              This project was forked from{" "}
              <Anchor component={Link} href={`/projects/${parent.id}`}>
                {parent.title}
              </Anchor>{" "}
              by{" "}
              <Anchor
                component={Link}
                href={`/profile/${parent.owner?.username}`}
              >
                {parent.owner?.username}
              </Anchor>
              .
            </div>
          )}
          <div className="flex-1 flex flex-row items-center gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <Bars3CenterLeftIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={4}>Description</Title>
          </div>
          {canEdit ? (
            <Textarea
              className="w-full h-full"
              label="Add instructions to your project, any credits, or acknowledgements."
              rows={8}
              value={sessionDesc ?? ""}
              onChange={(e) => {
                const target = e.target as HTMLTextAreaElement;
                setSessionDesc(target.value);
                debounceSave();
              }}
            />
          ) : (
            <Textarea
              className="w-full h-full"
              placeholder="No description provided"
              rows={8}
              value={description ?? ""}
              readOnly
            />
          )}
        </div>
      </div>
      <div className="w-full pl-16 pr-16 flex flex-row gap-2 justify-between">
        <div className="w-full flex flex-row gap-2">
          <Button
            leftSection={<SolidHandThumbUpIcon width={16} height={16} />}
            variant={isLiked ? "filled" : "subtle"}
            onClick={() => {
              setIsLiked(!isLiked);
              debounceLike();
              
            }}
          >
            <div className="flex flex-row gap-1">
              <Text fw={700}>{likes}</Text> <Text>like{likes !== 1 && "s"}</Text>
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
            autoContrast
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
      {forks.length > 0 && (
        <>
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
        </>
      )}
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
