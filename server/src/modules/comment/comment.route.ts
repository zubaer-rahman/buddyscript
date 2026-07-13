import { Router } from "express";
import { CommentController } from "./comment.controller.js";
import { auth } from "../../middlewares/auth.js";
import { uploadImage } from "../../utils/uploadImage.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { CommentValidation } from "./comment.validation.js";

const router = Router();

router.post(
  "/",
  auth,
  uploadImage.single("image"),
  validateRequest(CommentValidation.createCommentSchema),
  CommentController.createComment,
);

export const CommentRoutes = router;
