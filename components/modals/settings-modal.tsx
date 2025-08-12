"use client";
import { Button, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";
export default function SettingsModal({
  onComplete,
}: {
  onComplete: (newName: string) => void;
}) {
  const [newFileName, setNewFileName] = useState("");
  return (
    <div className="flex flex-col gap-2">
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
