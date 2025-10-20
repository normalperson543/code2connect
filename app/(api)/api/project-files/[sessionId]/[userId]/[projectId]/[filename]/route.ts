import { createClient } from "@/lib/supabase/server";
import prisma from "@/app/lib/db";
import { getProjectSession } from "@/app/lib/data";
import moment from "moment";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      sessionId: string;
      userId: string;
      projectId: string;
      filename: string;
    }>;
  },
) {
  const supabase = await createClient(true);

  const { sessionId, userId, projectId, filename } = await params;

  const session = await getProjectSession(sessionId, projectId);

  if (!session || session.projectId !== projectId)
    return Response.json(
      { response: "Unauthorized" },
      {
        status: 403,
      },
    );
  if (moment(new Date()).isAfter(moment(session?.date).add("10", "m"))) {
    await prisma.projectSessionToken.delete({
      where: {
        id: sessionId,
      },
    });
    return Response.json(
      { response: "Unauthorized" },
      {
        status: 403,
      },
    );
  }

  const { data: dataUrl } = supabase.storage
    .from("projects")
    .getPublicUrl(`/${userId}/${projectId}/${filename}`);
  const fetched = await fetch(`${dataUrl.publicUrl}?t=${Date.now()}`, {
    cache: "no-store",
  });

  return new Response(await fetched.blob());
}
