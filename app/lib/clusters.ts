"use client";

import { notifications } from "@mantine/notifications";
import { validate } from "uuid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { addProjectToCluster } from "./actions";

export async function handleAddToCluster(clusterId: string, addUrl: string) {
  const pathname = new URL(addUrl).pathname;
  const pathnamePages = pathname.split("/").filter(Boolean);
  let projectId;
  for (let i = pathnamePages.length - 1; i >= 0; i--) {
    if (validate(pathnamePages[i])) {
      projectId = pathnamePages[i];
      break;
    }
  }
  if (!projectId) {
    throw new Error("Please specify a valid project URL.");
  }
  await addProjectToCluster(clusterId, projectId);
}
