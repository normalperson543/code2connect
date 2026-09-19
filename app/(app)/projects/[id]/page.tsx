import {
  changeDescription,
  decrementLikes,
  incrementLikes,
} from "@/app/lib/actions";
import {
  getProfile,
  getProject,
  getProjectComments,
  getProjectLikes,
  isLiked,
} from "@/app/lib/data";
import ProjectPreviewPageUI from "@/components/projects/project-preview-page";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function ProjectPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getSession();
  if (!session?.user) {
    throw new Error("Could not get current user while accessing project.");
  }

  const project = await getProject(id);

  if (!project) notFound();

  const canEditInfo = project.owner?.id === session.user.id;
  const likes = await getProjectLikes(id);
  const liked = await isLiked(id, session.user.id);
  const userDb = await getProfile(session.user.id);
  const projectComments = await getProjectComments(project.id);

  async function handleSaveDesc(newDesc: string) {
    "use server";
    await changeDescription(id, newDesc);
  }
  async function handleLike() {
    "use server";
    if (liked) await decrementLikes(id);
    else await incrementLikes(id);
  }
  return (
    <ProjectPreviewPageUI
      creator={project.owner?.username as string}
      canEditInfo={canEditInfo}
      title={project.title as string}
      description={project.description as string}
      comments={projectComments}
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
      currentUserId={session.user.id}
      project={project}
      projectId={project.id}
      currentUsername={userDb?.username as string}
      datePublished={project.datePublished}
    />
  );
}
