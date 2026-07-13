import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { PostRoutes } from "../modules/post/post.route.js";

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
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
