import Home from "@/components/home";
import { getHomeProfileInfo } from "../lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const authUserId = user.data.user?.id;

  if (!user || !authUserId) return <Home />;

  const profile = await getHomeProfileInfo(authUserId);

  if (!profile) return <Home />;
  
  return (
    <Home
      username={profile.username}
      projectCount={profile._count.projects}
      clusterCount={profile._count.clusters}
      followerCount={profile._count.followers}
      followingCount={profile._count.following}
    />
  );
}
