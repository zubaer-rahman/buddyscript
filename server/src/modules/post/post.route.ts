import { Router } from "express";
import { PostController } from "./post.controller";
import { uploadImage } from "../../utils/uploadImage";
import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { PostValidation } from "./post.validation";

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
