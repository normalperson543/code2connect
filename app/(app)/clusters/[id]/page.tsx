import { getCluster, getProfile, isClusterFollower } from "@/app/lib/data";
import ClusterUI from "@/components/clusters/cluster-ui";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function Cluster({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cluster = await getCluster(id);
  if (!cluster) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const userDb = await getProfile(user.id as string);
  let canEditInfo = false;
  let isFollower = false;
  let isAdmin = false;
  if (user && user.id) {
    const currentProfile = await getProfile(user?.id as string);
    if (currentProfile) {
      isAdmin = currentProfile.isAdmin;
    }
    canEditInfo = cluster.owner?.id === (user?.id as string) || isAdmin;
    isFollower = await isClusterFollower(user.id, id);
  }

  return (
    <ClusterUI
      id={cluster.id}
      title={cluster.title ?? ""}
      thumbnailUrl={cluster.thumbnail ?? ""}
      isFollowingDb={isFollower}
      dateModified={cluster.dateModified}
      description={cluster.description}
      people={[]}
      followerCount={cluster._count.followers}
      projects={cluster.projects}
      followers={cluster.followers}
      allowCollab={cluster.allowCollab}
      canEdit={canEditInfo}
      currentUser={user?.id}
      comments={cluster.comments}
      cluster={cluster}
      currentUsername={userDb?.username as string}
      dateCreated={cluster.dateCreated}
      isAdmin={isAdmin}
      ownerUsername={cluster.owner?.username}
      projectCount={cluster._count.projects}
    />
  );
}
