import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import config from "../config/index.js";
import AppError from "./AppError.js";
import httpStatus from "http-status";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new AppError(httpStatus.BAD_REQUEST, "Only image files allowed") as any,
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: Number(config.multer_max_file_size_mb || 5) * 1024 * 1024,
  },
});

export async function uploadToCloudinary(
  file: Express.Multer.File,
): Promise<string> {
  const allowedFormats = (
    config.multer_allowed_formats || "jpg,jpeg,png,gif,webp"
  ).split(",");

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: config.cloudinary_folder || "buddy_script_uploads",
        allowed_formats: allowedFormats,
        transformation: [{ width: 1000, height: 1000, crop: "limit" }],
      },
      (error, result) => {
        if (error || !result) {
          reject(
            new AppError(httpStatus.BAD_REQUEST, "Failed to upload image"),
          );
        } else {
          resolve(result.secure_url);
        }
      },
    );
    uploadStream.end(file.buffer);
  });
}
