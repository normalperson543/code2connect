"use client";
import { Button, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";
import styles from "./modal.module.css"

export default function RenameModal({
  onComplete,
  defaultValue
}: {
  onComplete: (newName: string) => void;
  defaultValue: string;
}) {
  const [renameModalName, setRenameModalName] = useState(defaultValue);
  return (
    <div className={styles.container}>
      <TextInput
        type="text"
        value={renameModalName}
        label="New name"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setRenameModalName(target.value);
        }}
        minLength={1}
      />
      <Button
        fullWidth
        onClick={() => {
          onComplete(renameModalName);
          modals.closeAll();
        }}
      >
        Done
      </Button>
    </div>
  );
}
