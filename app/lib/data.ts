"use server";

import { Project } from "@prisma/client";
import prisma from "./db";
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
export async function canAccessProject(isPublic: boolean | undefined | null, ownerId: string | undefined | null) {
  const supabase = await createClient(false);
  const user = await supabase.auth.getUser()
  const authUserId = user.data.user?.id

  console.log(isPublic)
  console.log(ownerId === authUserId)
  if (isPublic || ownerId === authUserId) {
    console.log("Can Access")
    return true;
  }
  return false;
}
export async function getProject(projectId: string) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      owner: true,
      clusters: true,
      comments: true,
    },
  });
  console.log(project)
  if (!await canAccessProject(project?.isPublic, project?.profileId)) return;
  return project;
}
export async function getProjectLikes(projectId: string) {
  const project = await prisma.project.findMany({
    where: {
      id: projectId,
    },
    include: {
      _count: {
        select: { likers: true },
      },
    },
  });
  if (!await canAccessProject(project[0].isPublic, project[0].profileId)) return;
  return project[0]._count.likers;
}
