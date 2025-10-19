"use client";
import { placeholder } from "@/app/lib/constants";
import ProjectCard from "../project-card";
import {
  Avatar,
  Text,
  Pagination,
  Paper,
  Title,
  Button,
  Menu,
  ThemeIcon,
  Divider,
  Tooltip,
  Textarea,
  Tabs,
} from "@mantine/core";
import { useState } from "react";
import { Carousel } from "@mantine/carousel";
import ProjectCarousel from "../project-carousel";
import {
  Bars3CenterLeftIcon,
  CalendarIcon,
  ChatBubbleBottomCenterIcon,
  ChatBubbleOvalLeftIcon,
  ChevronDownIcon,
  CodeBracketIcon,
  ExclamationTriangleIcon,
  ShareIcon,
  StarIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import CommentModule from "../comment-module";
import BHeading from "../heading";
import { UserPlus } from "lucide-react";
import { Profile } from "@prisma/client";
import { editProfileBio } from "@/app/lib/actions";
import { useDebouncedCallback } from "use-debounce";

export default function ProfileUI({accessedUserName, accessedProfile, currentUser}: {accessedUserName: string, accessedProfile: Profile, currentUser: Profile}) {
  const [activeTab, setActiveTab] = useState<string | null>("projects");
  const [bio, setBio] = useState(accessedProfile.bio)
  const [isSavingBio, setIsSavingBio] = useState<boolean>(false);

  async function handleSave() {
    setIsSavingBio(true)
    const userId = profileData.id
    
    try {
      editProfileBio(userId, bio)
    } catch (error) {
      throw error
    }
    setIsSavingBio(false)
  }

  const debounceSave = useDebouncedCallback(() => {
    handleSave();
  }, 2000);

  function handleChangeBio(newBio: string) {
    setBio(newBio)
    debounceSave();
  }

  return (
    <div>
      <div className="flex flex-row pt-3 pb-3 gap-2 w-full h-full">
        <div className="flex flex-col gap-2 w-2/5 p-4 ml-16 h-full rounded-sm bg-offblue-700 border-r-1 border-offblue-800 text-white shadow-md">
          <div className="flex flex-row gap-2">
            <Avatar size="md" />
            <Title order={2}>{accessedUserName}</Title>
          </div>
          <div className="flex flex-row gap-2">
            <Button
              fullWidth
              leftSection={<UserPlus width={16} height={16} />}
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 135 }}
              className="shadow-md"
            >
              Follow
            </Button>
            <Menu position="bottom-end">
              <Menu.Target>
                <Button variant="subtle" c="off-blue.6">
                  <EllipsisVerticalIcon
                    color="white"
                    width={16}
                    height={16}
                    className="shadow-md"
                  />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<ShareIcon width={16} height={16} />}>
                  Share
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <ExclamationTriangleIcon width={16} height={16} />
                  }
                  c="red"
                >
                  Report
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
          <div className="flex-1 flex flex-row items-center gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <StarIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={4}>Bio</Title>
          </div>
          <Textarea 
            rows={8} 
            placeholder="Who are you? Wat do you want people to know about you?" 
            value={bio}
            onChange={(e) => {
              const target = e.target as HTMLTextAreaElement;
              handleChangeBio(target.value)
            }}
            ></Textarea>
          <div className="flex-1 flex flex-row items-center gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <UsersIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={4}>Followers</Title>
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
              <Avatar size="md">+48</Avatar>
            </Avatar.Group>
          </div>
          <div className="flex-1 flex flex-row items-center gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <UserPlusIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={4}>Following</Title>
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
              <Avatar size="md">+8</Avatar>
            </Avatar.Group>
          </div>
          <Divider />
          <div className="flex flex-row gap-2 items-center">
            <UsersIcon width={16} height={16} />
            <Text>58 followers</Text>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <UserPlusIcon width={16} height={16} />
            <Text>19 following</Text>
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
                leftSection={<UsersIcon width={16} height={16} />}
                value="followers"
              >
                Followers
              </Tabs.Tab>
              <Tabs.Tab
                leftSection={<UsersIcon width={16} height={16} />}
                value="following"
              >
                Following
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
