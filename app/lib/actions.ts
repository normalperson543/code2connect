"use server";

import { redirect } from "next/navigation";
import prisma from "./db";
import { createClient } from "@/lib/supabase/server";

export async function createProject() {
  //const supabase = await createClient();
  //const user = await supabase.auth.getUser();

  console.log("Creating");
  const project = await prisma.project.create({
    data: {
      title: "Your amazing project",
      /*owner: {
        connect: {
          id: user.data.user?.id
        }
      }*/
    },
  });
  redirect(`/projects/${project.id}/editor`);
}

export async function renameProject(projectId: string, title: string) {
  const supabase = await createClient();

  //const user = await supabase.auth.getUser();
  //const userId = user.data.user?.id as string;

  /*console.log(userId) //TODO: add verify logic
  const project = await getProject(projectId);

  if (!project || project.owner?.id !== userId) {
    throw new Error("Unauthorized")
  }*/
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
