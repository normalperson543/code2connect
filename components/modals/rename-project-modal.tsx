"use client";
import { Button, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";

export default function RenameProjectModal({
  onComplete,
  defaultValue,
}: {
  onComplete: (newName: string) => void;
  defaultValue: string;
}) {
  const [renameProjectName, setRenameProjectName] = useState(defaultValue);
  return (
    <div className="flex flex-col gap-2">
      <TextInput
        type="text"
        value={renameProjectName}
        label="What's your project called?"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setRenameProjectName(target.value);
        }}
        minLength={1}
      />
      <Button
        fullWidth
        onClick={() => {
          onComplete(renameProjectName);
          modals.closeAll();
        }}
      >
        Done
      </Button>
    </div>
  );
}
