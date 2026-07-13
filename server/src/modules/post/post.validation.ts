import { z } from "zod";

const createPostSchema = z.object({
  text: z.string().min(1, "Post text is required"),
  isPrivate: z.coerce.boolean().optional(),
});

const updatePostSchema = z.object({
  text: z.string().min(1, "Post text is required").optional(),
  isPrivate: z.coerce.boolean().optional(),
});

export const PostValidation = {
  createPostSchema,
  updatePostSchema,
};
