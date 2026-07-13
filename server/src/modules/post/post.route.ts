import { Router } from "express";
import { PostController } from "./post.controller.js";
import { uploadImage } from "../../utils/uploadImage.js";
import { auth } from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { PostValidation } from "./post.validation.js";

const router = Router();

router.post(
  "/",
  auth,
  uploadImage.single("image"),
  validateRequest(PostValidation.createPostSchema),
  PostController.createPost,
);
router.get("/", auth, PostController.getFeed);
router.patch(
  "/:id",
  auth,
  uploadImage.single("image"),
  validateRequest(PostValidation.updatePostSchema),
  PostController.updatePost,
);
router.delete("/:id", auth, PostController.deletePost);

export const PostRoutes = router;
