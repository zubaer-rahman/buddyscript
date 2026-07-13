import { Router } from "express";
import { LikeController } from "./like.controller.js";
import { auth } from "../../middlewares/auth.js";

const router = Router();

router.post("/toggle", auth, LikeController.toggleLike);

export const LikeRoutes = router;
