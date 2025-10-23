"use server";
import prisma from "./db";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { Project } from "@prisma/client";
import { createClient as createPexelsClient } from "pexels";
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
export async function getProjectFiles(
  userId: string,
  id: string,
  isPublic: boolean,
) {
  const supabaseAdmin = await createAdminClient();
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const authUserId = user.data.user?.id;

  console.log(authUserId);
  console.log(userId);
  if (userId === authUserId || isPublic) {
    console.log("Good");
    const list = await supabaseAdmin.storage
      .from("projects")
      .list(`${userId}/${id}`);
    console.log(list);
    return list;
  }
  return;
}
export async function canAccessProject(
  isPublic: boolean | undefined | null,
  ownerId: string | undefined | null,
) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const authUserId = user.data.user?.id;

  if (isPublic || ownerId === authUserId) {
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
      clusters: {
        include: {
          owner: true,
          _count: {
            select: {
              projects: true,
            },
          },
        },
      },
      comments: {
        include: {
          owner: true,
          replies: {
            include: {
              owner: true,
            },
            orderBy: {
              dateCreated: "asc",
            },
          },
        },
        orderBy: {
          dateCreated: "desc",
        },
      },
      forks: {
        where: {
          isPublic: true,
        },
        include: {
          owner: true,
        },
      },
      parent: {
        include: {
          owner: true,
        },
      },
    },
  });
  if (!(await canAccessProject(project?.isPublic, project?.profileId))) return;
  return project;
}

export async function getProjectComments(projectId: string) {
  const comments = await prisma.comment.findMany({
    where: {
      projectId: projectId,
    },
    include: {
      owner: true,
      replies: {
        include: {
          owner: true,
          Comment: true,
        },
        orderBy: {
          dateCreated: "asc",
        },
      },
    },
    orderBy: {
      dateCreated: "desc",
    },
  });

  return comments;
}

export async function getProjectLikes(projectId: string) {
  const likes = await prisma.like.count({
    where: {
      projectId: projectId,
    },
  });
  return likes;
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

export async function getProfileProjects(profileId: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const authUserId = user.data.user?.id;

  /*const projects = await prisma.profile.findUnique({
    where: {
      username: profileUsername
    },
    include: {
      projects: true,
    }
  })*/
  if (authUserId === profileId) {
    const projects = await prisma.project.findMany({
      where: {
        owner: {
          id: profileId,
        },
      },
      include: {
        owner: true,
      },
    });
    return projects;
  } else {
    const projects = await prisma.project.findMany({
      where: {
        AND: [
          {
            owner: {
              id: profileId,
            },
          },
          { isPublic: true },
        ],
      },
      include: {
        owner: true,
      },
      orderBy: {
        datePublished: "desc",
      },
    });

    return projects;
  }
}

export async function getProfileReceivedComments(profileUsername: string) {
  const comments = await prisma.profile.findUnique({
    where: {
      username: profileUsername,
    },
    select: {
      receivedComments: {
        include: {
          owner: true,
          targetProf: true,
          replies: {
            include: {
              owner: true,
              Comment: true,
            },
            orderBy: {
              dateCreated: "asc",
            },
          },
        },
        orderBy: {
          dateCreated: "desc",
        },
      },
    },
  });

  return comments?.receivedComments;
}

export async function searchProjects(query: string, page: number) {
  const results = await prisma.project.findMany({
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
      isPublic: true,
    },
    include: {
      owner: true,
    },

    skip: (page - 1) * 10,
    take: 10,
  });
  return results;
}

export async function countSearchProjects(query: string) {
  const count = await prisma.project.count({
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
      isPublic: true,
    },
  });
  return count;
}
export async function getFileUrl(
  userId: string,
  projectId: string,
  fileName: string,
  isPublic: boolean,
) {
  const supabaseAdmin = await createAdminClient();
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const authUserId = user.data.user?.id;

  console.log("File URL Details");
  console.log(authUserId);
  console.log(userId);
  if (userId === authUserId || isPublic) {
    console.log("good, authorizing");
    const { data: dataUrl } = supabaseAdmin.storage
      .from("projects")
      .getPublicUrl(`/${userId}/${projectId}/${fileName}`);
    return dataUrl;
  }
  return;
}
export async function getHomeProfileInfo(authUserId: string) {
  return await prisma.profile.findUnique({
    where: {
      id: authUserId,
    },
    include: {
      _count: {
        select: {
          clusters: true,
          projects: true,
          followers: true,
          following: true,
        },
      },
    },
  });
}
export async function getCommentReplies(commentId: string) {
  const replies = await prisma.reply.findMany({
    where: {
      commentId: commentId,
    },
    include: {
      owner: true,
      Comment: true,
    },
    orderBy: {
      dateCreated: "desc",
    },
  });

  return replies;
}
export async function getUserLikedProjects(userId: string) {
  const projects = await prisma.like.findMany({
    where: {
      profileId: userId,
    },
  });
  return projects;
}
export async function isLiked(projectId: string, userId: string) {
  const isLiked = await prisma.like.count({
    where: {
      projectId: projectId,
      profileId: userId,
    },
  });
  return isLiked > 0;
}
export async function getFeatured() {
  const projects = await prisma.project.findMany({
    where: {
      isFeatured: true,
      isPublic: true,
    },
    orderBy: {
      featureDate: "asc",
    },
    include: {
      owner: true,
    },
    take: 5,
  });
  return projects;
}
export async function getTopLiked() {
  const projects = await prisma.project.findMany({
    where: {
      isPublic: true,
    },
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
    include: {
      owner: true,
    },
    take: 10,
  });
  return projects;
}
export async function getCluster(id: string) {
  const cluster = await prisma.cluster.findUnique({
    where: {
      id: id,
    },
    include: {
      owner: true,
      projects: {
        where: {
          isPublic: true,
        },
        include: {
          owner: true,
        },
        orderBy: {
          datePublished: "desc",
        },
      },
      followers: true,
      _count: {
        select: {
          followers: true,
          projects: true,
        },
      },
    },
  });
  return cluster;
}

export async function getReply(id: string) {
  const reply = await prisma.reply.findUnique({
    where: {
      id: id,
    },
    include: {
      Comment: true,
    },
  });

  return reply;
}

export async function isClusterFollower(
  currentUserId: string,
  clusterId: string,
) {
  const follower = await prisma.cluster.findUnique({
    where: {
      id: clusterId,
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
    follower &&
    follower.followers &&
    follower.followers.length > 0 &&
    follower.followers[0].id === currentUserId
  ) {
    return true;
  } else {
    return false;
  }
}

export async function getClusterFollowers(clusterId: string) {
  const followers = await prisma.cluster.findUnique({
    where: {
      id: clusterId,
    },
    select: {
      followers: true,
    },
  });

  return followers?.followers;
}
export async function getIotm() {
  const cluster = await prisma.cluster.findFirst({
    where: {
      isIotm: true,
    },
    include: {
      owner: true,
      projects: {
        where: {
          isPublic: true,
        },
        include: {
          owner: true,
        },
        orderBy: {
          datePublished: "desc",
        },
        take: 5,
      },
      followers: true,
      _count: {
        select: {
          projects: true,
        },
      },
    },
  });
  return cluster;
}
