"use client";

import { Project } from "@/app/lib/projects";
import ProjectCard from "@/components/project-card";
import {
  CheckIcon,
  DocumentIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";
import {
  Button,
  ThemeIcon,
  Title,
  Text,
  Paper,
  Stepper,
  Textarea,
  Badge,
} from "@mantine/core";
import { ClipboardCopyIcon } from "lucide-react";
import { useState } from "react";

export default function EduAssignmentUI({
  assignmentName,
  isAdmin = false,
  assignmentState,
  instructions,
  templateProject,
  studentSubmissionProject,
  finalGrade,
  possiblePoints,
  dueDate,
  turnInDate,
}: {
  assignmentName: string;
  isAdmin?: boolean;
  assignmentState: 0 | 1 | 2 | 3;
  instructions: string;
  templateProject: Project;
  studentSubmissionProject?: Project;
  finalGrade?: number;
  possiblePoints: number;
  dueDate?: Date;
  turnInDate?: Date;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-row gap-2 items-center">
          <ThemeIcon radius="xl" className="shadow-md">
            <ClipboardDocumentCheckIcon width={16} height={16} />
          </ThemeIcon>
          <Title order={3}>{assignmentName}</Title>
        </div>
        <div className="flex flex-col gap-2 lg:items-center">
          <div className="flex flex-row gap-2 items-center">
            {assignmentState === 0 && <Badge>Assigned</Badge>}
            {assignmentState === 1 && <Badge color="orangey">Late</Badge>}
            {assignmentState === 2 && <Badge color="teal">Submitted</Badge>}
            {assignmentState === 3 && <Badge color="green">Graded</Badge>}
            {assignmentState === 3 ? (
              <Text>
                {finalGrade}/{possiblePoints}
              </Text>
            ) : (
              <Text>{possiblePoints} points possible</Text>
            )}
          </div>
          {dueDate && <Text>Due {dueDate.toLocaleString()}</Text>}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 justify-between">
        <div className="flex flex-col gap-2 w-full lg:w-1/2">
          <div className="flex flex-row gap-2 items-center">
            <DocumentIcon width={16} height={16} />
            <Title order={4}>Instructions</Title>
          </div>
          {isAdmin ? (
            <Textarea rows={8} value={instructions} />
          ) : (
            <Text>{instructions}</Text>
          )}
          {templateProject && (
            <>
              <div className="flex flex-row gap-2 items-center">
                <ClipboardCopyIcon width={16} height={16} />
                <Title order={4}>Template</Title>
              </div>
              {isAdmin ? (
                <Text c="dimmed">
                  This is the project which students will fork to complete the
                  assignment.
                </Text>
              ) : (
                <Text c="dimmed">
                  You'll fork (copy) this project so you can edit it.
                </Text>
              )}

              <div className="w-72">
                <ProjectCard projectInfo={templateProject} />
              </div>
              {isAdmin && (
                <Button leftSection={<PlusIcon width={16} height={16} />}>
                  Attach project
                </Button>
              )}
            </>
          )}
        </div>
        <div className="w-full lg:w-1/2 p-2 flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <UserIcon width={16} height={16} />
            <Title order={4}>Submission</Title>
          </div>
          {studentSubmissionProject ? (
            <div className="w-72">
              <ProjectCard projectInfo={studentSubmissionProject} />
            </div>
          ) : (
            <div className="p-4 flex flex-col items-center justify-center gap-2">
              <InformationCircleIcon width={16} height={16} />
              <Text>You haven't attached a project yet.</Text>
            </div>
          )}
          <Button leftSection={<PlusIcon width={16} height={16} />}>
            Attach project
          </Button>
          {(!isAdmin && assignmentState === 0) || assignmentState === 1 ? (
            <Button leftSection={<CheckIcon width={16} height={16} />}>
              Turn in
            </Button>
          ) : (
            <Button leftSection={<CheckIcon width={16} height={16} />} disabled>
              Turned in on {turnInDate?.toLocaleString()}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
