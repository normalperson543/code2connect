"use client";
import { Title, Tabs, BackgroundImage } from "@mantine/core";
import MiniAssignment from "./mini-assignment";
import {
  CalendarIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";

export default function EduClassUI() {
  return (
    <div className="flex flex-col gap-2">
      <BackgroundImage src="/assets/default-class-cover.jpg" h={120} />
      <Title order={3}>959847 - Intro to Programming - Doe P2</Title>
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
    </div>
  );
}
