"use client";
import { Project } from "@/app/lib/projects";
import { Carousel } from "@mantine/carousel";
import ProjectCard from "./project-card";
export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  return (
    <Carousel
      controlsOffset="sm"
      controlSize={26}
      withControls
      className="flex flex-row gap-2 w-full"
    >
      {projects.map((project) => (
        <span className="ml-1 mr-1">
          <ProjectCard projectInfo={project} />
        </span>
      ))}
    </Carousel>
  );
}
