import { z } from "zod";

const createCommentSchema = z.object({
  text: z.string().min(1, "Comment text is required"),
  postId: z.string().uuid("Post ID must be a valid UUID"),
});

export const CommentValidation = {
  createCommentSchema,
};
