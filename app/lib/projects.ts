import { Prisma } from "@prisma/client";

export type ProjectWithOwner = Prisma.ProjectGetPayload<{
  include: { owner: true };
}>;
