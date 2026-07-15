import { z } from "zod";

const createPostSchema = z.object({
  text: z.string().min(1, "Post text is required"),
  isPrivate: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
});

const updatePostSchema = z.object({
  text: z.string().min(1, "Post text is required").optional(),
  isPrivate: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
});

export const PostValidation = {
  createPostSchema,
  updatePostSchema,
};
