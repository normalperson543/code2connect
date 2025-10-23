import { Prisma } from "@prisma/client";

export type CommentWithOwner = Prisma.CommentGetPayload<{
  include: {
    owner: true,
    replies: {
      include: {
        owner: true,
        Comment: true
      }
    }
  }
}>;
