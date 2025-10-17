import { createClient } from "@/lib/supabase/server";
import prisma from "@/app/lib/db";
import { getProjectSession } from "@/app/lib/data";
import moment from "moment";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ sessionId: string; userId: string; projectId: string }>;
  },
) {
  // This endpoint generates a PyScript compatible configuration that is
  // loaded with the Code2Connect runner.
  // PyScript handles all of the downloading of the files.

  const supabase = await createClient(true);

  const { sessionId, userId, projectId } = await params;
  console.log("Info");
  console.log(await params);
  const session = await getProjectSession(sessionId, projectId);

  if (!session)
    return new Response(JSON.stringify({ response: "Invalid ID" }), {
      status: 403,
    });
  if (moment(new Date()).isAfter(moment(session?.date).add("10", "m"))) {
    await prisma.projectSessionToken.delete({
      where: {
        id: sessionId,
      },
    });
    return new Response(JSON.stringify({ response: "Invalidated ID" }), {
      status: 403,
    });
  }

  const { data: projectFiles } = await supabase.storage
    .from("projects")
    .list(`${userId}/${projectId}`);

  let pysConfig = {};

  if (!projectFiles) {
    return {
      packages: [],
    };
  }
  const fileUrls = projectFiles.map((file) => [
    `http://localhost:3000/api/project-files/${sessionId}/${userId}/${projectId}/${file.name}?ts=${Date.now()}`,
    `./${file.name}`,
  ]);

  pysConfig = {
    packages: [],
    files: Object.fromEntries(fileUrls),
  };
  console.log(projectFiles);
  console.log(pysConfig);
  return new Response(JSON.stringify(pysConfig));
}
