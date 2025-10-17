"use server";

import prisma from "./db";
import moment from "moment";
import { createClient } from "@/lib/supabase/server";

export async function getFirstProjectSession(projectId: string) {
  const session = await prisma.projectSessionToken.findFirst({
    where: {
      projectId: projectId,
    },
  });
  return session;
}
export async function getProjectSession(sessionId: string, projectId: string) {
  const session = await prisma.projectSessionToken.findUnique({
    where: {
      id: sessionId,
      projectId: projectId,
    },
  });
  return session;
}
export async function newProjectSession(projectId: string) {
  const session = await prisma.projectSessionToken.create({
    data: {
      projectId: projectId,
    },
  });
  return session;
}
export async function renewProjectSession(projectId: string) {
  revokeAllProjectSessions(projectId);
  const session = await newProjectSession(projectId);

  return session;
}

export async function revokeAllProjectSessions(projectId: string) {
  const session = await prisma.projectSessionToken.deleteMany({
    where: {
      projectId: projectId,
    },
  });
  return session;
}
export async function getProjectFiles(userId: string, id: string) {
  const supabase = await createClient(false);

  return await supabase.storage.from("projects").list(`${userId}/${id}`);
}
export async function getProject(projectId: string, authUserId: string) {
  const project = prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      owner: true,
      clusters: true,
    },
  });

  /*if (!(project.isPublic || authUserId === user.data.user?.id)) {
    return;
  }*/

  return project;
}
