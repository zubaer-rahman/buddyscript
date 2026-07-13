import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import catchAsync from "../utils/catchAsync.js";

const validateRequest = (schema: ZodType) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync(req.body);

    next();
  });
};

export default validateRequest;
