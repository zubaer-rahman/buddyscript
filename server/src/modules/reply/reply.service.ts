import prisma from "../../lib/prisma.js";
import ICreateReplyPayload from "./reply.interface.js";

const createReply = async (authorId: string, payload: ICreateReplyPayload) => {
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
