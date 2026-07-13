import { z } from "zod";

const createReplySchema = z.object({
  text: z.string().min(1, "Reply text is required"),
  commentId: z.string().min(1, "Comment ID is required"),
});

export const ReplyValidation = {
  createReplySchema,
};
