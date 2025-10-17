import { getProject } from "@/app/lib/data";
import Editor from "@/components/projects/editor/editor";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes

  const { id } = await params;

  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const project = await getProject(id, user.data.user?.id as string);

  if (!project) notFound();

  const canEditInfo = project.owner?.id === (user.data.user?.id as string);

  return (
    <>
      <Editor
        creator={project.owner?.username as string}
        canEditInfo={canEditInfo}
        description={project.description as string}
        previewUrl={process.env.PREVIEW_URL as string}
        id={id}
        title={project.title as string}
      />
    </>
  );
}
