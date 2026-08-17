import express from "express";
import { ImgUpload, uploadFile, downloadFile } from "../controllers/fileCon.js";
import { verifyJWT } from "../middleware/requireAuth.js";

const route = express.Router();

route.post("/get-upload-url", verifyJWT, ImgUpload.single("file"), uploadFile);
route.get("/download/:filename", downloadFile);

export default route;
