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
} from "@mantine/core";
import CommentModule from "../comment-module";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Bars3CenterLeftIcon,
  CalendarIcon,
  ChatBubbleBottomCenterIcon,
  CodeBracketIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { placeholder } from "@/app/lib/constants";
import ProjectCard from "../project-card";
import MiniProfile from "../mini-profile";
import Image from "next/image";
import { Profile } from "@prisma/client";
import { ProjectWithOwner } from "@/app/lib/projects";
import { useDebouncedCallback } from "use-debounce";
import { changeClusterDescription } from "@/app/lib/actions";
import PlaceholderMessage from "../placeholder-message";

export default function ClusterUI({
  id,
  title,
  thumbnailUrl,
  isFollowingDb,
  description: descriptionDb,
  people,
  dateModified,
  followerCount,
  followers,
  projects,
  allowCollab,
  canEdit,
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
}) {
  const [activeTab, setActiveTab] = useState<string | null>("projects");
  const [isFollowing, setIsFollowing] = useState(isFollowingDb);
  const [description, setDescription] = useState(descriptionDb);

  const debounceSaveDesc = useDebouncedCallback(() => {
    changeClusterDescription(id, description);
  }, 2000);
  return (
    <div>
      <div className="flex flex-row pt-3 pb-3 gap-2 w-full h-full">
        <div className="flex flex-col gap-2 w-2/5 p-4 ml-16 h-full rounded-sm bg-offblue-700 border-r-1 border-offblue-800 text-white shadow-md shadow-offblue-900">
          <AspectRatio ratio={16 / 9}>
            <Image
              src="/assets/default-image.png"
              height={135}
              width={240}
              alt="Project thumbnail"
              className="rounded-sm"
            />
          </AspectRatio>
          <Title order={2}>{title}</Title>
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
            gradient={{ from: "blue", to: "cyan", deg: 135 }}
            className="shadow-md"
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
          <div className="flex-1 flex flex-row items-center gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <Bars3CenterLeftIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={4}>Description</Title>
          </div>
          <Textarea
            rows={8}
            value={description ?? ""}
            onChange={(e) => {
              setDescription(e.target.value);
              debounceSaveDesc();
            }}
          ></Textarea>
          <Checkbox label="Anyone can add projects" color="green" />
          <div className="flex-1 flex flex-row items-center gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <UsersIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={4}>People</Title>
            <Avatar.Group>
              <Tooltip label="username" withArrow>
                <Avatar size="md" />
              </Tooltip>
              <Tooltip label="username" withArrow>
                <Avatar size="md" />
              </Tooltip>
              <Tooltip label="username" withArrow>
                <Avatar size="md" />
              </Tooltip>
              <Tooltip label="username" withArrow>
                <Avatar size="md" />
              </Tooltip>
              <Tooltip label="username" withArrow>
                <Avatar size="md" />
              </Tooltip>
              <Avatar size="md">+5</Avatar>
            </Avatar.Group>
          </div>
          <Divider />
          <div className="flex flex-row gap-2 items-center">
            <CalendarIcon width={16} height={16} />
            <Text>Last modified {new Date().toLocaleString()}</Text>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <UsersIcon width={16} height={16} />
            <Text>{followerCount} followers</Text>
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
              <Title order={3}>Add a project</Title>
              <p>
                Enter a project ID (e.g. 85d9e8ee-d63d-4898-80d3-ed18491cbd27)
              </p>
              <div className="flex flex-row gap-2">
                <TextInput type="text" className="w-full" />
                <Button>
                  <PlusIcon width={16} height={16} />
                </Button>
              </div>
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
                  <ProjectCard projectInfo={project} />
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
