import ProfileUI from "@/components/profile/profile-ui";
import { createClient } from "@/lib/supabase/server";
import {
  getIsFollowing,
  getProfileReceivedComments,
  getProfileProjects,
} from "@/app/lib/data";
import { getProfileWithUsername } from "@/app/lib/data";
import { getProfileFollowInfo } from "@/app/lib/data";
import { notFound } from "next/navigation";

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
  const profileAccessed = await getProfileWithUsername(id);
  if (!profileAccessed) notFound();
  const followInfo = await getProfileFollowInfo(id);
  const projects = await getProfileProjects(profileAccessed.id);
  const receivedComments = await getProfileReceivedComments(id);
  const isFollowing = await getIsFollowing(id, user?.id as string);

  console.log("projects: " + projects);

  if (user && profileAccessed) {
    return (
      <ProfileUI
        accessedUserName={id}
        accessedProfile={profileAccessed}
        currentUser={user.id}
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
