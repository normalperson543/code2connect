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
    notifications.show({
      position: "top-right",
      withCloseButton: true,
      autoClose: false,
      title: "Please specify a valid project link",
      message: "It should start with https://code2connect.vercel.app/projects.",
      color: "red",
      icon: <XMarkIcon />,
    });
    return;
  }
  try {
    await addProjectToCluster(clusterId, projectId);
  } catch (e) {
    notifications.show({
      position: "top-center",
      withCloseButton: true,
      autoClose: false,
      title: "There was a problem adding your project",
      message: `Please try again later. Error info: ${e instanceof Error ? e.message : "Unknown error"}`,
      color: "red",
      icon: "",
    });
  }
}
