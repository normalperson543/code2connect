"use server";

import { redirect } from "next/navigation";
import prisma from "./db";
import { createClient } from "@/lib/supabase/server";
import { canAccessProject, getProject } from "./data";
import { revalidatePath } from "next/cache";
import { words } from "./words";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function createProject() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const title = `${words[Math.floor(Math.random() * 5459)]} ${words[Math.floor(Math.random() * 5459)]} ${words[Math.floor(Math.random() * 5459)]}`;
  const project = await prisma.project.create({
    data: {
      title: title,
      owner: {
        connect: {
          id: user.data.user?.id,
        },
      },
    },
  });
  await supabase.storage
    .from("projects")
    .upload(
      `/${user.data.user?.id}/${project.id}/main.py`,
      "print('Hello, World!')"
    );
  redirect(`/projects/${project.id}/editor`);
}
export async function createCluster() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const title = `${words[Math.floor(Math.random() * 5459)]} ${words[Math.floor(Math.random() * 5459)]} ${words[Math.floor(Math.random() * 5459)]}`;
  const cluster = await prisma.cluster.create({
    data: {
      title: title,
      owner: {
        connect: {
          id: user.data.user?.id,
        },
      },
    },
  });
  revalidatePath(`/clusters/${cluster.id}`);
  redirect(`/clusters/${cluster.id}`);
}
export async function renameProject(projectId: string, title: string) {
  const project = await getProject(projectId);

  if (!(await canAccessProject(project?.isPublic, project?.profileId))) {
    throw new Error("Couldn't find project");
  }
  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      title: title,
      dateModified: new Date(),
    },
  });
  return updatedProject;
}

export async function createAccount(username: string, userId: string) {
  const user = await prisma.profile.create({
    data: {
      id: userId,
      username: username,
    },
  });
  return user;
}
export async function fork(projectId: string) {
  const supabaseAdmin = await createAdminClient();
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const old = await getProject(projectId);

  if (!old) throw new Error("Cannot find old project");
  const project = await prisma.project.create({
    data: {
      title: `Fork of ${old.title}`,
      dateModified: new Date(),
      parent: {
        connect: {
          id: old.id,
        },
      },
      owner: {
        connect: {
          id: user.data.user?.id,
        },
      },
    },
  });
  const { data: projectFiles } = await supabaseAdmin.storage
    .from("projects")
    .list(`${old.owner?.id}/${old.id}`);
  console.log(projectFiles);
  if (projectFiles) {
    for (const file of projectFiles) {
      await supabaseAdmin.storage
        .from("projects")
        .copy(
          `${old.owner?.id as string}/${old.id}/${file.name}`,
          `${user.data.user?.id}/${project.id}/${file.name}`
        );
    }
  }
  redirect(`/projects/${project.id}/editor`);
}

export async function editProfileBio(userId: string, newBio: string) {
  const updateProfileBio = await prisma.profile.update({
    where: {
      id: userId,
    },
    data: {
      bio: newBio,
    },
  });

  return updateProfileBio;
}

export async function addProfileFollower(targetId: string, followerId: string) {
  const updatedFollower = await prisma.profile.update({
    where: {
      id: targetId,
    },
    data: {
      followers: {
        connect: {
          id: followerId,
        },
      },
    },
  });

  const updatedFollowing = await prisma.profile.update({
    where: {
      id: followerId,
    },
    data: {
      following: {
        connect: {
          id: targetId,
        },
      },
    },
  });

  revalidatePath(`/profile/${updatedFollower.username}`);
  redirect(`/profile/${updatedFollower.username}`);
}

export async function removeProfileFollower(
  profileId: string,
  followerId: string
) {
  const updatedFollower = await prisma.profile.update({
    where: {
      id: profileId,
    },
    data: {
      followers: {
        disconnect: {
          id: followerId,
        },
      },
    },
  });

  const updatedFollowing = await prisma.profile.update({
    where: {
      id: followerId,
    },
    data: {
      following: {
        disconnect: {
          id: profileId,
        },
      },
    },
  });

  revalidatePath(`/profile/${updatedFollower.username}`);
  redirect(`/profile/${updatedFollower.username}`);
}

