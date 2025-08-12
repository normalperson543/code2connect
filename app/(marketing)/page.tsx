"use client";

import { Title, Text, List, ThemeIcon, Button, Anchor } from "@mantine/core";
import {
  ArrowRightIcon,
  BoltIcon,
  CheckIcon,
  CodeBracketIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import ProjectCarousel from "@/components/project-carousel";
import { HandThumbUpIcon, PaintBrushIcon, StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Home() {
  const placeholder = [ // BACKEND DEVELOPERS PLEASE REMOVE
    {
      name: "Guess the Number",
      projectId: "a",
      owner: {
        username: "normalperson543",
      },
      likes: 69,
      featured: false,
      thumbnail: "/assets/default-image.png",
    },
    {
      name: "Guess the Number",
      projectId: "a",
      owner: {
        username: "normalperson543",
      },
      likes: 69,
      featured: false,
      thumbnail: "/assets/default-image.png",
    },
    {
      name: "Guess the Number",
      projectId: "a",
      owner: {
        username: "normalperson543",
      },
      likes: 69,
      featured: false,
      thumbnail: "/assets/default-image.png",
    },
    {
      name: "Guess the Number",
      projectId: "a",
      owner: {
        username: "normalperson543",
      },
      likes: 69,
      featured: false,
      thumbnail: "/assets/default-image.png",
    },
    {
      name: "Guess the Number",
      projectId: "a",
      owner: {
        username: "normalperson543",
      },
      likes: 69,
      featured: false,
      thumbnail: "/assets/default-image.png",
    },
  ];
  return (
    <div className="flex flex-col gap-2">
      <div className="pl-30 pr-30 pt-18 pb-18 spacing-between gap-4 ">
        <div className="flex flex-col gap-4 justify-center text-center">
          <Title className="text-5xl! font-bold text-balance">
            Welcome to the coding community where you belong
          </Title>
          <Text className="text-2xl!" c="dimmed">
            Learn real programming in Python, share with other like-minded
            coders. Everything works entirely in your browser. All 100% free and
            open source.
          </Text>
          <List
            spacing="sm"
            icon={
              <ThemeIcon size="sm" radius="xl">
                <CheckIcon width={16} height={16} />
              </ThemeIcon>
            }
          >
            <List.Item>Share your creations with other coders</List.Item>
            <List.Item>Works in your browser - not in the cloud</List.Item>
            <List.Item>Tutorials and education oriented features</List.Item>
            <List.Item>
              <b>100% free</b>
            </List.Item>
          </List>
          <div className="flex flex-row gap-2 justify-center">
            <Button leftSection={<BoltIcon width={16} height={16} />}>
              Try it out
            </Button>
            <Button
              leftSection={<UserPlusIcon width={16} height={16} />}
              color="gray"
            >
              Join the community
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 pl-30 pr-30">
        <div className="flex flex-row gap-2 items-center">
          <ThemeIcon radius="xl">
            <StarIcon width={16} height={16} />
          </ThemeIcon>
          <Title order={3}>Featured by Code2Connect</Title>
        </div>
        <ProjectCarousel projects={placeholder}/>
      </div>
      <div className="flex flex-row gap-2 pl-30 pr-30 pt-8 pb-8 w-full">
        <div className="flex flex-col gap-2 w-1/2">
          <div className="flex flex-row gap-2 items-center">
            <ThemeIcon radius="xl">
              <PaintBrushIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={3}>Idea of the Month</Title>
          </div>
          <div className="flex flex-col gap-2">
            <Title order={4}>Code Canvas</Title>
            <Text>
              Ever thought drawing on paper was boring? Did you know that your
              next great piece of art can be made with just a few lines of code?
            </Text>
            <Text>
              In this Idea of the Month, we inspire you to create something that
              can create a magnificent piece of art. Use your imagination! Maybe
              you can be the next Picasso... with code.
            </Text>
            <div className="flex flex-row gap-2 items-center">
              <CodeBracketIcon width={16} height={16} />
              <Text c="dimmed">1,828 projects</Text>
            </div>
            <Button rightSection={<ArrowRightIcon width={16} height={16} />}>
              Go to cluster
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <ProjectCarousel
            projects={placeholder}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 pl-30 pr-30">
        <div className="flex flex-row gap-2 items-center">
          <ThemeIcon radius="xl">
            <HandThumbUpIcon width={16} height={16} />
          </ThemeIcon>
          <Title order={3}>Top liked</Title>
        </div>
        <ProjectCarousel projects={placeholder}/>
      </div>
      <div className="flex flex-col gap-2 pt-18 pb-18 pr-30 pl-30 bg-offblue-950 justify-center text-center">
        <Title order={3} c="white">Ready to get started?</Title>
            <div className="flex flex-row gap-2 justify-center">
            <Button leftSection={<BoltIcon width={16} height={16} />}>
              Get started for free
            </Button>
            </div>
      </div>
    </div>
  );
}
