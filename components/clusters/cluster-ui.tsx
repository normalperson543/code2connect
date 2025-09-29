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
} from "@mantine/core";
import CommentModule from "../comment-module";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Bars3CenterLeftIcon,
  CalendarIcon,
  ChatBubbleBottomCenterIcon,
  ClipboardIcon,
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

function MiniProfileManagerWrapper({ username }: { username: string }) {
  return (
    <MiniProfile
      username={username}
      topRightComponent={
        <Menu position="bottom-end">
          <Menu.Target>
            <Button variant="subtle">
              <EllipsisVerticalIcon width={16} height={16} />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<ArrowDownIcon width={16} height={16} />}
              c="red"
            >
              Demote
            </Menu.Item>
            <Menu.Item
              leftSection={<XMarkIcon width={16} height={16} />}
              c="red"
            >
              Remove from cluster
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      }
    />
  );
}
function MiniProfileMemberWrapper({ username }: { username: string }) {
  return (
    <MiniProfile
      username={username}
      topRightComponent={
        <Menu position="bottom-end">
          <Menu.Target>
            <Button variant="subtle">
              <EllipsisVerticalIcon width={16} height={16} />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<ArrowUpIcon width={16} height={16} />}>
              Promote
            </Menu.Item>
            <Menu.Item
              leftSection={<XMarkIcon width={16} height={16} />}
              c="red"
            >
              Remove from cluster
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      }
    />
  );
}
export default function ClusterUI() {
  const [activeTab, setActiveTab] = useState<string | null>("projects");
  return (
    <div>
      <div className="flex flex-row pt-3 pb-3 gap-2 w-full h-full">
        <div className="flex flex-col gap-2 w-1/5 p-4 ml-16 h-full rounded-sm bg-offblue-700 border-r-1 border-offblue-800 text-white shadow-md">
          <AspectRatio ratio={16 / 9}>
            <Image
              src="/assets/default-image.png"
              height={135}
              width={240}
              alt="Project thumbnail"
              className="rounded-sm"
            />
          </AspectRatio>
          <Title order={2}>Number Games</Title>
          <div className="flex flex-row gap-2">
            <Button
              fullWidth
              leftSection={<PlusIcon width={16} height={16} />}
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 135 }}
              className="shadow-md"
            >
              Follow
            </Button>
            <Button
              color="red"
              gradient={{ from: "blue", to: "cyan", deg: 135 }}
              className="shadow-md"
            >
              <ExclamationTriangleIcon width={16} height={16} />
            </Button>
          </div>
          <div className="flex-1 flex flex-row items-center gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <Bars3CenterLeftIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={4}>Description</Title>
          </div>
          <Textarea rows={8}></Textarea>
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
            <Text>Last modified {new Date().toLocaleDateString()}</Text>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <UsersIcon width={16} height={16} />
            <Text>63 followers</Text>
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
              <Tabs.Tab
                leftSection={<UserIcon width={16} height={16} />}
                value="members"
              >
                Members
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
          {activeTab === "projects" && (
            <div>
              <div className="flex flex-row gap-4 flex-wrap">
                {placeholder.map((project) => (
                  <ProjectCard projectInfo={project} />
                ))}
              </div>

              <Pagination total={5} />
            </div>
          )}
          {activeTab === "comments" && <CommentModule />}
          {activeTab === "members" && (
            <div className="flex flex-col gap-2">
              <Title order={4} className="flex flex-row gap-2 items-center">
                Owners <Badge>10</Badge>
              </Title>
              <div className="flex flex-row flex-wrap gap-2">
                <MiniProfileManagerWrapper username="normalperson543" />
                <MiniProfileManagerWrapper username="normalperson543" />
                <MiniProfileManagerWrapper username="normalperson543" />
                <MiniProfileManagerWrapper username="normalperson543" />
                <MiniProfileManagerWrapper username="normalperson543" />
                <MiniProfileManagerWrapper username="normalperson543" />
                <MiniProfileManagerWrapper username="normalperson543" />
                <MiniProfileManagerWrapper username="normalperson543" />
                <MiniProfileManagerWrapper username="normalperson543" />
                <MiniProfileManagerWrapper username="normalperson543" />
              </div>
              <Title order={4} className="flex flex-row gap-2 items-center">
                Members <Badge>10</Badge>
              </Title>
              <div className="flex flex-row flex-wrap gap-2">
                <MiniProfileMemberWrapper username="normalperson543" />
                <MiniProfileMemberWrapper username="normalperson543" />
                <MiniProfileMemberWrapper username="normalperson543" />
                <MiniProfileMemberWrapper username="normalperson543" />
                <MiniProfileMemberWrapper username="normalperson543" />
                <MiniProfileMemberWrapper username="normalperson543" />
                <MiniProfileMemberWrapper username="normalperson543" />
                <MiniProfileMemberWrapper username="normalperson543" />
                <MiniProfileMemberWrapper username="normalperson543" />
                <MiniProfileMemberWrapper username="normalperson543" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
