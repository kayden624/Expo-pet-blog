import newRequest from ".";
import { lookInSession } from "./sessions";

const getAccessToken = () => {
  const userInSession = lookInSession("user");

  if (!userInSession) {
    return null;
  }

  try {
    const user = JSON.parse(userInSession);
    return typeof user?.access_token === "string" && user.access_token.trim()
      ? user.access_token
      : null;
  } catch {
    return null;
  }
};

export const uploadImage = async (img) => {
  const formData = new FormData();
  formData.append("file", img);
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("You must be logged in to upload an image.");
  }

  try {
    const response = await newRequest.post("/file/get-upload-url", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
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
