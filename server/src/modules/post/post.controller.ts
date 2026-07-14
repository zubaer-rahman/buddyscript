import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { PostService } from "./post.service.js";
import httpStatus from "http-status";

const createPost = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user.id;
  const imageUrl = req.file?.path || (req.file as any)?.url;

  const post = await PostService.createPost(authorId, {
    ...req.body,
    imageUrl,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Post created successfully",
    data: post,
  });
});

const getFeed = catchAsync(async (req: Request, res: Response) => {
  const { cursor, limit } = req.query;
  const currentUserId = req.user.id;
  const result = await PostService.getFeed(
    currentUserId,
    cursor as string,
    Number(limit) || 10,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feed fetched successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id as string;
  const authorId = req.user.id;
  const imageUrl = req.file?.path || (req.file as any)?.url;

  const updated = await PostService.updatePost(postId, authorId, {
    ...req.body,
    imageUrl,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post updated successfully",
    data: updated,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id as string;
  const authorId = req.user.id;

  await PostService.deletePost(postId, authorId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post deleted successfully",
    data: null,
  });
});

export const PostController = {
  createPost,
  getFeed,
  updatePost,
  deletePost,
};
