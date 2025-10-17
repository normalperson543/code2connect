import { SparklesIcon } from "@heroicons/react/24/outline";
import { Title, Text, ThemeIcon, Button } from "@mantine/core";

export default function IdeasMarketing() {
  return (
    <div className="flex flex-col gap-2 justify-center">
      <div className="pt-24 pb-24 pl-12 pr-12 spacing-between gap-4 bg-gradient-to-b from-black to-offblue-950 rounded-b-xl flex flex-row">
        <div className="flex flex-col gap-4 justify-center text-center w-full">
          <Text className="uppercase" c="dimmed">
            Free Python code editor, tutorials, and resources
          </Text>
          <Title className="text-5xl! font-extrabold text-balance inline text-white">
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
          <p className="text-white">
            You've come to the right place. Take a look at the catalog of starter projects and ideas to kickstart your next project.
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-2 pl-8 pr-8 pt-8 pb-8 ml-2 mr-2 rounded-lg backdrop-blur-sm shadow-2xs bg-offblue-800 w-1/2">
          <div className="flex flex-col gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <SparklesIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={2} c="white">
              Want to create your own project?
            </Title>
            <Text c="white">
              If you just wanted to look here for some inspiration, or you want to use your own idea, then click the button below to create a new project.
            </Text>
            <Button>Make a new project</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
