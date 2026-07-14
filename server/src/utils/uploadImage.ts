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

const IMAGE_MAGIC_BYTES: [number, number[]][] = [
  [0xff, [0xd8, 0xff]],          // JPEG
  [0x89, [0x50, 0x4e, 0x47]],    // PNG
  [0x47, [0x49, 0x46, 0x38]],    // GIF87a / GIF89a
  [0x52, [0x49, 0x46, 0x46]],    // WebP (RIFF....WEBP)
];

function isValidImage(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  for (const [offset, magic] of IMAGE_MAGIC_BYTES) {
    if (magic.every((byte, i) => buffer[offset + i] === byte)) return true;
  }
  return false;
}

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new AppError(httpStatus.BAD_REQUEST, 'Only image files allowed') as any);
    }
    cb(null, true);
  },
  limits: {
    fileSize: Number(config.multer_max_file_size_mb || 5) * 1024 * 1024,
  },
});

export async function uploadToCloudinary(file: Express.Multer.File): Promise<string> {
  if (!isValidImage(file.buffer)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid image file");
  }

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
          reject(new AppError(httpStatus.BAD_REQUEST, "Failed to upload image"));
        } else {
          resolve(result.secure_url);
        }
      },
    );
    uploadStream.end(file.buffer);
  });
}
