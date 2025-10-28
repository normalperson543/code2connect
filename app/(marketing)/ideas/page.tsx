import { getCluster } from "@/app/lib/data";
import IdeasMarketingUI from "@/components/ideas/ideas-ui";

export default async function Ideas() {
  const cluster = await getCluster(process.env.STARTER_CLUSTER_ID as string);
  const projects = cluster?.projects;
  return <IdeasMarketingUI projects={projects} />;
}
