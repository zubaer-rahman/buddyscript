import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { LikeService } from "./like.service";
import httpStatus from "http-status";

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  const result = await LikeService.toggleLike(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: { liked: result.liked },
  });
});

export const LikeController = {
  toggleLike,
};
