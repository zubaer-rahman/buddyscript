import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface.js";
import httpStatus from "http-status";

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
  return post;
};

const getFeed = async (authorId: string, cursor?: string, limit = 10) => {
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
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
      comments: {
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true, avatar: true },
          },
          likes: {
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true },
              },
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
              likes: {
                include: {
                  user: {
                    select: { id: true, firstName: true, lastName: true },
                  },
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return posts;
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

  return { message: "Post deleted successfully" };
};

export const PostService = {
  createPost,
  getFeed,
  updatePost,
  deletePost,
};
