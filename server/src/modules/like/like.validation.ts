import { z } from "zod";

const toggleLikeSchema = z.object({
  entityType: z.enum(["post", "comment", "reply"], {
    error: "entityType must be one of: post, comment, reply",
  }),
  entityId: z.string().uuid("entityId must be a valid UUID"),
});

export const LikeValidation = {
  toggleLikeSchema,
};
