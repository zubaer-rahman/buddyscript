import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: httpStatus.NOT_FOUND,
    message: `Route ${req.originalUrl} not found`,
    errorSources: [
      {
        path: req.originalUrl,
        message: "API endpoint does not exist",
      },
    ],
  });
};

export default notFound;
