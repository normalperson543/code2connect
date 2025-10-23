"use client";
import { Carousel } from "@mantine/carousel";
import { ClusterWithOwner } from "@/app/lib/cluster-types";
import ClusterCard from "./clusters/cluster-card";

export default function ClusterCarousel({
  clusters,
}: {
  clusters: ClusterWithOwner[];
}) {
  return (
    <Carousel
      controlsOffset="sm"
      controlSize={26}
      withControls
      className="flex flex-row gap-2 w-full"
    >
      {clusters.map((cluster) => (
        <span className="ml-1 mr-1" key={cluster.id}>
          <ClusterCard
            clusterInfo={cluster}
            projectCount={cluster._count.projects}
          />
        </span>
      ))}
    </Carousel>
  );
}
