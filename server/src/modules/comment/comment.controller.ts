import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { CommentService } from "./comment.service.js";
import { uploadToCloudinary } from "../../utils/uploadImage.js";
import httpStatus from "http-status";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user.id;
  const imageUrl = req.file ? await uploadToCloudinary(req.file) : undefined;

  const comment = await CommentService.createComment(authorId, {
    ...req.body,
    ...(imageUrl ? { imageUrl } : {}),
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
