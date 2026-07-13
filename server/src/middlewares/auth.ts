import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import config from "../config";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    }
  }
}
export const auth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not logged in! Please log in to get access.",
      );
    }

    try {
      const decoded = jwt.verify(token, config.jwt_access_secret as string) as {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };

      req.user = decoded;

      next();
    } catch (error) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Invalid or expired token. Please log in again.",
      );
    }
  },
);
