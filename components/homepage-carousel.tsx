"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";
import { Project } from "@/app/lib/projects";
import { Anchor, AspectRatio, Avatar, Card, Title } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";

function ProjectCard({ projectInfo }: { projectInfo: Project }) {
  return (
    <Card
      shadow="md"
      padding="lg"
      radius="md"
      ml="xs"
      mr="xs"
      bg="black"
      c="white"
      className="min-w-120"
      withBorder
    >
      <Card.Section>
        <AspectRatio ratio={16 / 9}>
          <Image
            src={projectInfo.thumbnail}
            height={135}
            width={240}
            alt="Project thumbnail"
          />
        </AspectRatio>
      </Card.Section>
      <div className="flex flex-col items-start gap-2 mt-4">
        <Title order={5}>{projectInfo.name}</Title>
        <div className="flex flex-row gap-2 items-center">
          <Avatar size="sm" />
          <Link href={`/profile/${projectInfo.owner.username}`}>
            <Anchor component="button">{projectInfo.owner.username}</Anchor>
          </Link>
        </div>
      </div>
    </Card>
  );
}
export default function HomepageCarousel({
  projects,
}: {
  projects: Project[];
}) {
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  return (
    <Carousel
      withIndicators
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={() => autoplay.current.play()}
    >
      {projects.map((project) => (
        <ProjectCard projectInfo={project} key={project.id} />
      ))}
    </Carousel>
  );
}
