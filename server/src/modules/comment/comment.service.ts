import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import httpStatus from "http-status";
import ICreateCommentPayload from "./comment.interface.js";

const createComment = async (
  authorId: string,
  payload: ICreateCommentPayload,
) => {
  const { postId } = payload;

  // Verify the post exists first
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError(httpStatus.NOT_FOUND, "Post not found");

  // Atomically create the comment and increment the post's commentCount
  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        authorId,
        ...payload,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    }),
    prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    }),
  ]);

  return comment;
};

export const CommentService = {
  createComment,
};
