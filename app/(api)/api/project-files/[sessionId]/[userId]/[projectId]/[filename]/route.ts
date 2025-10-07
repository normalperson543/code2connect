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

  console.log(params);
  const { sessionId, userId, projectId, filename } = await params;

  const session = await getProjectSession(sessionId, projectId);

  if (!session || session.projectId !== projectId)
    return new Response(JSON.stringify({ response: "Unauthorized" }), {
      status: 403,
    });
  if (moment(new Date()).isAfter(moment(session?.date).add("10", "m"))) {
    console.log("Renewing");
    await prisma.projectSessionToken.delete({
      where: {
        id: sessionId,
      },
    });
    return new Response(JSON.stringify({ response: "Unauthorized" }), {
      status: 403,
    });
  }

  const { data: dataUrl } = supabase.storage
    .from("projects")
    .getPublicUrl(`/${userId}/${projectId}/${filename}`);
  const fetched = await fetch(`${dataUrl.publicUrl}?t=${Date.now()}`, {
    cache: "no-store",
  });

  return new Response(await fetched.blob());
}
