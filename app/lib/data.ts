"use server";

import { Project } from "@prisma/client";
import prisma from "./db";
import { createClient } from "@/lib/supabase/server";
import { createClient as createPexelsClient } from "pexels";
import { userInfo } from "os";
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
export async function canAccessProject(
  isPublic: boolean | undefined | null,
  ownerId: string | undefined | null,
) {
  const supabase = await createClient(false);
  const user = await supabase.auth.getUser();
  const authUserId = user.data.user?.id;

  console.log(isPublic);
  console.log(ownerId === authUserId);
  if (isPublic || ownerId === authUserId) {
    console.log("Can Access");
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
      forks: {
        include: {
          owner: true,
        },
      },
    },
  });
  console.log(project);
  if (!(await canAccessProject(project?.isPublic, project?.profileId))) return;
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
  if (!(await canAccessProject(project[0].isPublic, project[0].profileId)))
    return;
  return project[0]._count.likers;
}

export async function getProfile(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: {
      id: userId,
    },
  });

  return profile;
}

export async function getProfileBio(userId: string, bio: string) {
  const profile = await prisma.profile.findUnique({
    where: {
      id: userId,
    },
  });

  return profile;
}

export async function getThumbnailSearchResults(
  searchQuery: string,
  page: number = 1,
) {
  const client = createPexelsClient(process.env.PEXELS_API_KEY as string);
  const res = await client.photos.search({ query: searchQuery });
  return res;
}

export async function getProfileWithUsername(userName: string) {
  const profile = await prisma.profile.findUnique({
    where: {
      username: userName,
    },
  });

  return profile;
}

export async function getProfileFollowInfo(username: string) {
  const followInfo = await prisma.profile.findUnique({
    where: {
      username: username,
    },
    select: {
      followers: true,
      following: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });

  return followInfo;
}

export async function getIsFollower(profileId: string, followerId: string) {
  const profile = await prisma.profile.findUnique({
    where: {
      id: profileId,
    },
    include: {
      followers: {
        where: {
          id: followerId,
        },
      },
    },
  });

  if (profile && profile?.followers.length > 0) {
    return true;
  } else {
    return false;
  }
}

export async function getIsFollowing(
  profileUsername: string,
  currentUserId: string,
) {
  const profile = await prisma.profile.findUnique({
    where: {
      username: profileUsername,
    },
    select: {
      followers: {
        where: {
          id: currentUserId,
        },
      },
    },
  });

  if (
    profile &&
    profile.followers &&
    profile.followers.length > 0 &&
    profile.followers[0].id === currentUserId
  ) {
    return true;
  } else {
    return false;
  }
}

export async function getProfileProjects(profileUsername: string) {
  /*const projects = await prisma.profile.findUnique({
    where: {
      username: profileUsername
    },
    include: {
      projects: true,
    }
  })*/

  const projects = await prisma.project.findMany({
    where: {
      owner: {
        username: profileUsername,
      },
    },
    include: {
      owner: true,
    },
  });

  return projects;
}

export async function getProfileComments(profileId: string) {
  const comments = await prisma.profile.findUnique({
    where: {
      id: profileId,
    },
    select: {
      comments: true,
    },
  });

  return comments?.comments;
}
