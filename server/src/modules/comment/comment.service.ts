import prisma from "../../lib/prisma";
import ICreateCommentPayload from "./comment.interface.js";

const createComment = async (
  authorId: string,
  payload: ICreateCommentPayload,
) => {
  const comment = await prisma.comment.create({
    data: {
      authorId,
      ...payload,
    },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true, avatar: true },
      },
    },
  });

  return comment;
};

export const CommentService = {
  createComment,
};
