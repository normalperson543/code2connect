"use server";

import { redirect } from "next/navigation";
import prisma from "./db";
import { createClient } from "@/lib/supabase/server";
import { canAccessProject, getProject } from "./data";
import { updateSession } from "@/lib/supabase/middleware";
import { revalidatePath } from "next/cache";

export async function createProject() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  console.log("Creating");
  const project = await prisma.project.create({
    data: {
      title: "Your amazing project",
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

export async function renameProject(projectId: string, title: string) {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id as string;

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
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  console.log("Creating");

  const old = await getProject(projectId);

  if (!old) throw new Error("Cannot find old project");
  const project = await prisma.project.create({
    data: {
      title: `Fork of ${old.title}`,
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
  const { data: projectFiles } = await supabase.storage
    .from("projects")
    .list(`${user.data.user?.id}/${old.id}`);
  console.log("about to copy!!!");
  if (projectFiles) {
    console.log("Copying");
    for (const file of projectFiles) {
      console.log(file);
      console.log(
        `${user.data.user?.id}/${old.id}/${file.name}`,
        `/${user.data.user?.id}/${project.id}/${file.name}`
      );
      await supabase.storage
        .from("projects")
        .copy(
          `${user.data.user?.id}/${old.id}/${file.name}`,
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
}

export async function setThumbnail(projectId: string, thumbUrl: string) {
  console.log("The thumb being set is " + thumbUrl);
  console.log(projectId);
  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      thumbnail: thumbUrl,
    },
  });
  return project;
}

export async function createProfileComment(
  ownerId: string,
  targetId: string,
  content: string
) {
  const comment = await prisma.comment.create({
    data: {
      profileId: ownerId,
      targetId: targetId,
      contents: content
    },
  });

  return comment
}

export async function shareProject(id: string) {
  const project = await prisma.project.update({
    where: {
      id: id,
    },
    data: {
      isPublic: true,
      datePublished: new Date(),
    },
  });
  revalidatePath(`/projects/${id}`)
  redirect(`/projects/${id}?shared=1`)
  return project;
}
