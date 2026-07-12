import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import AppError from "../utils/AppError";

const handleCastError = (err: any) => {
  return new AppError(400, `Invalid ${err.path}: ${err.value}`);
};

const handleDuplicateFields = (err: any) => {
  const field = Object.keys(err.keyValue || {})[0];
  return new AppError(
    409,
    `Duplicate value for ${field}. Please use another value.`,
  );
};

const handleValidationError = (err: any) => {
  const errors = Object.values(err.errors || {}).map((el: any) => el.message);
  return new AppError(400, `Invalid input: ${errors.join(". ")}`);
};

const handlePrismaError = (err: any) => {
  switch (err.code) {
    case "P2002":
      return new AppError(
        409,
        "Unique constraint violation. This record already exists.",
      );
    case "P2025":
      return new AppError(404, "Record not found.");
    case "P2014":
      return new AppError(400, "Invalid ID format.");
    default:
      return new AppError(500, "Database error occurred.");
  }
};

const handleZodError = (err: ZodError) => {
  const errors = err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
  return new AppError(422, "Validation failed", errors);
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
    error = new AppError(401, "Invalid token. Please log in again.");
  else if (err.name === "TokenExpiredError")
    error = new AppError(401, "Token expired. Please log in again.");

  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    ...(error.errors && { errors: error.errors }),
    errorSources:
      process.env.NODE_ENV === "development"
        ? [{ message: err.stack }]
        : undefined,
  });
};

export default globalErrorHandler;
