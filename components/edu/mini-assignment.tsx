"use client";
import { Badge, Paper, Text } from "@mantine/core";
import { ClipboardCheckIcon } from "lucide-react";

export default function MiniAssignment({
  assignmentName,
  status,
  dueDate,
}: {
  assignmentName: string;
  status: number;
  dueDate: Date;
}) {
  return (
    <Paper
      shadow="sm"
      radius="sm"
      className="w-full p-2 flex! flex-row justify-between"
    >
      <div className="flex flex-row gap-2 items-center">
        <ClipboardCheckIcon width={16} height={16} />
        <Text fw={700}>{assignmentName}</Text>
      </div>
      <div className="flex flex-row gap-2 justify-end items-center">
        {status === 0 && <Badge>Assigned</Badge>}
        {status === 1 && <Badge color="orangey">Late</Badge>}
        {status === 2 && <Badge color="teal">Submitted</Badge>}
        {status === 3 && <Badge color="green">Graded</Badge>}
        <Text>Due {dueDate.toLocaleString()}</Text>
      </div>
    </Paper>
  );
}
