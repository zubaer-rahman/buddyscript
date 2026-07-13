import { Router } from "express";
import { LikeController } from "./like.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/toggle", auth, LikeController.toggleLike);

export const LikeRoutes = router;
