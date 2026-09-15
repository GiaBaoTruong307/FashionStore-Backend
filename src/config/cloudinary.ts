import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

const connectCloudinary = () => {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    console.warn("Cloudinary chưa được cấu hình — tính năng upload ảnh sản phẩm sẽ chưa dùng được.");
    return;
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
};

export default connectCloudinary;