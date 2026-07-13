import { Router } from "express";
import { ReplyController } from "./reply.controller.js";
import { auth } from "../../middlewares/auth.js";
import { uploadImage } from "../../utils/uploadImage.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { ReplyValidation } from "./reply.validation.js";

const router = Router();

router.post(
  "/",
  auth,
  uploadImage.single("image"),
  validateRequest(ReplyValidation.createReplySchema),
  ReplyController.createReply,
);

export const ReplyRoutes = router;
