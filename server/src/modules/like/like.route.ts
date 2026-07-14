import { Router } from "express";
import { LikeController } from "./like.controller.js";
import { auth } from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { LikeValidation } from "./like.validation.js";

const router = Router();

router.post(
  "/toggle",
  auth,
  validateRequest(LikeValidation.toggleLikeSchema),
  LikeController.toggleLike,
);

export const LikeRoutes = router;
