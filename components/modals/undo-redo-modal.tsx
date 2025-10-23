"use client";
import { Button, Text, Kbd } from "@mantine/core";
import { modals } from "@mantine/modals";

export default function UndoRedoModal() {
  return (
    <div className="flex flex-col gap-2">
      <Text>To undo a change:</Text>
      <div className="flex flex-row gap-1">
        <Text fw={700}>On Windows or Linux: </Text>
        <Text>Press</Text>
        <Kbd>Ctrl</Kbd>
        <Text>+</Text>
        <Kbd>Z</Kbd>
      </div>
      <div className="flex flex-row gap-1">
        <Text fw={700}>On macOS: </Text>
        <Text>Press</Text>
        <Kbd>⌘</Kbd>
        <Text>+</Text>
        <Kbd>Z</Kbd>
      </div>
      <Text>To redo a change:</Text>
      <div className="flex flex-row gap-1">
        <Text fw={700}>On Windows or Linux: </Text>
        <Text>Press</Text>
        <Kbd>Ctrl</Kbd>
        <Text>+</Text>
        <Kbd>Shift</Kbd>
        <Text>+</Text>
        <Kbd>Z</Kbd>
      </div>
      <div className="flex flex-row gap-1">
        <Text fw={700}>On macOS: </Text>
        <Text>Press</Text>
        <Kbd>⌘</Kbd>
        <Text>+</Text>
        <Kbd>Shift</Kbd>
        <Text>+</Text>
        <Kbd>Z</Kbd>
      </div>
      <Button
        fullWidth
        onClick={() => {
          modals.closeAll();
        }}
      >
        Done
      </Button>
    </div>
  );
}
