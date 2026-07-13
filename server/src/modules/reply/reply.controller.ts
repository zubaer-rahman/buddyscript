import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { ReplyService } from "./reply.service.js";
import httpStatus from "http-status";

const createReply = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user.id;

  const reply = await ReplyService.createReply(authorId, req.body);

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
