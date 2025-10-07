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
import {
  GlobeAmericasIcon,
  HandThumbUpIcon,
  PaintBrushIcon,
  SparklesIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { placeholder } from "../lib/constants";
import HomepageCarousel from "@/components/homepage-carousel";
import ProjectCard from "@/components/project-card";
import Image from "next/image";
export default function Home() {
  return (
    <div className="flex flex-col gap-2 justify-center">
      <div className="pt-24 pb-24 pl-12 pr-12 spacing-between gap-4 bg-gradient-to-b from-black to-offblue-950 rounded-b-xl flex flex-row">
        <div className="flex flex-col gap-4 w-1/2">
          <Text className="uppercase text-white!">Welcome to Code2Connect</Text>
          <Title className="text-5xl! font-extrabold text-balance inline text-white">
            The{" "}
            <Text
              variant="gradient"
              gradient={{ from: "blue", to: "turquoise", deg: 90 }}
              inherit
              span
            >
              coding community
            </Text>{" "}
            where you belong
          </Title>
          <Text className="text-2xl!" c="dimmed">
            Learn how to code, right in your browser. Easy and free.
          </Text>
          <List
            spacing="sm"
            icon={
              <ThemeIcon radius="xl" className="shadow-md">
                <CheckIcon width={16} height={16} />
              </ThemeIcon>
            }
          >
            <List.Item c="white">
              Share your creations with other coders
            </List.Item>
            <List.Item c="white">
              Works in your browser - not in the cloud
            </List.Item>
            <List.Item c="white">
              Tutorials and education oriented features
            </List.Item>
            <List.Item c="white">
              <b>100% free</b>
            </List.Item>
          </List>
          <div className="flex flex-row gap-2">
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
        <div className="flex flex-row items-center justify-center w-1/2">
          <Image
            src="/assets/logo-white.svg"
            width={384}
            height={384}
            alt="Code2Connect logo"
          />
        </div>
      </div>
      <div className="flex flex-row gap-2 pl-30 pr-30 pt-8 pb-8 ml-2 mr-2 rounded-lg backdrop-blur-sm shadow-2xs bg-offblue-800">
        <div className="flex flex-col gap-2 w-1/2">
          <ThemeIcon radius="xl" className="shadow-md">
            <SparklesIcon width={16} height={16} />
          </ThemeIcon>
          <Text c="off-blue.1" className="uppercase">
            Ease of use
          </Text>
          <Title order={2} c="white">
            Ridiculously easy to use
          </Title>
          <Text c="white">
            Code2Connect is designed to be easy to get started and start using,
            even if you don't have programming experience. We simplified the IDE
            so we put only the things you need, and nothing you don't. Just
            pure, blissful coding.
          </Text>
          <Button leftSection={<BoltIcon width={16} height={16} />}>
            I want an easy IDE, let's get started
          </Button>
        </div>
      </div>
      <div className="flex flex-row gap-2 pl-30 pr-30 pt-8 pb-8 ml-2 mr-2 rounded-lg w-full bg-offblue-50">
        <div className="flex flex-col gap-2 w-1/2"></div>
        <div className="flex flex-col gap-2 w-1/2">
          <ThemeIcon radius="xl" className="shadow-md">
            <GlobeAmericasIcon width={16} height={16} />
          </ThemeIcon>
          <Title order={2}>
            Explore and share creations with a worldwide community
          </Title>
          <Text>
            We're a community of coders and love to see what you create! Publish
            your projects with just a couple of clicks, so others can play with
            your code. Explore other Python projects and play around or see
            their code. If you feel inspired, you can even fork projects so you
            can change their code!
          </Text>
          <Text>
            Want to see what our coders are creating? Check out the top projects
            below 👇
          </Text>
        </div>
      </div>
      <div className="flex flex-col gap-2 pl-30 pr-30">
        <div className="flex flex-row gap-2 items-center">
          <ThemeIcon radius="xl" className="shadow-md">
            <StarIcon width={16} height={16} />
          </ThemeIcon>
          <Title order={3}>Featured by Code2Connect</Title>
        </div>
        <ProjectCarousel projects={placeholder} />
      </div>
      <div className="flex flex-row gap-2 pl-30 pr-30 pt-8 pb-8 w-full">
        <div className="flex flex-col gap-2 w-1/2">
          <div className="flex flex-row gap-2 items-center">
            <ThemeIcon radius="xl" className="shadow-md">
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
          <ProjectCarousel projects={placeholder} />
        </div>
      </div>
      <div className="flex flex-col gap-2 pl-30 pr-30">
        <div className="flex flex-row gap-2 items-center">
          <ThemeIcon radius="xl" className="shadow-md">
            <HandThumbUpIcon width={16} height={16} />
          </ThemeIcon>
          <Title order={3}>Top liked</Title>
        </div>
        <ProjectCarousel projects={placeholder} />
      </div>
      <div className="flex flex-col gap-2 pt-18 pb-18 pr-30 pl-30 bg-offblue-950 justify-center text-center">
        <Title order={3} c="white">
          Ready to join our community of Python coders?
        </Title>
        <div className="flex flex-row gap-2 justify-center">
          <Button leftSection={<BoltIcon width={16} height={16} />}>
            Get started for free
          </Button>
        </div>
      </div>
    </div>
  );
}
