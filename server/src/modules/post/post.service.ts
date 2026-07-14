import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface.js";
import httpStatus from "http-status";
import {
  feedKey,
  getCache,
  setCache,
  invalidateUserFeed,
} from "../../lib/redis.js";

const createPost = async (authorId: string, payload: ICreatePostPayload) => {
  const post = await prisma.post.create({
    data: {
      ...payload,
      authorId,
    },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true, avatar: true },
      },
    },
  });

  await invalidateUserFeed(authorId);

  return post;
};

const getFeed = async (authorId: string, cursor?: string, limit = 10) => {
  const key = feedKey(authorId, cursor ?? "", limit);

  const cached = await getCache(key);
  if (cached) {
    return JSON.parse(cached) as {
      posts: unknown[];
      nextCursor: string | null;
      hasNextPage: boolean;
    };
  }

  const posts = await prisma.post.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: { createdAt: "desc" },
    where: {
      OR: [{ isPrivate: false }, { authorId }],
    },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true, avatar: true },
      },

      likes: {
        where: { userId: authorId },
        select: { userId: true },
      },
    },
  });

  const hasNextPage = posts.length > limit;
  const data = hasNextPage ? posts.slice(0, limit) : posts;
  const nextCursor = hasNextPage ? data[data.length - 1]!.id : null;

  const result = { posts: data, nextCursor, hasNextPage };

  await setCache(key, JSON.stringify(result));

  return result;
};

const updatePost = async (
  id: string,
  authorId: string,
  payload: IUpdatePostPayload,
) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  if (post.authorId !== authorId)
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only edit your own posts",
    );

  const updated = await prisma.post.update({
    where: { id },
    data: {
      ...payload,
    },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true, avatar: true },
      },
    },
  });

  await invalidateUserFeed(authorId);

  return updated;
};

const deletePost = async (id: string, authorId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  if (post.authorId !== authorId)
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only delete your own posts",
    );

  await prisma.post.delete({ where: { id } });

  await invalidateUserFeed(authorId);

  return { message: "Post deleted successfully" };
};

export const PostService = {
  createPost,
  getFeed,
  updatePost,
  deletePost,
};
