import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import httpStatus from "http-status";
import ICreateReplyPayload from "./reply.interface.js";

const createReply = async (authorId: string, payload: ICreateReplyPayload) => {
  const { commentId } = payload;

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new AppError(httpStatus.NOT_FOUND, "Comment not found");

  const reply = await prisma.reply.create({
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

  return reply;
};

export const ReplyService = {
  createReply,
};
