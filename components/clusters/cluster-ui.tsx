"use client";
import {
  AspectRatio,
  Badge,
  Button,
  Divider,
  Menu,
  Pagination,
  Tabs,
  Textarea,
  ThemeIcon,
  Title,
  Text,
  Avatar,
  Tooltip,
  Checkbox,
  Input,
  TextInput,
  Anchor,
} from "@mantine/core";
import CommentModule from "../comment-module";
import {
  Bars3CenterLeftIcon,
  CalendarIcon,
  ChatBubbleBottomCenterIcon,
  CodeBracketIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import ProjectCard from "../project-card";
import Image from "next/image";
import { Profile } from "@prisma/client";
import { ProjectWithOwner } from "@/app/lib/projects";
import { useDebouncedCallback } from "use-debounce";
import {
  addClusterFollower,
  addProjectToCluster,
  changeClusterDescription,
  removeClusterFollower,
  changeCollabStatus,
  deleteCluster,
  renameCluster,
  setClusterThumbnail,
  setClusterAsIotm,
  unsetClusterAsIotm,
} from "@/app/lib/actions";
import PlaceholderMessage from "../placeholder-message";
import { validate } from "uuid";
import { notifications } from "@mantine/notifications";
import { isClusterFollower } from "@/app/lib/data";
import { getThumbnailSearchResults } from "@/app/lib/data";
import { modals } from "@mantine/modals";
import ThumbnailPickerModal from "../modals/thumbnail-picker";
import { PhotosWithTotalResults } from "pexels";
import Link from "next/link";
export default function ClusterUI({
  id,
  title: titleDb,
  thumbnailUrl,
  isFollowingDb,
  description: descriptionDb,
  dateModified,
  followerCount,
  followers,
  projects,
  allowCollab: allowCollabDb,
  canEdit,
  currentUser,
  dateCreated,
  isAdmin,
  ownerUsername,
  projectCount,
}: {
  id: string;
  title: string;
  thumbnailUrl: string;
  isFollowingDb: boolean;
  description: string;
  people: Profile[];
  dateModified: Date;
  followerCount: number;
  followers: Profile[];
  projects: ProjectWithOwner[];
  allowCollab: boolean;
  canEdit: boolean;
  currentUser?: string;
  dateCreated: Date;
  isAdmin: boolean;
  ownerUsername: string;
  projectCount: number;
}) {
  const [activeTab, setActiveTab] = useState<string | null>("projects");
  const [isFollowing, setIsFollowing] = useState(isFollowingDb);
  const [description, setDescription] = useState(descriptionDb);
  const [addUrl, setAddUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [allowCollab, setAllowCollab] = useState(allowCollabDb);
  const [title, setTitle] = useState(titleDb);

  const debounceSaveDesc = useDebouncedCallback(() => {
    changeClusterDescription(id, description);
  }, 2000);
  const debounceChangeAllowCollab = useDebouncedCallback(() => {
    changeCollabStatus(id, allowCollab);
  }, 1000);
  const debounceSaveTitle = useDebouncedCallback(() => {
    renameCluster(id, title);
  }, 2000);
  async function handleAdd() {
    setAdding(true);
    let pathname = "";
    try {
      pathname = new URL(addUrl).pathname;
    } catch {
      notifications.show({
        position: "top-right",
        withCloseButton: true,
        autoClose: false,
        title: "Please specify a valid project link",
        message:
          "It should start with https://code2connect.vercel.app/projects.",
        color: "red",
        icon: <XMarkIcon />,
      });
      setAdding(false);
      return;
    }
    const pathnamePages = pathname.split("/").filter(Boolean);
    let projectId;
    for (let i = pathnamePages.length - 1; i >= 0; i--) {
      if (validate(pathnamePages[i])) {
        projectId = pathnamePages[i];
        break;
      }
    }
    if (!projectId) {
      notifications.show({
        position: "top-right",
        withCloseButton: true,
        autoClose: false,
        title: "Please specify a valid project link",
        message:
          "It should start with https://code2connect.vercel.app/projects.",
        color: "red",
        icon: <XMarkIcon />,
      });
      setAdding(false);
      return;
    }
    try {
      await addProjectToCluster(id, projectId);
      setAdding(false);
      setAddUrl("");
    } catch (e) {
      setAdding(false);
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
  }

  async function handleFollowingToggle(newStatus: boolean) {
    if (!currentUser) return;
    if (!newStatus) {
      console.log("unfollowing");
      removeClusterFollower(id, currentUser);
    } else {
      console.log("following");
      addClusterFollower(id, currentUser);
    }
    setIsFollowing(!isFollowing);
  }

  async function thumbnailPickerModal() {
    const results = await getThumbnailSearchResults(title);
    modals.open({
      title: "Pick a thumbnail",
      children: (
        <ThumbnailPickerModal
          onComplete={(newUrl: string) => setClusterThumbnail(id, newUrl)}
          searchResults={results as PhotosWithTotalResults}
        />
      ),
      size: "auto",
    });
  }

  return (
    <div>
      <div className="flex flex-row pt-3 pb-3 gap-2 w-full h-full">
        <div className="flex flex-col gap-2 w-2/5 p-4 ml-16 h-full rounded-sm bg-offblue-700 border-r-1 border-offblue-800 text-white shadow-md shadow-offblue-900">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={thumbnailUrl ?? "/assets/placeholder-thumb.jpg"}
              height={135}
              width={240}
              alt="Project thumbnail"
              className="rounded-sm"
            />
          </AspectRatio>
          {canEdit ? (
            <TextInput
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                debounceSaveTitle();
              }}
              size="lg"
              min={1}
            />
          ) : (
            <Title order={2}>{title}</Title>
          )}
          {currentUser && (
            <div className="flex flex-row gap-2">
              <Button
                fullWidth
                leftSection={
                  isFollowing ? (
                    <XMarkIcon width={16} height={16} />
                  ) : (
                    <PlusIcon width={16} height={16} />
                  )
                }
                variant={isFollowing ? "filled" : "gradient"}
                color="red"
                gradient={{ from: "blue", to: "cyan", deg: 135 }}
                className="shadow-md"
                onClick={() => handleFollowingToggle(!isFollowing)}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
              {(canEdit || isAdmin) && (
                <Menu>
                  <Menu.Target>
                    <Button>
                      <EllipsisVerticalIcon
                        width={16}
                        height={16}
                        color="white"
                      />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<PhotoIcon width={16} height={16} />}
                      onClick={thumbnailPickerModal}
                    >
                      Change thumbnail
                    </Menu.Item>
                    <Menu.Sub>
                      <Menu.Sub.Target>
                        <Menu.Sub.Item c="red">Delete cluster</Menu.Sub.Item>
                      </Menu.Sub.Target>
                      <Menu.Sub.Dropdown>
                        <Menu.Item
                          leftSection={<TrashIcon width={16} height={16} />}
                          c="red"
                          onClick={() => deleteCluster(id)}
                        >
                          Yes, permanently delete this cluster
                        </Menu.Item>
                      </Menu.Sub.Dropdown>
                    </Menu.Sub>
                    {isAdmin && (
                      <>
                        <Menu.Item onClick={() => setClusterAsIotm(id)}>
                          Set as Idea of the Month
                        </Menu.Item>
                        <Menu.Item onClick={() => unsetClusterAsIotm(id)}>
                          Unset as Idea of the Month
                        </Menu.Item>
                      </>
                    )}
                  </Menu.Dropdown>
                </Menu>
              )}
            </div>
          )}
          <div className="flex-1 flex flex-row items-center gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <Bars3CenterLeftIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={4}>Description</Title>
          </div>
          {canEdit ? (
            <>
              <Textarea
                rows={8}
                value={description ?? ""}
                onChange={(e) => {
                  setDescription(e.target.value);
                  debounceSaveDesc();
                }}
              ></Textarea>
              <Checkbox
                label="Anyone can add projects"
                color="green"
                checked={allowCollab}
                onChange={(e) => {
                  setAllowCollab(e.target.checked);
                  debounceChangeAllowCollab();
                }}
              />
            </>
          ) : (
            <Textarea rows={8} value={description ?? ""} readOnly></Textarea>
          )}

          <div className="flex-1 flex flex-row items-center gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <UsersIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={4}>Followers</Title>
            <Avatar.Group>
              {followers.map((follower) => {
                console.log("cluster follower: " + follower.username);
                return (
                  <Tooltip
                    label={follower.username}
                    withArrow
                    key={follower.id}
                  >
                    <Avatar
                      name={follower.username}
                      size="md"
                      component="a"
                      href={`./${follower.username}`}
                    />
                  </Tooltip>
                );
              })}
              {followers.length >= 5 && (
                <Avatar size="md">+{followerCount - 5}</Avatar>
              )}
            </Avatar.Group>
          </div>
          <Divider />
          <div className="flex flex-row gap-2 items-center">
            <UserIcon width={16} height={16} />
            <Text>
              Created by{" "}
              <Anchor
                component={Link}
                href={`/profile/${ownerUsername}`}
                c="white"
              >
                {ownerUsername}
              </Anchor>
            </Text>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <CalendarIcon width={16} height={16} />
            <Text>Created {dateCreated.toLocaleString()}</Text>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <CalendarIcon width={16} height={16} />
            <Text>Last modified {dateModified.toLocaleString()}</Text>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <CodeBracketIcon width={16} height={16} />
            <Text>
              {projectCount} project{projectCount !== 1 && "s"}
            </Text>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <UsersIcon width={16} height={16} />
            <Text>
              {followerCount} follower{followerCount !== 1 && "s"}
            </Text>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-4/5 pr-16">
          <Tabs defaultValue="projects" onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab
                leftSection={<CodeBracketIcon width={16} height={16} />}
                value="projects"
              >
                Projects
              </Tabs.Tab>
              <Tabs.Tab
                leftSection={
                  <ChatBubbleBottomCenterIcon width={16} height={16} />
                }
                value="comments"
              >
                Comments
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
          {activeTab === "projects" && (
            <div className="flex flex-col gap-2">
              {((allowCollab && currentUser) || canEdit) && (
                <>
                  <Title order={3}>Add a project</Title>
                  <p>Paste a project URL here to add your project.</p>
                  <div className="flex flex-row gap-2">
                    <TextInput
                      type="text"
                      className="w-full"
                      value={addUrl}
                      onChange={(e) => setAddUrl(e.target.value)}
                      placeholder="http://code2connect.vercel.app/projects/2d2a4a59-5ad6-4221-a093-c5d99c1cbaad"
                    />
                    <Button onClick={handleAdd} loading={adding}>
                      <PlusIcon width={16} height={16} />
                    </Button>
                  </div>
                </>
              )}
              {projects.length === 0 && (
                <PlaceholderMessage>
                  <CodeBracketIcon
                    width={64}
                    height={64}
                    className="opacity-50"
                  />
                  <p>This cluster doesn't have any projects.</p>
                </PlaceholderMessage>
              )}
              <div className="flex flex-row gap-4 flex-wrap">
                {projects.map((project) => (
                  <ProjectCard
                    projectInfo={project}
                    key={project.id}
                    clusterId={id}
                    canRemoveFromCluster={
                      project.owner?.id === currentUser || canEdit
                    }
                  />
                ))}
              </div>

              <Pagination total={5} />
            </div>
          )}
          {activeTab === "comments" && <CommentModule />}
        </div>
      </div>
    </div>
  );
}
