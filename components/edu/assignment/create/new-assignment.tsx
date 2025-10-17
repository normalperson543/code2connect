import {
  Bars3CenterLeftIcon,
  CalendarIcon,
  CodeBracketIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Checkbox,
  Pagination,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import MiniAssignment from "../../mini-assignment";
import { DateTimePicker } from "@mantine/dates";

export default function NewAssignmentUI() {
  return (
    <div className="flex flex-col gap-2">
      <Title order={2}>New assignment</Title>
      <p>Classes allow you to assign work to a group of students.</p>
      <Title order={3}>Import from another class</Title>
      <TextInput
        leftSection={<MagnifyingGlassIcon width={16} height={16} />}
        placeholder="Search for an assignment"
      />
      <MiniAssignment
        assignmentName="Hello, World"
        status={0}
        dueDate={new Date()}
      />
      <MiniAssignment
        assignmentName="Hello, World"
        status={0}
        dueDate={new Date()}
      />
      <MiniAssignment
        assignmentName="Hello, World"
        status={0}
        dueDate={new Date()}
      />
      <Pagination total={5} />
      <Title order={3}>Create a new assignment</Title>
      <div className="flex flex-col gap-2">
        <TextInput
          label="Assignment name"
          withAsterisk
          placeholder="How to Destroy the World"
          leftSection={<Bars3CenterLeftIcon width={16} height={16} />}
        />
        <Textarea
          label="Assignment description"
          placeholder="You can enter Markdown in this textbox."
          leftSection={<DocumentIcon width={16} height={16} />}
          rows={4}
        />
        <DateTimePicker
          label="Due date"
          description="This assignment will lock at this date and time, and students will not be able to turn in or make up assignments."
          leftSection={<CalendarIcon width={16} height={16} />}
        />
        <TextInput
          label="Project template URL"
          description="Paste the project URL of the project you would like students to fork (copy)."
          leftSection={<CodeBracketIcon width={16} height={16} />}
        />
        <Checkbox
          label="Restrict student submissions to this template"
          description="Students will only be allowed to submit forks of this template. If projects are created without using this template, students will not be able to submit their project."
        />
        <Button size="sm">Create</Button>
      </div>
    </div>
  );
}
