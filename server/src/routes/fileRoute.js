import express from "express";
import { ImgUpload, uploadFile, downloadFile } from "../controllers/fileCon.js";

const route = express.Router();

route.post("/get-upload-url", ImgUpload.single("file"), uploadFile);
route.get("/download/:filename", downloadFile);

export default route;
