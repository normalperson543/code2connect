import { getProject } from "@/app/lib/data";
import Editor from "@/components/projects/editor/editor";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getSession();
  const project = await getProject(id);

  if (!project) notFound();

  const canEditInfo = project.owner?.id === session?.user?.id;

  return (
    <Editor
      creator={project.owner?.username as string}
      canEditInfo={canEditInfo}
      description={project.description as string}
      previewUrl={process.env.PREVIEW_URL as string}
      id={id}
      title={project.title as string}
      isPublic={project.isPublic}
      creatorId={project.owner?.id as string}
    />
  );
}
