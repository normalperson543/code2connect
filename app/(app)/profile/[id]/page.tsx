import ProfileUI from "@/components/profile/profile-ui";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getProfileComments, getProfileFollowers, getProfileFollowersCount, getProfileFollowing, getProfileFollowingsCount, getProfileProjects } from "@/app/lib/data";
import { getProfileWithUsername } from "@/app/lib/data";


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

  const currentProfile = user ? await getProfile(user.id) : null;
  const profileAccessed = await getProfileWithUsername(id);
  const accessedFollowers = await getProfileFollowers(id);
  const accessedFollowings = await getProfileFollowing(id)
  const followersCount = await getProfileFollowersCount(id)
  const followingCount = await getProfileFollowingsCount(id)
  const projects = await getProfileProjects(id);
  const comments = await getProfileComments(id)

  console.log("projects: " + projects)
  console.log("followers: " + accessedFollowers)
  console.log("followings: " + accessedFollowings)
  console.log("comments: " + comments)

  if(user && currentProfile && profileAccessed) {
    return <ProfileUI 
      accessedUserName={id} 
      accessedProfile={profileAccessed} 
      currentUser={currentProfile}
      accessedProfileFollowers={accessedFollowers ? accessedFollowers : []}
      accessedProfileFollowersCount={followersCount ? followersCount : 0}
      accessedProfileFollowing={accessedFollowings ? accessedFollowings : []}
      accessedProfileFollowingCount={followingCount ? followingCount : 0}
      accessedProfileProjects={projects ? projects : []}
      accessedProfileComments={comments ? comments : []}
      />;
  } else {
    if(!user) {
      throw new Error("Could not get current user.")
    } else if (!currentProfile) {
      throw new Error("Could not get current profile.")
    } else if (!profileAccessed) {
      throw new Error("Could not get the profile being accessed")
    }
  }
}
