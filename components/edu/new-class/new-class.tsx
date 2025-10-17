import Heading from "@/components/heading";
import { Bars3CenterLeftIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { Button, Textarea, TextInput, Title } from "@mantine/core";

export default function NewClassPageUI() {
  return (
    <div className="flex flex-col gap-2">
      <Title order={2}>New class</Title>
      <p>Classes allow you to assign work to a group of students.</p>
      <div className="flex flex-col gap-2">
        <TextInput
          label="Class name"
          withAsterisk
          placeholder="Intro to Programming"
          leftSection={<Bars3CenterLeftIcon width={16} height={16} />}
        />
        <Textarea
          label="Class description"
          placeholder="Welcome to my class!"
          leftSection={<DocumentIcon width={16} height={16} />}
          rows={4}
        />
        <Button size="sm">Create</Button>
      </div>
    </div>
  );
}
