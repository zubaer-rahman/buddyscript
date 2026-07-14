import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import httpStatus from "http-status";
import config from "../config/index.js";

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
        tokenVersion?: number;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, tokenVersion: true },
      });

      if (!user || user.tokenVersion !== (decoded.tokenVersion ?? 0)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Session revoked. Please log in again.",
        );
      }

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