export async function setThumbnail(projectId: string, thumbUrl: string) {
  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      thumbnail: thumbUrl,
      dateModified: new Date(),
    },
  });
  return project;
}

export async function createProfileComment(
  ownerId: string,
  targetId: string,
  content: string,
  targetUsername: string
) {
  const comment = await prisma.comment.create({
    data: {
      profileId: ownerId,
      targetId: targetId,
      contents: content,
    },
  });

  revalidatePath(`/profile/${targetUsername}`);
  redirect(`/profile/${targetUsername}`);

  return comment;
}

export async function shareProject(id: string) {
  await prisma.project.update({
    where: {
      id: id,
    },
    data: {
      isPublic: true,
      datePublished: new Date(),
      dateModified: new Date(),
    },
  });
  revalidatePath(`/projects/${id}`);
  redirect(`/projects/${id}?shared=1`);
}

export async function unshareProject(id: string) {
  await prisma.project.update({
    where: {
      id: id,
    },
    data: {
      isPublic: false,
      dateModified: new Date(),
    },
  });
  await prisma.projectSessionToken.deleteMany({
    //invalidate all session tokens
    where: {
      projectId: id,
    },
  });
  revalidatePath(`/projects/${id}`);
  redirect(`/projects/${id}`);
}

export async function deleteProject(id: string, profileName: string) {
  await prisma.project.delete({
    where: {
      id: id,
    },
  });
  revalidatePath(`/profile/${profileName}`);
  redirect(`/profile/${profileName}`);
}

export async function changeDescription(id: string, desc: string) {
  return await prisma.project.update({
    where: {
      id: id,
    },
    data: {
      description: desc,
      dateModified: new Date(),
    },
  });
}

export async function deleteProfileComment(id: string) {
  const comment = await prisma.comment.delete({
    where: {
      id: id,
    },
    include: {
      targetProf: true,
    },
  });

  revalidatePath(`/profile/${comment.targetProf?.username}`);
  redirect(`/profile/${comment.targetProf?.username}`);
}

export async function togglePinProfileComment(
  id: string,
  currentPinStatus: boolean
) {
  const selectedComment = await prisma.comment.findUnique({
    where: {
      id: id,
    },
    include: {
      targetProf: true,
    },
  });

  if (!currentPinStatus) {
    await prisma.comment.updateMany({
      where: {
        targetId: selectedComment?.targetId,
        NOT: {
          id: id,
        },
      },
      data: {
        isPinned: false,
      },
    });
  }

  const comment = await prisma.comment.update({
    where: {
      id: id,
    },
    include: {
      targetProf: true,
    },
    data: {
      isPinned: !currentPinStatus,
    },
  });

  revalidatePath(`/profile/${comment.targetProf?.username}`);
  redirect(`/profile/${comment.targetProf?.username}`);
}

export async function createProfileCommentReply(
  commentId: string,
  replierId: string,
  content: string
) {
  const reply = await prisma.reply.create({
    data: {
      profileId: replierId,
      commentId: commentId,
      contents: content,
    },
  });

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      targetProf: true,
    },
  });

  revalidatePath(`/profile/${comment?.targetProf?.username}`);
  redirect(`/profile/${comment?.targetProf?.username}`);
}
export async function incrementLikes(projectId: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  await prisma.like.create({
    data: {
      projectId: projectId,
      profileId: user.data.user?.id as string,
    },
  });
  revalidatePath(`/projects/${projectId}`);
}
export async function decrementLikes(projectId: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  await prisma.like.delete({
    where: {
      likeId: {
        projectId: projectId,
        profileId: user.data.user?.id as string,
      },
    },
  });
}
export async function feature(projectId: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const userDb = await prisma.profile.findUnique({
    where: { id: user.data.user?.id as string },
  });

  if (!userDb || !userDb.isAdmin) return;

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      isFeatured: true,
    },
  });
  return project
}
export async function unfeature(projectId: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const userDb = await prisma.profile.findUnique({
    where: { id: user.data.user?.id as string },
  });

  if (!userDb || !userDb.isAdmin) return;

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      isFeatured: false,
    },
  });
  return project
}

