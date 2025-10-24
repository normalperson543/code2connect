import ProfileUI from "@/components/profile/profile-ui";
import { createClient } from "@/lib/supabase/server";
import {
  getIsFollowing,
  getProfileReceivedComments,
  getProfileProjects,
  getProfile,
  cachedGetProfileWithUsername,
  getProfileClusters,
} from "@/app/lib/data";
import { getProfileFollowInfo } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const user = await cachedGetProfileWithUsername(id);

  if (!user) return {};
  return {
    title: `${user.username} on Code2Connect`,
    description: user.bio ?? "A user on Code2Connect",
  };
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profileAccessed = await cachedGetProfileWithUsername(id);
  if (!profileAccessed) notFound();
  const followInfo = await getProfileFollowInfo(id);
  const projects = await getProfileProjects(profileAccessed.id);
  const clusters = await getProfileClusters(profileAccessed.id)
  const receivedComments = await getProfileReceivedComments(id);
  let isFollowing = false;
  let currentProfile;
  if (user && user.id) {
    isFollowing = await getIsFollowing(id, user?.id as string);
    currentProfile = await getProfile(user?.id as string);
  }

  if (profileAccessed) {
    return (
      <ProfileUI
        accessedUserName={id}
        accessedProfile={profileAccessed}
        currentUser={user ? user.id : ""}
        accessedProfileFollowers={
          followInfo?.followers ? followInfo.followers : []
        }
        accessedProfileFollowersCount={
          followInfo?._count.followers ? followInfo._count.followers : 0
        }
        accessedProfileFollowing={
          followInfo?.following ? followInfo.following : []
        }
        accessedProfileFollowingCount={
          followInfo?._count.following ? followInfo._count.following : 0
        }
        accessedProfileProjects={projects ? projects : []}
        accessedProfileComments={receivedComments ? receivedComments : []}
        isFollowingDb={isFollowing}
        currentUsername={currentProfile?.username as string}
        accessedProfileClusters={clusters ? clusters : []}
      />
    );
  } else {
    if (!user) {
      throw new Error("Could not get current user.");
    } else if (!profileAccessed) {
      throw new Error("Could not get the profile being accessed");
    }
  }
}
