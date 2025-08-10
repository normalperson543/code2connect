"use client";

import { Title, Text, List, ThemeIcon, Button } from "@mantine/core";
import { BoltIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row pl-30 pr-30 pt-18 pb-18 spacing-between gap-4 ">
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
          <div className="flex flex-row gap-2">
            <Button leftSection={<BoltIcon width={16} height={16} />}>
              Try it out
            </Button>
            <Button leftSection={<BoltIcon width={16} height={16} />} color="gray">
              Join the community
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
