"use client";
import {
  Title,
  Tabs,
  BackgroundImage,
  Badge,
  Menu,
  Button,
} from "@mantine/core";
import MiniAssignment from "./mini-assignment";
import {
  ArrowDownIcon,
  CalendarIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  ClipboardIcon,
  EllipsisVerticalIcon,
  UserIcon,
  XMarkIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import MiniProfile from "../mini-profile";

function MiniProfileTeacherWrapper({ username }: { username: string }) {
  return (
    <MiniProfile
      username={username}
      topRightComponent={
        <Menu position="bottom-end">
          <Menu.Target>
            <Button variant="subtle">
              <EllipsisVerticalIcon width={16} height={16} />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<ArrowDownIcon width={16} height={16} />}
              c="red"
            >
              Demote
            </Menu.Item>
            <Menu.Item
              leftSection={<XMarkIcon width={16} height={16} />}
              c="red"
            >
              Remove from class
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      }
    />
  );
}
function MiniProfileStudentWrapper({ username }: { username: string }) {
  return (
    <MiniProfile
      username={username}
      topRightComponent={
        <Menu position="bottom-end">
          <Menu.Target>
            <Button variant="subtle">
              <EllipsisVerticalIcon width={16} height={16} />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<ArrowUpIcon width={16} height={16} />}>
              Promote
            </Menu.Item>
            <Menu.Item
              leftSection={<XMarkIcon width={16} height={16} />}
              c="red"
            >
              Remove from class
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      }
    />
  );
}
export default function EduClassUI() {
  return (
    <div className="flex flex-col gap-2">
      <BackgroundImage src="/assets/default-class-cover.jpg" h={120} />
      <Title order={3}>959847 - Intro to Programming - Doe P2</Title>
      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Tab
            leftSection={<ClipboardDocumentCheckIcon width={16} height={16} />}
            value="assignments"
          >
            Assignments
          </Tabs.Tab>
          <Tabs.Tab
            leftSection={<UserIcon width={16} height={16} />}
            value="members"
          >
            Members
          </Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Title order={4}>Assignments</Title>
      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Tab
            leftSection={<ClipboardDocumentCheckIcon width={16} height={16} />}
            value="all"
          >
            All
          </Tabs.Tab>
          <Tabs.Tab
            leftSection={<ClipboardIcon width={16} height={16} />}
            value="assigned"
          >
            Assigned
          </Tabs.Tab>
          <Tabs.Tab
            leftSection={<CalendarIcon width={16} height={16} />}
            value="dueToday"
          >
            Due today
          </Tabs.Tab>
          <Tabs.Tab
            leftSection={<CheckIcon width={16} height={16} />}
            value="graded"
          >
            Graded
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <MiniAssignment
        assignmentName="Hello, World"
        status={3}
        dueDate={new Date()}
      />
      <Title order={4}>Members</Title>
      <div className="flex flex-col gap-2">
        <Title order={5} className="flex flex-row gap-2 items-center">
          Teachers <Badge>10</Badge>
        </Title>
        <div className="flex flex-row flex-wrap gap-2">
          <MiniProfileTeacherWrapper username="normalperson543" />
          <MiniProfileTeacherWrapper username="normalperson543" />
          <MiniProfileTeacherWrapper username="normalperson543" />
          <MiniProfileTeacherWrapper username="normalperson543" />
          <MiniProfileTeacherWrapper username="normalperson543" />
          <MiniProfileTeacherWrapper username="normalperson543" />
          <MiniProfileTeacherWrapper username="normalperson543" />
          <MiniProfileTeacherWrapper username="normalperson543" />
          <MiniProfileTeacherWrapper username="normalperson543" />
        </div>
        <Title order={5} className="flex flex-row gap-2 items-center">
          Students <Badge>10</Badge>
        </Title>
        <div className="flex flex-row flex-wrap gap-2">
          <MiniProfileStudentWrapper username="normalperson543" />
          <MiniProfileStudentWrapper username="normalperson543" />
          <MiniProfileStudentWrapper username="normalperson543" />
          <MiniProfileStudentWrapper username="normalperson543" />
          <MiniProfileStudentWrapper username="normalperson543" />
          <MiniProfileStudentWrapper username="normalperson543" />
          <MiniProfileStudentWrapper username="normalperson543" />
          <MiniProfileStudentWrapper username="normalperson543" />
          <MiniProfileStudentWrapper username="normalperson543" />
          <MiniProfileStudentWrapper username="normalperson543" />
        </div>
      </div>
    </div>
  );
}
