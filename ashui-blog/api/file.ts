import api from "./client";

export const uploadFile = async (file: any) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      type: file.mimeType || "image/jpeg",
      name: file.fileName || "upload.jpg",
    } as any);
    const response = await api.post<{ filePath: string; status: string }>(
      "file/get-upload-url",
      {
        body: formData,
      }
    );
    console.log("uploadFile", response);
    const { filePath } = await response.json();
    return filePath;
  } catch (error) {
    console.error("上传文件时发生错误:", error);
    throw error;
  }
};
