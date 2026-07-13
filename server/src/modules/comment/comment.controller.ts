import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { CommentService } from "./comment.service.js";
import httpStatus from "http-status";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user?.id as string;
  const imageUrl = (req as any).file?.path;

  const comment = await CommentService.createComment(authorId, {
    ...req.body,
    imageUrl,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment created successfully",
    data: comment,
  });
});

export const CommentController = {
  createComment,
};
