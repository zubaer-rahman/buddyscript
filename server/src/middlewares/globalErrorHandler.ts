import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import config from "../config";

const handleCastError = (err: any) => {
  return new AppError(httpStatus.BAD_REQUEST, `Invalid ${err.path}: ${err.value}`);
};

const handleDuplicateFields = (err: any) => {
  const field = Object.keys(err.keyValue || {})[0];
  return new AppError(
    httpStatus.CONFLICT,
    `Duplicate value for ${field}. Please use another value.`,
  );
};

const handleValidationError = (err: any) => {
  const errors = Object.values(err.errors || {}).map((el: any) => el.message);
  return new AppError(httpStatus.BAD_REQUEST, `Invalid input: ${errors.join(". ")}`);
};

const handlePrismaError = (err: any) => {
  switch (err.code) {
    case "P2002":
      return new AppError(
        httpStatus.CONFLICT,
        "Unique constraint violation. This record already exists.",
      );
    case "P2025":
      return new AppError(httpStatus.NOT_FOUND, "Record not found.");
    case "P2014":
      return new AppError(httpStatus.BAD_REQUEST, "Invalid ID format.");
    default:
      return new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Database error occurred.");
  }
};

const handleZodError = (err: ZodError) => {
  const errors = err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
  return new AppError(httpStatus.BAD_REQUEST, "Validation failed", errors);
};

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error: AppError = err;

  if (err instanceof ZodError) error = handleZodError(err);
  else if (err.name === "CastError") error = handleCastError(err);
  else if (err.code === 11000) error = handleDuplicateFields(err);
  else if (err.name === "ValidationError") error = handleValidationError(err);
  else if (err.name === "PrismaClientKnownRequestError")
    error = handlePrismaError(err);
  else if (err.name === "JsonWebTokenError")
    error = new AppError(httpStatus.UNAUTHORIZED, "Invalid token. Please log in again.");
  else if (err.name === "TokenExpiredError")
    error = new AppError(httpStatus.UNAUTHORIZED, "Token expired. Please log in again.");

  const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    ...(error.errors && { errors: error.errors }),
    errorSources:
      config.node_env === "development"
        ? [{ message: err.stack }]
        : undefined,
  });
};

export default globalErrorHandler;
