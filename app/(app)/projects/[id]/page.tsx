import {
  changeDescription,
  decrementLikes,
  feature,
  incrementLikes,
  unfeature,
} from "@/app/lib/actions";
import { getProfile, getProject, getProjectLikes, isLiked } from "@/app/lib/data";
import ProjectPreviewPageUI from "@/components/projects/project-preview-page";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function ProjectPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if(!user.data.user) {
    throw new Error("Could not get current user while accessing project.")
  }

  const project = await getProject(id);

  if (!project) notFound();

  const canEditInfo = project.owner?.id === (user.data.user?.id as string);
  const likes = await getProjectLikes(id);
  const liked = await isLiked(id, user.data.user?.id as string);
  const userDb = await getProfile(user.data.user?.id as string)

  async function handleSaveDesc(newDesc: string) {
    "use server";
    await changeDescription(id, newDesc);
  }
  async function handleLike() {
    "use server";
    if (liked) await decrementLikes(id);
    else await incrementLikes(id);
  }
  async function handleFeature() {
    'use server'
    await feature(id);
  }
  async function handleUnfeature() {
    'use server'
    await unfeature(id)
  }

  return (
    <ProjectPreviewPageUI
      creator={project.owner?.username as string}
      canEditInfo={canEditInfo}
      title={project.title as string}
      description={project.description as string}
      comments={project.comments}
      clusters={project.clusters}
      likes={likes as number}
      id={id}
      thumbnail={project.thumbnail ?? "/assets/placeholder-thumb.jpg"}
      forks={project.forks}
      isPublic={project.isPublic}
      parent={project.parent}
      saveDescription={handleSaveDesc}
      canEdit={canEditInfo}
      isLiked={liked}
      handleLike={handleLike}
      isAdmin={userDb?.isAdmin as boolean}
      currentUserId={user.data.user?.id}
      project={project}
      projectId={project.id}
    />
  );
}
