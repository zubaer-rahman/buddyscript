import { z } from "zod";

const createReplySchema = z.object({
  text: z.string().min(1, "Reply text is required"),
  commentId: z.string().uuid("Comment ID must be a valid UUID"),
});

export const ReplyValidation = {
  createReplySchema,
};
