"use client";
import ProjectCard from "../project-card";
import {
  Avatar,
  Text,
  Pagination,
  Title,
  Button,
  ThemeIcon,
  Divider,
  Tooltip,
  Textarea,
  Tabs,
} from "@mantine/core";
import { useState } from "react";
import {
  ChatBubbleBottomCenterIcon,
  CodeBracketIcon,
  StarIcon,
  UsersIcon,
  UserPlusIcon,
  XMarkIcon,
  CheckIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import CommentModule from "../comment-module";
import { Comment, Profile, Project } from "@prisma/client";
import {
  addProfileFollower,
  editProfileBio,
  removeProfileFollower,
} from "@/app/lib/actions";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";
import { notifications } from "@mantine/notifications";
import MiniProfile from "../mini-profile";

export default function ProfileUI({
  accessedUserName,
  accessedProfile,
  currentUser,
  accessedProfileFollowers,
  accessedProfileFollowersCount,
  accessedProfileFollowing,
  accessedProfileFollowingCount,
  accessedProfileProjects,
  accessedProfileComments,
  isFollowingDb,
}: {
  accessedUserName: string;
  accessedProfile: Profile;
  currentUser: string;
  accessedProfileFollowers: Profile[];
  accessedProfileFollowersCount: number;
  accessedProfileFollowing: Profile[];
  accessedProfileFollowingCount: number;
  accessedProfileProjects: Project[];
  accessedProfileComments: Comment[];
  isFollowingDb: boolean;
}) {
  const [bio, setBio] = useState(accessedProfile.bio);
  const [isFollowing, setIsFollowing] = useState(isFollowingDb);
  const [activePage, setPage] = useState(1);

  const startIndex = (activePage - 1) * 9;
  const endIndex = startIndex + 9;
  const displayedProjects = accessedProfileProjects.slice(startIndex, endIndex);
  const followersToShow = accessedProfileFollowers.slice(0, 5)
  const followingToShow = accessedProfileFollowing.slice(0, 5)


  async function handleSaveBio() {
    const userId = currentUser;

    try {
      editProfileBio(userId, bio);
    } catch (error) {
      throw error;
    }
  }

  const debounceSave = useDebouncedCallback(async () => {
    try {
      await handleSaveBio();
      notifications.show({
        position: "top-right",
        withCloseButton: true,
        autoClose: true,
        title: "Bio saved successfully!",
        message: "Your bio has been saved.",
        color: "green",
        icon: <CheckIcon />,
      });
    } catch (e) {
      notifications.show({
        position: "top-center",
        withCloseButton: true,
        autoClose: false,
        title: "There was a problem saving your bio",
        message: `Your bio didn't save properly. Please try again later. Error info: ${e instanceof Error ? e.message : "Unknown error"}`,
        color: "red",
        icon: <XMarkIcon />,
      });
    }
  }, 2000);

  function handleChangeBio(newBio: string) {
    setBio(newBio);
    debounceSave();
  }

  async function handleFollowingToggle(newStatus: boolean) {
    if (!newStatus) {
      removeProfileFollower(accessedProfile.id, currentUser);
    } else {
      addProfileFollower(accessedProfile.id, currentUser);
    }
    setIsFollowing(!isFollowing);
  }
  return (
    <div>
      <div className="flex flex-row pt-3 pb-3 gap-2 w-full h-full">
        <div className="flex flex-col gap-2 w-2/5 p-4 ml-16 h-full rounded-sm bg-offblue-700 border-r-1 border-offblue-800 text-white shadow-md shadow-offblue-900">
          <div className="flex flex-row gap-2">
            <Avatar name={accessedUserName} size="md" bg="white" />
            <Title order={2}>{accessedUserName}</Title>
          </div>
          <div className="flex flex-row gap-2">
            {accessedProfile.id === currentUser || !currentUser ? (
              <div></div>
            ) : (
              <Button
                fullWidth
                leftSection={<UserPlusIcon width={16} height={16} />}
                variant={isFollowing ? "" : "gradient"}
                color="red"
                gradient={{ from: "blue", to: "cyan", deg: 135 }}
                className="shadow-md"
                onClick={() => handleFollowingToggle(!isFollowing)}
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
          {accessedProfile.id === currentUser ? (
            <Textarea
              rows={8}
              placeholder="Who are you? What do you want people to know about you?"
              value={bio}
              onChange={(e) => {
                const target = e.target as HTMLTextAreaElement;
                handleChangeBio(target.value);
              }}
            ></Textarea>
          ) : (
            <Textarea value={bio} readOnly rows={8} variant="filled" />
          )}
          {accessedProfileFollowers.length > 0 && (
            <div className="flex-1 flex flex-row items-center gap-2">
              <ThemeIcon radius="xl" className="shadow-md">
                <UsersIcon width={16} height={16} />
              </ThemeIcon>
              <Title order={4}>Followers</Title>
              <Avatar.Group>
                {followersToShow.map((follower) => {
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
                        href={"./" + follower.username}
                      />
                    </Tooltip>
                  );
                })}
                {accessedProfileFollowers.length >= 5 && (
                  <Avatar size="md">+{accessedProfileFollowersCount - 5}</Avatar>
                )}
              </Avatar.Group>
            </div>
          )}
          {accessedProfileFollowing.length > 0 && (
            <div className="flex-1 flex flex-row items-center gap-2">
              <ThemeIcon radius="xl" className="shadow-md">
                <UserPlusIcon width={16} height={16} />
              </ThemeIcon>
              <Title order={4}>Following</Title>
              <Avatar.Group>
                {followingToShow.map((following) => {
                  return (
                    <Tooltip
                      label={following.username}
                      withArrow
                      key={following.id}
                    >
                      <Avatar
                        name={following.username}
                        size="md"
                        component="a"
                        href={"./" + following.username}
                      />
                    </Tooltip>
                  );
                })}
                {accessedProfileFollowing.length >= 5 && (
                  <Avatar size="md">+{accessedProfileFollowersCount - 5}</Avatar>
                )}
              </Avatar.Group>
            </div>
          )}
          <Divider />
          <div className="flex flex-row gap-2 items-center">
            <UsersIcon width={16} height={16} />
            <p>{accessedProfileFollowersCount} followers</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <UserPlusIcon width={16} height={16} />
            <p>{accessedProfileFollowingCount} following</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <CalendarIcon width={16} height={16} />
            <p>Joined {accessedProfile.dateCreated.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-4/5 pr-16 pl-3">
          <Tabs defaultValue="projects">
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

            <Tabs.Panel value="projects" mt="md">
              {displayedProjects.length === 0 && (
                <div className="flex flex-1 flex-col gap-2 items-center justify-center text-center p-4 border-dashed border-offblue-200 border-4 bg-offblue-50 rounded-sm h-full">
                  <CodeBracketIcon
                    width={64}
                    height={64}
                    className="opacity-50"
                  />
                  <p>This user doesn&apos;t have any projects.</p>
                </div>
              )}
              <div>
                <div className="grid [grid-template-columns:repeat(3,auto)] gap-4 mt-3 justify-start">
                  {displayedProjects.map((project) => (
                    <ProjectCard
                      projectInfo={project}
                      isOwner={accessedProfile.id === currentUser}
                      key={project.id}
                    />
                  ))}
                </div>
              </div>
              {accessedProfileProjects.length <= 9 ? (
                <div></div>
              ) : (
                <Pagination
                  total={Math.trunc(accessedProfileProjects.length / 9) + 1}
                  value={activePage}
                  onChange={setPage}
                  mt="lg"
                />
              )}
            </Tabs.Panel>

            <Tabs.Panel value="comments" mt="sm">
              <CommentModule
                comments={accessedProfileComments}
                currentUser={currentUser}
                accessedProfile={accessedProfile}
                accessedUsername={accessedUserName}
                commentsPerPage={3}
              />
            </Tabs.Panel>

            <Tabs.Panel value="followers" mt="sm">
              <div className="flex flex-row flex-wrap gap-2">
                {accessedProfileFollowers.length === 0 && (
                  <div className="flex flex-1 flex-col gap-2 items-center justify-center text-center p-4 border-dashed border-offblue-200 border-4 bg-offblue-50 rounded-sm h-full">
                    <UsersIcon width={64} height={64} className="opacity-50" />
                    <p>This user doesn&apos;t have any followers.</p>
                  </div>
                )}
                {accessedProfileFollowers.map((follower) => {
                  return (
                    <MiniProfile
                      username={follower.username}
                      key={follower.id}
                    />
                  );
                })}
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="following" mt="sm">
              <div className="flex flex-row flex-wrap gap-2">
                {accessedProfileFollowing.length === 0 && (
                  <div className="flex flex-1 flex-col gap-2 items-center justify-center text-center p-4 border-dashed border-offblue-200 border-4 bg-offblue-50 rounded-sm h-full">
                    <UserPlusIcon
                      width={64}
                      height={64}
                      className="opacity-50"
                    />
                    <p>This user isn&apos;t following anyone.</p>
                  </div>
                )}
                {accessedProfileFollowing.map((following) => {
                  return (
                    <MiniProfile
                      username={following.username}
                      key={following.id}
                    />
                  );
                })}
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
