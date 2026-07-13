import { z } from "zod";

const createCommentSchema = z.object({
  text: z.string().min(1, "Comment text is required"),
  postId: z.string().min(1, "Post ID is required"),
});

export const CommentValidation = {
  createCommentSchema,
};
