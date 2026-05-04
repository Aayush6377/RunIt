import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(base64Image: string, folder: string = "runit/avatars") {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
    });
    return result.secure_url;
  } catch {
    throw new Error("Failed to upload image to Cloudinary");
  }
}

export async function deleteImage(imageUrl: string) {
  try {
    if (!imageUrl.includes("cloudinary.com")) return;

    const urlParts = imageUrl.split("/");
    const filenameWithExt = urlParts[urlParts.length - 1];
    const folderName = urlParts[urlParts.length - 2];
    
    const filename = filenameWithExt.split(".")[0];
    const publicId = `${folderName}/${filename}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
  }
}