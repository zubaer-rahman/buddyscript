import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { ReplyService } from "./reply.service.js";
import { uploadToCloudinary } from "../../utils/uploadImage.js";
import httpStatus from "http-status";

const createReply = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user.id;
  const imageUrl = req.file ? await uploadToCloudinary(req.file) : undefined;

  const reply = await ReplyService.createReply(authorId, {
    ...req.body,
    ...(imageUrl ? { imageUrl } : {}),
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Reply created successfully",
    data: reply,
  });
});

export const ReplyController = {
  createReply,
};
