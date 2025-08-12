"use client";

import { AcademicCapIcon } from "@heroicons/react/24/solid";
import {
  AppShell,
  Avatar,
  ThemeIcon,
  Title,
  Text,
  Tabs,
  BackgroundImage,
  NavLink,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import MiniClass from "./mini-class";
import MiniAssignment from "./mini-assignment";
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function EduAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      padding={16}
      navbar={{ width: 300, breakpoint: 768, collapsed: { mobile: !opened } }}
    >
      <AppShell.Header className="bg-[var(--body-bg-color)]!" zIndex={100}>
        <div className="flex flex-row justify-between items-center h-full p-4">
          <div className="flex flex-row gap-2 w-full h-full items-center">
            <ThemeIcon radius="xl">
              <AcademicCapIcon width={16} height={16} />
            </ThemeIcon>
            <Title order={3}>Education</Title>
          </div>
          <div className="flex flex-row justify-end h-full">
            <div className="flex flex-row gap-2 rounded-xl p-1 h-full items-center">
              <Avatar size="md" />
              <Text>normalperson543</Text>
            </div>
          </div>
        </div>
      </AppShell.Header>
      <AppShell.Navbar className="bg-[var(--body-bg-color)]! p-4 flex flex-col gap-2">
        <AppShell.Section grow>
          <Title order={4}>Classes</Title>
          <MiniClass
            imageSrc="/assets/default-class-cover.jpg"
            name="959847 - Intro to Programming - Doe P2"
            teacherName="J. Doe"
          />
        </AppShell.Section>
        <AppShell.Section>
          <NavLink
            href="/"
            leftSection={<ArrowLeftEndOnRectangleIcon width={16} height={16} />}
            rightSection={<ArrowRightIcon width={16} height={16} />}
            label="Return to Code2Connect"
            active
          />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
