import { Prisma } from "@prisma/client";

export type ClusterWithOwner = Prisma.ClusterGetPayload<{
  include: {
    owner: true;
    _count: { select: { projects: true } };
  };
}>;

export type ClusterWithOwnerAndProjects = Prisma.ClusterGetPayload<{
  include: {
    owner: true;
    projects: {
      include: {
        owner: true;
      };
    };
    _count: { select: { projects: true } };
  };
}>;
