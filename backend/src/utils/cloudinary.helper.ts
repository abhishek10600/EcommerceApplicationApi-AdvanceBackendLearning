import cloudinary from "../lib/cloudinary.js";

export const uploadToCloudinary = async (fileBuffer: Buffer) => {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.log("Cloudinary upload error: ", error);
          return reject(error);
        }

        resolve(result!.secure_url);
      },
    );

    stream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (imageUrl: string) => {
  try {
    const parts = imageUrl.split("/");
    const fileName = parts[parts.length - 1];
    const publicId = `products/${fileName.split(".")[0]}`;

    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error: ", error);
    throw error;
  }
};
