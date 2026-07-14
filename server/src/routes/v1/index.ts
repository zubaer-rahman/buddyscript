import { Router } from "express";
import { AuthRoutes } from "../../modules/auth/auth.route.js";
import { PostRoutes } from "../../modules/post/post.route.js";
import { LikeRoutes } from "../../modules/like/like.route.js";
import { CommentRoutes } from "../../modules/comment/comment.route.js";
import { ReplyRoutes } from "../../modules/reply/reply.route.js";

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
  {
    path: "/comment",
    route: CommentRoutes,
  },
  {
    path: "/reply",
    route: ReplyRoutes,
  },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
