import { FileInfo, Files } from "@/app/lib/files";
import Editor from "@/components/projects/editor/editor";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { useDebouncedCallback } from "use-debounce";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
  const { id } = await params;

  const supabase = await createClient(false);

  return (
    <>
      <Editor
        creator="normalperson543"
        canEditInfo={true}
        description="a description"
        previewUrl="http://localhost:5173"
        id={id}
        title="Guess the Number"
      />
    </>
  );
}
