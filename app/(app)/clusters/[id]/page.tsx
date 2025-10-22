import { getCluster } from "@/app/lib/data";
import ClusterUI from "@/components/clusters/cluster-ui";
import { notFound } from "next/navigation";

export default async function Cluster({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cluster = await getCluster(id);
  if (!cluster) notFound();

  return <ClusterUI
    id={cluster.id}
    title={cluster.title ?? ""}
    thumbnailUrl={cluster.thumbnail ?? ""}
    isFollowingDb={false}
    dateModified={cluster.dateModified}
    description={cluster.description}
    people={[]}
    followerCount={cluster._count.followers}
    projects={cluster.projects}
    followers={cluster.followers}
    allowCollab={cluster.allowCollab}
  />;
}
