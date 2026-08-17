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
const requiredEnvironment = ["MONGODB_URI", "JWT_SECRET", "BASE_URL", "CORS_ORIGIN"];
const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name]);
if (missingEnvironment.length) {
  throw new Error(`Missing required environment variables: ${missingEnvironment.join(", ")}`);
}
if (process.env.NODE_ENV === "production" && !process.env.BASE_URL.startsWith("https://")) {
  throw new Error("BASE_URL must use HTTPS in production");
}

// --  middleware

// req.body
server.use(express.json());

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
server.use(cors({ origin: allowedOrigins.length ? allowedOrigins : false }));

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

server.get("/health", (_req, res) => {
  const isDatabaseConnected = mongoose.connection.readyState === 1;
  res.status(isDatabaseConnected ? 200 : 503).json({ status: isDatabaseConnected ? "ok" : "unavailable" });
});

server.use("/api/user", userRouter);
server.use("/api/blog", blogRouter);
server.use("/api/file", fileRouter);
server.use("/api/comment", commentRouter);
server.use("/api/search", searchRouter);
server.use("/api/notification", notificationRouter);

const port = Number(process.env.PORT || 3001);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connect successful!");
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to MongoDB:", error.message);
    process.exitCode = 1;
  }
};

startServer();
