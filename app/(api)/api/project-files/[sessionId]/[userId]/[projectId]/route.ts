import prisma from "@/app/lib/db";
import { getProjectSession } from "@/app/lib/data";
import { listProjectFiles } from "@/lib/storage";
import moment from "moment";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ sessionId: string; userId: string; projectId: string }>;
  },
) {
  const { sessionId, userId, projectId } = await params;
  const session = await getProjectSession(sessionId, projectId);

  if (!session)
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

  const projectFiles = await listProjectFiles(userId, projectId);

  if (!projectFiles.length) {
    return Response.json({
      packages: [],
    });
  }

  const fileUrls = projectFiles.map((file) => [
    `${process.env.DEPLOY_URL}/api/project-files/${sessionId}/${userId}/${projectId}/${file.name}?ts=${Date.now()}`,
    `./${file.name}`,
  ]);

  return Response.json({
    packages: [],
    files: Object.fromEntries(fileUrls),
  });
}
