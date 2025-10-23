"use client";
import { Carousel } from "@mantine/carousel";
import ProjectCard from "./project-card";
import { ProjectWithOwner } from "@/app/lib/projects";

export default function ProjectCarousel({
  projects,
}: {
  projects: ProjectWithOwner[];
}) {
  return (
    <Carousel
      controlsOffset="sm"
      controlSize={26}
      withControls
      className="flex flex-row gap-2 w-full"
    >
      {projects.map((project) => (
        <span className="ml-1 mr-1" key={project.id}>
          <ProjectCard projectInfo={project} />
        </span>
      ))}
    </Carousel>
  );
}
