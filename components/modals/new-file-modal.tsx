"use client";
import { Button, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";
export default function NewFileModal({
  onComplete,
}: {
  onComplete: (newName: string) => void;
}) {
  const [newFileName, setNewFileName] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <TextInput
        type="text"
        value={newFileName}
        label="File name"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setNewFileName(target.value);
        }}
        minLength={1}
      />
      <Button
        fullWidth
        onClick={() => {
          onComplete(newFileName);
          modals.closeAll();
        }}
      >
        Done
      </Button>
    </div>
  );
}
