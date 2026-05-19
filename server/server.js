import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import userRouter from "./src/routes/userRoute.js";
import blogRouter from "./src/routes/blogRoute.js";
import fileRouter from "./src/routes/fileRoute.js";
import commentRouter from "./src/routes/commentRoute.js";
import searchRouter from "./src/routes/searchRoute.js";
import notificationRouter from "./src/routes/notificationRoute.js";
import mime from 'mime-types';

const server = express();

// --  middleware

// req.body
server.use(express.json());

server.use(cors());

// Serving static files
// 静态文件 Content-Type 配置
// 在您的 Express 服务器中，静态文件服务已经通过 `express.static` 中间件自动处理了 Content-Type。不过，我们可以进一步优化配置以确保正确返回 MIME 类型。
//
// 以下是修改建议：
server.use(
  express.static(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "assets"),
    {
      setHeaders: (res, path) => {
        const mimeType = mime.lookup(path) || 'application/octet-stream';
        res.setHeader('Content-Type', mimeType);
      }
    }
  )
);

// link db
// mongoose.connect(process.env.DATABASE, {
//   autoIndex: true,
// });

const DB = process.env.DATABASE_REMOTE.replace(
  "<password>",
  process.env.DATEBASE_PASSWORD
);
mongoose.connect(DB, {}).then((con) => {
  console.log("DB connect successful!");
});

server.use("/api/user", userRouter);
server.use("/api/blog", blogRouter);
server.use("/api/file", fileRouter);
server.use("/api/comment", commentRouter);
server.use("/api/search", searchRouter);
server.use("/api/notification", notificationRouter);

server.listen("3001", () => {
  console.log("success");
});
