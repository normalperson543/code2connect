import { getCluster, getProfile, isClusterFollower } from "@/app/lib/data";
import ClusterUI from "@/components/clusters/cluster-ui";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function Cluster({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cluster = await getCluster(id);
  if (!cluster) notFound();

  const session = await getSession();
  if (!session?.user) redirect("/auth/login");

  const userDb = await getProfile(session.user.id);
  let canEditInfo = false;
  let isFollower = false;
  let isAdmin = false;
  if (session.user?.id) {
    const currentProfile = await getProfile(session.user.id);
    if (currentProfile) {
      isAdmin = currentProfile.isAdmin;
    }
    canEditInfo = cluster.owner?.id === session.user.id || isAdmin;
    isFollower = await isClusterFollower(session.user.id, id);
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
      currentUser={session.user.id}
      comments={cluster.comments}
      cluster={cluster}
      currentUsername={userDb?.username as string}
      dateCreated={cluster.dateCreated}
      isAdmin={isAdmin}
      ownerUsername={cluster.owner?.username}
      ownerId={cluster.owner.id}
      projectCount={cluster._count.projects}
    />
  );
}
