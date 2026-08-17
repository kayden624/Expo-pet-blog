import newRequest from ".";

export const uploadImage = async (img) => {
  const formData = new FormData();
  formData.append("file", img);

  try {
    const response = await newRequest.post("/file/get-upload-url", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { filePath } = response.data || {};
    if (typeof filePath !== "string" || !filePath.trim()) {
      throw new Error("Upload response did not include a valid file path.");
    }

    return filePath;
  } catch (error) {
    console.error("An error occurred while uploading the file:", error);
    throw error;
  }
};
