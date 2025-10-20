import { changeDescription } from "@/app/lib/actions";
import { getProject, getProjectLikes } from "@/app/lib/data";
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

  const project = await getProject(id);

  if (!project) notFound();

  const canEditInfo = project.owner?.id === (user.data.user?.id as string);
  const likes = await getProjectLikes(id);

  async function handleSaveDesc(newDesc: string) {
    "use server";
    await changeDescription(id, newDesc);
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
    />
  );
}
