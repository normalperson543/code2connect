import { Prisma } from "@prisma/client";

export type ClusterWithOwner = Prisma.ClusterGetPayload<{
  include: { owner: true; _count: { select: { projects: true } } };
}>;
