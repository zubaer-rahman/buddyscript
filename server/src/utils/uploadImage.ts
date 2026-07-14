import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import config from "../config/index.js";
import AppError from "./AppError.js";
import httpStatus from "http-status";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: config.cloudinary_folder || "buddy_script_uploads",
    allowed_formats: (
      config.multer_allowed_formats || "jpg,jpeg,png,gif,webp"
    ).split(","),
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  } as any,
});

export const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new AppError(httpStatus.BAD_REQUEST, 'Only image files allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: Number(config.multer_max_file_size_mb || 5) * 1024 * 1024,
  },
});
