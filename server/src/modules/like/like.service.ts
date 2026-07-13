import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import httpStatus from "http-status";
import IToggleLikePayload from "./like.interface.js";

const toggleLike = async (userId: string, payload: IToggleLikePayload) => {
  const { entityType, entityId: id } = payload;
  let existing;

  switch (entityType) {
    case "post": {
      const post = await prisma.post.findUnique({ where: { id } });
      if (!post) throw new AppError(httpStatus.NOT_FOUND, "Post not found");

      existing = await prisma.like.findUnique({
        where: { postId_userId: { postId: id, userId } },
      });

      if (existing) {
        await prisma.like.delete({ where: { id: existing.id } });
        return { liked: false, message: "Post unliked" };
      }

      await prisma.like.create({ data: { postId: id, userId } });
      return { liked: true, message: "Post liked" };
    }

    case "comment": {
      const comment = await prisma.comment.findUnique({
        where: { id },
      });
      if (!comment)
        throw new AppError(httpStatus.NOT_FOUND, "Comment not found");

      existing = await prisma.commentLike.findUnique({
        where: { commentId_userId: { commentId: id, userId } },
      });

      if (existing) {
        await prisma.commentLike.delete({ where: { id: existing.id } });
        return { liked: false, message: "Comment unliked" };
      }

      await prisma.commentLike.create({
        data: { commentId: id, userId },
      });
      return { liked: true, message: "Comment liked" };
    }

    case "reply": {
      const reply = await prisma.reply.findUnique({ where: { id } });
      if (!reply) throw new AppError(httpStatus.NOT_FOUND, "Reply not found");

      existing = await prisma.replyLike.findUnique({
        where: { replyId_userId: { replyId: id, userId } },
      });

      if (existing) {
        await prisma.replyLike.delete({ where: { id: existing.id } });
        return { liked: false, message: "Reply unliked" };
      }

      await prisma.replyLike.create({ data: { replyId: id, userId } });
      return { liked: true, message: "Reply liked" };
    }

    default:
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid entity type");
  }
};

export const LikeService = {
  toggleLike,
};
