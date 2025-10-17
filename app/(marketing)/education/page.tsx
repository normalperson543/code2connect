import { SparklesIcon } from "@heroicons/react/24/outline";
import { Title, Text, ThemeIcon, Button } from "@mantine/core";

export default function EducationMarketing() {
  return (
    <div className="flex flex-col gap-2 justify-center">
      <div className="pt-24 pb-24 pl-12 pr-12 spacing-between gap-4 bg-gradient-to-b from-black to-offblue-950 rounded-b-xl flex flex-row">
        <div className="flex flex-col gap-4 justify-center text-center w-full">
          <Text className="uppercase" c="dimmed">
            Free Python code editor, tutorials, and resources
          </Text>
          <Title className="text-5xl! font-extrabold text-balance inline text-white">
            <Text
              variant="gradient"
              gradient={{ from: "blue", to: "turquoise", deg: 90 }}
              inherit
              span
            >
              Education features
            </Text>{" "}
            to empower students
          </Title>
          <p className="text-white">
            When you integrate Code2Connect to your class, you&apos;re allowing
            students to explore their creativity through code - and opening
            opportunities to expand their community.
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
              Join the education program
            </Title>
            <Text c="white">
              Want to integrate Code2Connect with your school, district, or
              class? Connect with us to get started. We&apos;ll get you set up with
              your own education account, and provide you resources and support
              on managing your classes.
            </Text>
            <Button>Contact us</Button>
          </div>
        </div>
        <div className="flex flex-row gap-2 pl-8 pr-8 pt-8 pb-8 ml-2 mr-2 rounded-lg backdrop-blur-sm shadow-2xs bg-offblue-800 w-1/2">
          <div className="flex flex-col gap-2">
            <ThemeIcon radius="xl" className="shadow-md">
              <SparklesIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={2} c="white">
              Want to try it out?
            </Title>
            <Text c="white">
              You can use a Code2Connect personal account to demo your projects
              and try out the editor. Create an account to get started. It&apos;s
              100% free.
            </Text>
            <Button>Get started</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
