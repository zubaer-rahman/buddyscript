import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import httpStatus from "http-status";
import IToggleLikePayload from "./like.interface.js";

const toggleLike = async (userId: string, payload: IToggleLikePayload) => {
  const { entityType, entityId: id } = payload;

  switch (entityType) {
    case "post": {
      const existing = await prisma.like.findUnique({
        where: { postId_userId: { postId: id, userId } },
      });

      if (existing) {
        await prisma.$transaction([
          prisma.like.delete({
            where: { postId_userId: { postId: id, userId } },
          }),
          prisma.post.update({
            where: { id },
            data: { likeCount: { decrement: 1 } },
          }),
        ]);
        return { liked: false, message: "Post unliked" };
      }

      await prisma.$transaction([
        prisma.like.create({ data: { postId: id, userId } }),
        prisma.post.update({
          where: { id },
          data: { likeCount: { increment: 1 } },
        }),
      ]);
      return { liked: true, message: "Post liked" };
    }

    case "comment": {
      const existing = await prisma.commentLike.findUnique({
        where: { commentId_userId: { commentId: id, userId } },
      });

      if (existing) {
        await prisma.$transaction([
          prisma.commentLike.delete({
            where: { commentId_userId: { commentId: id, userId } },
          }),
          prisma.comment.update({
            where: { id },
            data: { likeCount: { decrement: 1 } },
          }),
        ]);
        return { liked: false, message: "Comment unliked" };
      }

      await prisma.$transaction([
        prisma.commentLike.create({ data: { commentId: id, userId } }),
        prisma.comment.update({
          where: { id },
          data: { likeCount: { increment: 1 } },
        }),
      ]);
      return { liked: true, message: "Comment liked" };
    }

    case "reply": {
      const existing = await prisma.replyLike.findUnique({
        where: { replyId_userId: { replyId: id, userId } },
      });

      if (existing) {
        await prisma.$transaction([
          prisma.replyLike.delete({
            where: { replyId_userId: { replyId: id, userId } },
          }),
          prisma.reply.update({
            where: { id },
            data: { likeCount: { decrement: 1 } },
          }),
        ]);
        return { liked: false, message: "Reply unliked" };
      }

      await prisma.$transaction([
        prisma.replyLike.create({ data: { replyId: id, userId } }),
        prisma.reply.update({
          where: { id },
          data: { likeCount: { increment: 1 } },
        }),
      ]);
      return { liked: true, message: "Reply liked" };
    }

    default:
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid entity type");
  }
};

export const LikeService = {
  toggleLike,
};
