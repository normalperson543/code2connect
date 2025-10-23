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
      "print('Hello, World!')",
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
  if (projectFiles) {
    for (const file of projectFiles) {
      await supabaseAdmin.storage
        .from("projects")
        .copy(
          `${old.owner?.id as string}/${old.id}/${file.name}`,
          `${user.data.user?.id}/${project.id}/${file.name}`,
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

  await prisma.profile.update({
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
  followerId: string,
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

  await prisma.profile.update({
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
) {
  const comment = await prisma.comment.create({
    data: {
      profileId: ownerId,
      targetId: targetId,
      contents: content,
    },
    include: {
      targetProf: true,
    },
  });

  revalidatePath(`/profile/${comment.targetProf?.username}`);
  redirect(`/profile/${comment.targetProf?.username}`);

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
      replies: true,
    },
  });

  if (comment.replies && comment.replies.length > 0) {
    comment.replies.forEach(async (reply) => {
      await prisma.reply.delete({
        where: {
          id: reply.id,
        },
      });
    });
  }

  revalidatePath(`/profile/${comment.targetProf?.username}`);
  redirect(`/profile/${comment.targetProf?.username}`);
}

export async function togglePinProfileComment(
  id: string,
  currentPinStatus: boolean,
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
  content: string,
) {
  const replier = await prisma.profile.findUnique({
    where: {
      id: replierId,
    },
  });

  if (!replier) {
    throw new Error(
      "Could not find replier's profile when making profile comment reply.",
    );
  }

  const reply = await prisma.reply.create({
    data: {
      profileId: replier.id,
      commentId: commentId,
      contents: content,
    },
    include: {
      Comment: {
        include: {
          targetProf: true,
        },
      },
    },
  });

  revalidatePath(`/profile/${reply.Comment?.targetProf?.username}`);
  redirect(`/profile/${reply.Comment?.targetProf?.username}`);
}

export async function deleteProfileCommentReply(replyId: string) {
  const reply = await prisma.reply.delete({
    where: {
      id: replyId,
    },
    include: {
      owner: true,
      Comment: {
        include: {
          targetProf: true,
        },
      },
    },
  });

  revalidatePath(`/profile/${reply.Comment?.targetProf?.username}`);
  redirect(`/profile/${reply.Comment?.targetProf?.username}`);

  return reply;
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
      featureDate: new Date(),
    },
  });
  return project;
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
  return project;
}

export async function createProjectComment(
  commenterId: string,
  projectId: string,
  content: string,
) {
  const comment = await prisma.comment.create({
    data: {
      profileId: commenterId,
      projectId: projectId,
      contents: content,
    },
  });

  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);

  return comment;
}

export async function deleteProjectComment(commentId: string) {
  const comment = await prisma.comment.delete({
    where: {
      id: commentId,
    },
    include: {
      replies: true,
    },
  });

  if (comment.replies && comment.replies.length > 0) {
    comment.replies.forEach(async (reply) => {
      await prisma.reply.delete({
        where: {
          id: reply.id,
        },
      });
    });
  }

  revalidatePath(`/projects/${comment.projectId}`);
  redirect(`/projects/${comment.projectId}`);

  return comment;
}

export async function createProjectCommentReply(
  commentId: string,
  replierId: string,
  content: string,
) {
  const replier = await prisma.profile.findUnique({
    where: {
      id: replierId,
    },
  });

  if (!replier) {
    throw new Error(
      "Could not find replier's profile when making project comment reply.",
    );
  }

  const reply = await prisma.reply.create({
    data: {
      profileId: replier.id,
      commentId: commentId,
      contents: content,
    },
    include: {
      Comment: true,
    },
  });

  revalidatePath(`/projects/${reply.Comment?.projectId}`);
  redirect(`/projects/${reply.Comment?.projectId}`);

  return reply;
}

export async function deleteProjectCommentReply(id: string) {
  const reply = await prisma.reply.delete({
    where: {
      id: id,
    },
    include: {
      Comment: true,
    },
  });

  revalidatePath(`/projects/${reply.Comment?.projectId}`);
  redirect(`/projects/${reply.Comment?.projectId}`);

  return reply;
}

export async function togglePinProjectComment(
  id: string,
  currentPinStatus: boolean,
) {
  const selectedComment = await prisma.comment.findUnique({
    where: {
      id: id,
    },
  });

  if (!currentPinStatus && selectedComment?.projectId) {
    await prisma.comment.updateMany({
      where: {
        projectId: selectedComment.projectId,
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
    data: {
      isPinned: !currentPinStatus,
    },
  });

  revalidatePath(`/projects/${comment.projectId}`);
  redirect(`/projects/${comment.projectId}`);

  return comment;
}

export async function changeClusterDescription(
  id: string,
  description: string,
) {
  const cluster = await prisma.cluster.update({
    where: {
      id: id,
    },
    data: {
      description: description,
    },
  });
  return cluster;
}
export async function addProjectToCluster(
  clusterId: string,
  projectId: string,
) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (!project || !project.isPublic)
    throw new Error("Project does not exist or is not public.");
  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      clusters: {
        connect: {
          id: clusterId,
        },
      },
    },
  });
  revalidatePath(`/clusters/${clusterId}`);
  return;
}
export async function removeProjectFromCluster(
  clusterId: string,
  projectId: string,
) {
  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      clusters: {
        disconnect: {
          id: clusterId,
        },
      },
    },
  });
  revalidatePath(`/clusters/${clusterId}`);
}

