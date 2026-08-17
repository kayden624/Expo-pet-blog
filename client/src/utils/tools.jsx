import Header from "@editorjs/header";
import Checklist from "@editorjs/checklist";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Quote from "@editorjs/quote";
import { uploadImage } from "../servers/uploadFile";

const uploadImageByUrl = (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });

  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};

const uploadImageByFile = (e) => {
  return uploadImage(e).then((url) => {
    if (!url) {
      throw new Error("Upload response did not include a valid file path.");
    }

    return {
      success: 1,
      file: { url },
    };
  });
};

export const tools = {
  header: {
    class: Header,
    config: { defaultLevel: 2, levels: [2, 3] },
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  quote: Quote,
};
