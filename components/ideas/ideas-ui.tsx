import { ProjectWithOwner } from "@/app/lib/projects";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { Title, Text, ThemeIcon, Button } from "@mantine/core";
import ProjectCard from "../project-card";
import { BoltIcon } from "@heroicons/react/20/solid";
import CreateButton from "../create-wrapper";

export default function IdeasMarketingUI({
  projects,
}: {
  projects?: ProjectWithOwner[];
}) {
  return (
    <div className="flex flex-col gap-2 justify-center">
      <div className="pt-24 pb-24 pl-12 pr-12 spacing-between gap-4 bg-gradient-to-b from-offblue-200 to-white flex flex-row">
        <div className="flex flex-col gap-4 justify-center text-center w-full">
          <Text className="uppercase" c="dimmed">
            Free Python code editor, tutorials, and resources
          </Text>
          <Title className="text-5xl! font-extrabold text-balance inline">
            Need some{" "}
            <Text
              variant="gradient"
              gradient={{ from: "blue", to: "turquoise", deg: 90 }}
              inherit
              span
            >
              ideas
            </Text>
            ?
          </Title>
          <p>
            You&apos;ve come to the right place. Take a look at the catalog of
            starter projects and ideas to kickstart your next project.
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-4 flex-wrap pl-16 pr-16 w-full h-full justify-center">
        {projects &&
          projects.map((project) => (
            <ProjectCard
              projectInfo={project as ProjectWithOwner}
              key={project.id}
            />
          ))}
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-2 pl-24 pr-24 pt-8 pb-8">
          <div className="flex flex-col gap-2 justify-start align-center">
            <ThemeIcon radius="xl" className="shadow-md">
              <SparklesIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={2}>Want to create your own project?</Title>
            <p>
              If you just wanted to look here for some inspiration, or you want
              to use your own idea, then click the button below to create a new
              project.
            </p>
            <CreateButton />
          </div>
        </div>
      </div>
    </div>
  );
}
