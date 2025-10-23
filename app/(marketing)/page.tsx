import Home from "@/components/home";
import {
  getFeatured,
  getHomeProfileInfo,
  getIotm,
  getTopLiked,
} from "../lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const authUserId = user.data.user?.id;

  const featured = await getFeatured();
  const topLiked = await getTopLiked();

  if (!user || !authUserId)
    return <Home featured={featured} topLiked={topLiked} />;

  const profile = await getHomeProfileInfo(authUserId);

  const iotm = await getIotm();

  if (!profile) return <Home featured={featured} topLiked={topLiked} />;

  return (
    <Home
      username={profile.username}
      projectCount={profile._count.projects}
      clusterCount={profile._count.clusters}
      followerCount={profile._count.followers}
      followingCount={profile._count.following}
      featured={featured}
      topLiked={topLiked}
      iotmClusterInfo={iotm}
    />
  );
}