export async function changeCollabStatus(
  clusterId: string,
  allowCollab: boolean,
) {
  await prisma.cluster.update({
    where: {
      id: clusterId,
    },
    data: {
      allowCollab: allowCollab,
    },
  });
  revalidatePath(`/clusters/${clusterId}`);
}
export async function deleteCluster(clusterId: string) {
  await prisma.cluster.delete({
    where: {
      id: clusterId,
    },
  });
  revalidatePath(`/clusters/${clusterId}`);
}
export async function setClusterThumbnail(clusterId: string, thumbUrl: string) {
  await prisma.cluster.update({
    where: {
      id: clusterId,
    },
    data: {
      thumbnail: thumbUrl,
    },
  });
  revalidatePath(`/clusters/${clusterId}`);
}
export async function renameCluster(clusterId: string, newName: string) {
  await prisma.cluster.update({
    where: {
      id: clusterId,
    },
    data: {
      title: newName,
    },
  });
}
export async function addClusterFollower(
  clusterId: string,
  followerId: string,
) {
  await prisma.cluster.update({
    where: {
      id: clusterId,
    },
    data: {
      followers: {
        connect: {
          id: followerId,
        },
      },
    },
  });

  revalidatePath(`/clusters/${clusterId}`);
  redirect(`/clusters/${clusterId}`);
}

export async function removeClusterFollower(
  clusterId: string,
  followerId: string,
) {
  await prisma.cluster.update({
    where: {
      id: clusterId,
    },
    data: {
      followers: {
        disconnect: {
          id: followerId,
        },
      },
    },
  });

  revalidatePath(`/clusters/${clusterId}`);
  redirect(`/clusters/${clusterId}`);
}
export async function setClusterAsIotm(clusterId: string) {
  const cluster = await prisma.cluster.update({
    where: {
      id: clusterId,
    },
    data: {
      isIotm: true,
    },
  });
  return cluster;
}
export async function unsetClusterAsIotm(clusterId: string) {
  const cluster = await prisma.cluster.update({
    where: {
      id: clusterId,
    },
    data: {
      isIotm: false,
    },
  });
  return cluster;
}

export async function createClusterComment(
  commenterId: string,
  clusterId: string,
  content: string,
) {
  await prisma.comment.create({
    data: {
      profileId: commenterId,
      clusterId: clusterId,
      contents: content,
    },
  });

  revalidatePath(`/clusters/${clusterId}`);
  redirect(`/clusters/${clusterId}`);
}

export async function deleteClusterComment(commentId: string) {
  const comment = await prisma.comment.delete({
    where: {
      id: commentId,
    },
    include: {
      replies: true,
    },
  });

  if (comment.replies && comment.replies.length > 0) {
    comment.replies.forEach(async (reply) => {
      await prisma.reply.delete({
        where: {
          id: reply.id,
        },
      });
    });
  }

  revalidatePath(`/clusters/${comment.clusterId}`);
  redirect(`/clusters/${comment.clusterId}`);
}

export async function createClusterCommentReply(
  commentId: string,
  replierId: string,
  content: string,
) {
  const replier = await prisma.profile.findUnique({
    where: {
      id: replierId,
    },
  });

  if (!replier) {
    throw new Error(
      "Could not find replier's profile when making cluster comment reply",
    );
  }

  const reply = await prisma.reply.create({
    data: {
      profileId: replierId,
      commentId: commentId,
      contents: content,
    },
    include: {
      Comment: true,
    },
  });

  revalidatePath(`/clusters/${reply.Comment?.clusterId}`);
  redirect(`/clusters/${reply.Comment?.clusterId}`);
}

export async function deleteClusterCommentReply(id: string) {
  const reply = await prisma.reply.delete({
    where: {
      id: id,
    },
    include: {
      Comment: true,
    },
  });

  revalidatePath(`/clusters/${reply.Comment?.clusterId}`);
  redirect(`/clusters/${reply.Comment?.clusterId}`);
}

export async function togglePinClusterComment(
  id: string,
  currentPinStatus: boolean,
) {
  const selectedComment = await prisma.comment.findUnique({
    where: {
      id: id,
    },
  });

  if (!currentPinStatus && selectedComment?.clusterId) {
    await prisma.comment.updateMany({
      where: {
        clusterId: selectedComment.clusterId,
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
    data: {
      isPinned: !currentPinStatus,
    },
  });

  revalidatePath(`/clusters/${comment.clusterId}`);
  redirect(`/clusters/${comment.clusterId}`);
}
