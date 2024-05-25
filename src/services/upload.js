import { post } from "./http";
import { buildApiUrl } from "./utils";

// Create and upload the object to the S3 bucket.
export const upload = async (file, path) => {
  // const bucketParams = {
  //     Bucket: process.env.AWS_UPLOAD_BUCKET,
  //     // Specify the name of the new object. For example, 'index.html'.
  //     // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
  //     Key: path,
  //     // Content of the new object.
  //     // Body: "BODY",
  //   };
  //   try {
  //     // const stream = await file.stream();
  //     const params = { ...bucketParams, Body: file };
  //     const data = await s3Client.send(new PutObjectCommand(params));
  //     return data; // For unit tests.
  //     // console.log(`Successfully uploaded object: ${bucketParams.Bucket} / ${bucketParams.Key}`);
  //   } catch (err) {
  //     console.log("Error", err);
  //   }
};

export const uploadFilesToS3 = async (files, category, uploadId) => {
  const formData = new FormData();
  formData.append("category", category);
  formData.append("uploadId", uploadId);

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i], files[i].name);
  }

  try {
    const url = buildApiUrl("/upload-files");
    return await post(url, formData, { "Content-Type": "multipart/form-data" });
  } catch (error) {
    return error;
  }
};

// data - { uploadId, category, notes, items: [{index, fname, notes}] }
export const bulkUpload = async (data) => {
  const url = buildApiUrl("/uploads/bulk");
  return await post(url, data);
};
