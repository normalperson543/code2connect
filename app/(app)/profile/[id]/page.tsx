import ProfileUI from "@/components/profile/profile-ui";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/app/lib/data";
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

  if(user && currentProfile && profileAccessed) {
    return <ProfileUI accessedUserName={id} accessedProfile={profileAccessed} currentUser={currentProfile}/>;
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
