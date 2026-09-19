import Home from "@/components/home";
import {
  getFeatured,
  getHomeProfileInfo,
  getIotm,
  getTopLiked,
} from "../lib/data";
import { getSession } from "@/lib/session";

export default async function HomePage() {
  const session = await getSession();
  const authUserId = session?.user?.id;

  const featured = await getFeatured();
  const topLiked = await getTopLiked();

  if (!session?.user || !authUserId)
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
