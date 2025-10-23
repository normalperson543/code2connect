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
  CalendarIcon,
  ChatBubbleOvalLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  GlobeAmericasIcon,
  PhotoIcon,
  PlusIcon,
  RectangleStackIcon,
  ShareIcon,
  ShieldCheckIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import SolidHandThumbUpIcon from "@heroicons/react/24/solid/HandThumbUpIcon";
import ProjectCarousel from "../project-carousel";
import Heading from "../heading";
import { Project } from "@prisma/client";
import {
  addProjectToCluster,
  createProjectComment,
  createProjectCommentReply,
  deleteProject,
  deleteProjectComment,
  deleteProjectCommentReply,
  feature,
  fork,
  shareProject,
  togglePinProjectComment,
  unfeature,
  unshareProject,
} from "@/app/lib/actions";
import { useState } from "react";

import { ProjectWithOwner } from "@/app/lib/projects";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { modals } from "@mantine/modals";
import { validate } from "uuid";
import CommentModule from "../comment-module";
import { ClusterWithOwner } from "@/app/lib/cluster-types";
import ClusterCarousel from "../cluster-carousel";
import { notifications } from "@mantine/notifications";
import AddToClusterModal from "../modals/add-to-cluster-modal";
import { getCluster } from "@/app/lib/data";
import { CommentWithOwner } from "@/app/lib/comment-types";

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
  isAdmin,
  currentUserId,
  project,
  projectId,
  currentUsername,
  datePublished,
}: {
  creatorImageSrc?: string;
  creator: string;
  canEditInfo: boolean;
  title: string;
  description: string;
  comments: CommentWithOwner[] | null;
  clusters: ClusterWithOwner[] | null;
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
  isAdmin: boolean;
  currentUserId: string;
  project: Project;
  projectId: string;
  currentUsername: string;
  datePublished?: Date | null;
}) {
  const [isForking, setIsForking] = useState(false);
  const [isLiked, setIsLiked] = useState(isLikedDb);
  const [sessionDesc, setSessionDesc] = useState(description);

  const searchParams = useSearchParams();

  const debounceSave = useDebouncedCallback(() => {
    saveDescription(sessionDesc);
  }, 2000);

  const debounceLike = useDebouncedCallback(() => handleLike(), 1000);

  async function handleAdd(clusterUrl: string) {
    let pathname;
    try {
      pathname = new URL(clusterUrl).pathname;
    } catch {
      notifications.show({
        position: "top-right",
        withCloseButton: true,
        autoClose: false,
        title: "Please specify a valid cluster link",
        message:
          "It should start with https://code2connect.vercel.app/clusters.",
        color: "red",
        icon: <XMarkIcon />,
      });
      return;
    }
    const pathnamePages = pathname.split("/").filter(Boolean);
    let clusterId;
    for (let i = pathnamePages.length - 1; i >= 0; i--) {
      if (validate(pathnamePages[i])) {
        clusterId = pathnamePages[i];
        break;
      }
    }
    if (!clusterId) {
      notifications.show({
        position: "top-right",
        withCloseButton: true,
        autoClose: false,
        title: "Please specify a valid cluster link",
        message:
          "It should start with https://code2connect.vercel.app/clusters.",
        color: "red",
        icon: <XMarkIcon />,
      });
      return;
    }
    try {
      const cluster = await getCluster(clusterId);
      if (!cluster) {
        notifications.show({
          position: "top-right",
          withCloseButton: true,
          autoClose: false,
          title: "This cluster doesn't exist",
          message: "Please confirm if the cluster link is correct.",
          color: "red",
          icon: <XMarkIcon />,
        });
        return;
      }
    } catch (e) {
      notifications.show({
        position: "top-right",
        withCloseButton: true,
        autoClose: false,
        title: "There was a problem adding your project",
        message: `Please try again later. Error info: ${e instanceof Error ? e.message : "Unknown error"}`,
        color: "red",
        icon: <XMarkIcon />,
      });
    }
    try {
      await addProjectToCluster(clusterId, projectId);
    } catch (e) {
      notifications.show({
        position: "top-right",
        withCloseButton: true,
        autoClose: false,
        title: "There was a problem adding your project",
        message: `Please try again later. Error info: ${e instanceof Error ? e.message : "Unknown error"}`,
        color: "red",
        icon: <XMarkIcon />,
      });
      return;
    }
    notifications.show({
      position: "top-right",
      withCloseButton: true,
      autoClose: true,
      title: "Project added successfully",
      message: "Your project has been added to the cluster.",
      color: "green",
      icon: <CheckIcon />,
    });
  }

  return (
    <div className="flex flex-col gap-2 w-full h-full">
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
          {thumbnail && (
            <div className="flex flex-row gap-2 items-center">
              <PhotoIcon width={16} height={16} opacity={0.5} />

              <Text c="dimmed">
                Photo from{" "}
                <Anchor component={Link} href={thumbnail}>
                  Pexels
                </Anchor>
              </Text>
            </div>
          )}
          {datePublished && isPublic && (
            <div className="flex flex-row gap-2 items-center">
              <CalendarIcon width={16} height={16} opacity={0.5} />
              <Text c="dimmed">Published {datePublished.toLocaleString()}</Text>
            </div>
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
              <Text fw={700}>{likes}</Text>{" "}
              <Text>like{likes !== 1 && "s"}</Text>
            </div>
          </Button>
        </div>
        <div className="w-full flex flex-row gap-2 justify-end">
          {isAdmin && (
            <Menu>
              <Menu.Target>
                <Button
                  leftSection={<ShieldCheckIcon width={16} height={16} />}
                >
                  Admin
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => feature(id)}>Feature</Menu.Item>
                <Menu.Item onClick={() => unfeature(id)}>Unfeature</Menu.Item>
                <Menu.Item onClick={() => unshareProject(id)} c="red">
                  Unshare
                </Menu.Item>
                <Menu.Item onClick={() => deleteProject(id, creator)} c="red">
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
          {isPublic && (
            <>
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
              <Button
                leftSection={<PlusIcon width={16} height={16} />}
                onClick={() =>
                  modals.open({
                    title: `Add to cluster`,
                    children: (
                      <AddToClusterModal
                        onComplete={(url: string) => handleAdd(url)}
                      />
                    ),
                  })
                }
              >
                Add to cluster
              </Button>
              <Button
                leftSection={<ExclamationTriangleIcon width={16} height={16} />}
                color="orange"
                autoContrast
              >
                Report
              </Button>
            </>
          )}
        </div>
      </div>
      <Divider orientation="horizontal" className="mt-8 mb-8" />
      <div className="w-full pl-16 pr-16 flex flex-col gap-2">
        <div className="flex-1 flex flex-row items-center gap-2">
          <ThemeIcon radius="xl" className="shadow-md">
            <ChatBubbleOvalLeftIcon width={16} height={16} />
          </ThemeIcon>
          <Title order={4}>Comments</Title>
        </div>
        <CommentModule
          comments={comments ?? []}
          currentUser={currentUserId}
          accessedProject={project}
          commentsPerPage={5}
          currentUsername={currentUsername}
          handleCreateComment={createProjectComment}
          handleDeleteComment={deleteProjectComment}
          handleCreateCommentReply={createProjectCommentReply}
          handleDeleteCommentReply={deleteProjectCommentReply}
          handlePinComment={togglePinProjectComment}
        />
      </div>
      {forks.length > 0 && (
        <>
          <Divider orientation="horizontal" className="mt-8 mb-8" />

          <div className="w-full pl-16 pr-16 flex flex-col gap-2 pb-4">
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
      {clusters && clusters.length > 0 && (
        <>
          <Divider orientation="horizontal" className="mt-8 mb-8" />
          <div className="w-full pl-16 pr-16 flex flex-col gap-2 pb-4">
            <div className="flex-1 flex flex-row items-center gap-2">
              <ThemeIcon radius="xl" className="shadow-md">
                <RectangleStackIcon width={16} height={16} />
              </ThemeIcon>
              <Title order={4}>Clusters</Title>
            </div>
            <ClusterCarousel clusters={clusters} />
          </div>
        </>
      )}
    </div>
  );
}
