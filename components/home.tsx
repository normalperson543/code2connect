"use client";
import { Title, Text, List, ThemeIcon, Button } from "@mantine/core";
import {
  ArrowRightIcon,
  BoltIcon,
  CheckIcon,
  CodeBracketIcon,
  QuestionMarkCircleIcon,
  RectangleStackIcon,
  UserGroupIcon,
  UserIcon,
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
import Image from "next/image";
import { createProject } from "@/app/lib/actions";
import { useState } from "react";
import Link from "next/link";
import { ProjectWithOwner } from "@/app/lib/projects";
import { ClusterWithOwnerAndProjects } from "@/app/lib/cluster-types";
export default function Home({
  username,
  projectCount,
  clusterCount,
  followerCount,
  followingCount,
  featured,
  topLiked,
  iotmClusterInfo,
}: {
  username?: string;
  projectCount?: number;
  clusterCount?: number;
  followerCount?: number;
  followingCount?: number;
  featured: ProjectWithOwner[];
  topLiked: ProjectWithOwner[];
  iotmClusterInfo?: ClusterWithOwnerAndProjects | null;
}) {
  const [creating, setCreating] = useState(false);
  return (
    <div className="flex flex-col gap-8 justify-center">
      {username ? (
        <div className="flex flex-col gap-4 pt-24 pb-24 pl-12 pr-12 bg-linear-180 from-offblue-50 to-white rounded-b-xl">
          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-6 flex-1">
              <div className="flex flex-col gap-1">
                <Title>
                  Hi,{" "}
                  <Text
                    variant="gradient"
                    gradient={{ from: "blue", to: "turquoise", deg: 90 }}
                    inherit
                    span
                  >
                    {username}
                  </Text>
                  !
                </Title>
                <Text className="text-2xl!" c="dimmed">
                  Welcome to your account
                </Text>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-1">
                  <ThemeIcon radius="xl">
                    <CodeBracketIcon width={16} height={16} />
                  </ThemeIcon>
                  <p className="text-2xl font-bold">{projectCount}</p>
                  <p>projects created</p>
                </div>
                <div className="flex flex-col gap-1">
                  <ThemeIcon radius="xl">
                    <RectangleStackIcon width={16} height={16} />
                  </ThemeIcon>
                  <p className="text-2xl font-bold">{clusterCount}</p>
                  <p>clusters created</p>
                </div>
                <div className="flex flex-col gap-1">
                  <ThemeIcon radius="xl">
                    <UserGroupIcon width={16} height={16} />
                  </ThemeIcon>
                  <p className="text-2xl font-bold">{followerCount}</p>
                  <p>followers</p>
                </div>
                <div className="flex flex-col gap-1">
                  <ThemeIcon radius="xl">
                    <UserPlusIcon width={16} height={16} />
                  </ThemeIcon>
                  <p className="text-2xl font-bold">{followingCount}</p>
                  <p>following</p>
                </div>
              </div>
            </div>
            <Button
              leftSection={<BoltIcon width={16} height={16} />}
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 135 }}
              className="shadow-2xl shadow-teal-300"
              onClick={() => {
                createProject();
                setCreating(true);
              }}
              loading={creating}
            >
              New project
            </Button>
            <Link href={`/profile/${username}`}>
              <Button leftSection={<UserIcon width={16} height={16} />}>
                My profile
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="pt-24 pb-24 pl-12 pr-12 spacing-between gap-4  rounded-b-xl flex flex-row">
            <div className="flex flex-col gap-4 w-1/2">
              <Text className="uppercase text-black!">
                Welcome to Code2Connect
              </Text>
              <Title className="text-5xl! font-extrabold text-balance inline text-blcak">
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
                <List.Item c="black">
                  Share your creations with other coders
                </List.Item>
                <List.Item c="black">
                  Works in your browser - not in the cloud
                </List.Item>
                <List.Item c="black">
                  Tutorials and education oriented features
                </List.Item>
                <List.Item c="black">
                  <b>100% free</b>
                </List.Item>
              </List>
              <div className="flex flex-row gap-2">
                <Button
                  leftSection={<BoltIcon width={16} height={16} />}
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan", deg: 135 }}
                  className="shadow-2xl shadow-teal-300"
                  component={Link}
                  href="/auth/login"
                >
                  Get started
                </Button>
                <Button
                  leftSection={
                    <QuestionMarkCircleIcon width={16} height={16} />
                  }
                  component={Link}
                  href="/ideas"
                >
                  What can I create?
                </Button>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center w-1/2">
              <Image
                src="/assets/logo-black.svg"
                width={384}
                height={384}
                alt="Code2Connect logo"
              />
            </div>
          </div>
          <div className="flex flex-row gap-8 pl-30 pr-30 pt-24 pb-24 w-full h-full items-center rounded-lg">
            <div className="flex flex-col gap-2 w-1/2">
              <ThemeIcon radius="xl" className="shadow-md">
                <SparklesIcon width={16} height={16} />
              </ThemeIcon>
              <Text c="dimmed" className="uppercase">
                Ease of use
              </Text>
              <Title order={2}>Ridiculously easy to use</Title>
              <p>
                Code2Connect is designed to be easy to get started and start
                using, even if you don&apos;t have programming experience. We
                simplified the IDE so we put only the things you need, and
                nothing you don&apos;t. Just pure, blissful coding.
              </p>
              <Button
                leftSection={<BoltIcon width={16} height={16} />}
                className="self-start"
                component={Link}
                href="/auth/login"
              >
                I want an easy IDE, let&apos;s get started
              </Button>
            </div>
            <Image
              src="/assets/ide.png"
              alt="Code2Connect IDE"
              className="w-1/2 h-full"
              width={480}
              height={360}
            />
          </div>
          <div className="flex flex-row gap-2 pl-30 pr-30 pt-24 pb-24 w-full items-center">
            <Image
              src="/assets/shared.png"
              alt="Code2Connect IDE"
              className="w-1/2 h-full"
              width={480}
              height={360}
            />
            <div className="flex flex-col gap-2 w-1/2">
              <ThemeIcon radius="xl" className="shadow-md">
                <GlobeAmericasIcon width={16} height={16} />
              </ThemeIcon>
              <Text c="dimmed" className="uppercase">
                Share your projects
              </Text>
              <Title order={2}>
                Explore and share creations with a worldwide community
              </Title>
              <Text>
                We&apos;re a community of coders and love to see what you
                create! Publish your projects with just a couple of clicks, so
                others can play with your code. Explore other Python projects
                and play around or see their code. If you feel inspired, you can
                even fork projects so you can change their code!
              </Text>
              <Text>
                Want to see what you can create? Check out the top projects
                below 👇
              </Text>
            </div>
          </div>
        </>
      )}
      <div className="flex flex-col gap-2 pl-30 pr-30">
        <div className="flex flex-row gap-3 items-center">
          <ThemeIcon radius="xl" className="shadow-md" size="xl">
            <StarIcon width={20} height={20} />
          </ThemeIcon>
          <div className="flex flex-col">
            <Title order={3}>Featured by Code2Connect</Title>
            <p>
              Cool projects that were shared by the community and curated by
              Code2Connect
            </p>
          </div>
        </div>
        <ProjectCarousel projects={featured} />
      </div>
      {iotmClusterInfo && (
        <div className="flex flex-row gap-6 pl-30 pr-30 pt-8 pb-8 w-full items-center">
          <div className="flex flex-col gap-2 w-1/2">
            <div className="flex flex-row gap-3 items-center">
              <ThemeIcon radius="xl" className="shadow-md" size="xl">
                <PaintBrushIcon width={20} height={20} />
              </ThemeIcon>
              <div className="flex flex-col">
                <Title order={3}>Idea of the Month</Title>
                <p>Try out this idea for your next project</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Title order={4}>{iotmClusterInfo.title}</Title>
              <p>{iotmClusterInfo.description}</p>
              <div className="flex flex-row gap-2 items-center">
                <CodeBracketIcon width={16} height={16} />
                <Text c="dimmed">
                  {iotmClusterInfo._count.projects} project
                  {iotmClusterInfo._count.projects !== 1 && "s"}
                </Text>
              </div>
              <Link href={`/clusters/${iotmClusterInfo.id}`}>
                <Button
                  rightSection={<ArrowRightIcon width={16} height={16} />}
                >
                  Go to cluster
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <ProjectCarousel projects={iotmClusterInfo.projects} />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2 pl-30 pr-30">
        <div className="flex flex-row gap-3 items-center">
          <ThemeIcon radius="xl" className="shadow-md" size="xl">
            <HandThumbUpIcon width={20} height={20} />
          </ThemeIcon>
          <div className="flex flex-col">
            <Title order={3}>Top liked</Title>
            <p>
              The top projects that currently have the most likes, selected by
              the community
            </p>
          </div>
        </div>
        <ProjectCarousel projects={topLiked} />
      </div>
      {!username && (
        <div className="flex flex-col gap-2 pt-18 pb-18 pr-30 pl-30 bg-offblue-950 justify-center text-center">
          <Title order={3} c="white">
            Ready to join our community of Python coders?
          </Title>
          <div className="flex flex-row gap-2 justify-center">
            <Button
              leftSection={<BoltIcon width={16} height={16} />}
              component={Link}
              href="/auth/login"
            >
              Get started for free
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
