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
import { useEffect, useState } from "react";
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
import { Comment, Profile, Project } from "@prisma/client";
import { addProfileFollower, addProfileFollowing, editProfileBio, removeProfileFollower, removeProfileFollowing } from "@/app/lib/actions";
import { useDebouncedCallback } from "use-debounce";
import { getIsFollower, getIsFollowing } from "@/app/lib/data";

export default function ProfileUI({accessedUserName, 
    accessedProfile, 
    currentUser, 
    accessedProfileFollowers, 
    accessedProfileFollowersCount, 
    accessedProfileFollowing, 
    accessedProfileFollowingCount,
    accessedProfileProjects,
    accessedProfileComments,
  }: {
    accessedUserName: string, 
    accessedProfile: Profile, 
    currentUser: Profile, 
    accessedProfileFollowers: Profile[], 
    accessedProfileFollowersCount: number, 
    accessedProfileFollowing: Profile[], 
    accessedProfileFollowingCount: number,
    accessedProfileProjects: Project[],
    accessedProfileComments: Comment[]
  }) {

  const [activeTab, setActiveTab] = useState<string | null>("projects");
  const [bio, setBio] = useState(accessedProfile.bio)
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  if(currentUser.id !== accessedProfile.id) {
    useEffect(() => {
      let active = true;

      async function checkFollowStatus() {
        try {
          const result = await getIsFollowing(currentUser.id, accessedProfile.id)
          console.log("redult: " + result)
          if(active) setIsFollowing(result)
        } catch (error) {
          throw error
        }
      }

      checkFollowStatus()
      console.log(isFollowing)

      return () => {
        active = false;
      };
    }, [currentUser, accessedProfile])
  }

  async function handleSaveBio() {
    setIsSaving(true)
    const userId = currentUser.id
    
    try {
      editProfileBio(userId, bio)
    } catch (error) {
      throw error
    }
    setIsSaving(false)
  }

  const debounceSave = useDebouncedCallback(() => {
    handleSaveBio();
  }, 2000);

  function handleChangeBio(newBio: string) {
    setBio(newBio)
    debounceSave();
  }

  async function followProfile() {
    addProfileFollower(accessedProfile.id, currentUser.id)
    addProfileFollowing(currentUser.id, accessedProfile.id)
  }

  const debounceFollow = useDebouncedCallback(() => {
    followProfile();
  }, 2000)

  async function unfollowProfile() {
    removeProfileFollower(accessedProfile.id, currentUser.id)
    removeProfileFollowing(currentUser.id, accessedProfile.id)
  }

  const debounceUnfollow = useDebouncedCallback(() => {
    unfollowProfile();
  }, 2000)

  function handleFollowToggle() {
    console.log("following status2: " + isFollowing)

    if(isFollowing) {
      setIsFollowing(false)
      debounceUnfollow()
    } else {
      setIsFollowing(true)
      debounceFollow()
    }

    console.log("following status3: " + isFollowing)
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
            {accessedProfile.id === currentUser.id ? (
              <div></div>
            ): (
              <Button
                fullWidth
                leftSection={<UserPlus width={16} height={16} />}
                variant="gradient"
                gradient={{ from: "blue", to: "cyan", deg: 135 }}
                className="shadow-md"
                onClick={(e) => handleFollowToggle()}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
          <div className="flex-1 flex flex-row items-center gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <StarIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={4}>Bio</Title>
          </div>
          {accessedProfile.id === currentUser.id ? (
            <Textarea 
            rows={8} 
            placeholder="Who are you? Wat do you want people to know about you?" 
            value={bio}
            onChange={(e) => {
              const target = e.target as HTMLTextAreaElement;
              handleChangeBio(target.value)
            }}
            ></Textarea>
          ) : (
            <Textarea
              value={bio}
              readOnly
              rows={8}
              variant="filled"
            />
          )}
          
          <div className="flex-1 flex flex-row items-center gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <UsersIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={4}>Followers</Title>
            <Avatar.Group>
              {accessedProfileFollowers.map(follower => {
                return (
                  <Tooltip label={follower.username} withArrow>
                    <Avatar size="md" />
                  </Tooltip>
                )
              })}
              {/*{!accessedProfileFollowersCount || accessedProfileFollowersCount < 6 ? (
                <div></div>
              ): (
                <Avatar size="md">+{accessedProfileFollowersCount - 5}</Avatar>
              )}*/}
            </Avatar.Group>
          </div>
          <div className="flex-1 flex flex-row items-center gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <UserPlusIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={4}>Following</Title>
            <Avatar.Group>
              {accessedProfileFollowing.map(following => {
                return (
                  <Tooltip label={following.username} withArrow>
                    <Avatar size="md" />
                  </Tooltip>
                )
              })}
              {/*{!accessedProfileFollowingCount || accessedProfileFollowingCount < 6 ? (
                <div></div>
              ): (
                <Avatar size="md">+{accessedProfileFollowingCount - 5}</Avatar>
              )}*/}
            </Avatar.Group>
          </div>
          <Divider />
          <div className="flex flex-row gap-2 items-center">
            <UsersIcon width={16} height={16} />
            <Text>{accessedProfileFollowersCount} followers</Text>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <UserPlusIcon width={16} height={16} />
            <Text>{accessedProfileFollowingCount} following</Text>
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

            <Tabs.Panel value="projects">
              {accessedProfileProjects.map(project => <ProjectCard projectInfo={project}/>)}
            </Tabs.Panel>

            <Tabs.Panel value="comments">
              <CommentModule comments={accessedProfileComments}/>
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
