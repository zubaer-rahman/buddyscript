import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { PostRoutes } from "../modules/post/post.route.js";
import { LikeRoutes } from "../modules/like/like.route.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/post",
    route: PostRoutes,
  },
  {
    path: "/like",
    route: LikeRoutes,
  },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
