import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config"; // 引入 dotenv 来加载环境变量

// 设置文件存储路径和文件名
const storage = multer.diskStorage({
  // 1- 上传文件的目录
  destination: function (req, file, cb) {
    cb(null, "assets/uploads");
  },
  // 2- 上传文件的名称 - 修改为时间戳格式
  filename: function (req, file, cb) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
    const newFilename = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});
// multer 配置
export const ImgUpload = multer({
  storage,
});

// 上传文件
export const uploadFile = (req, res) => {
  // 如果路径不存在，则创建
  if (!fs.existsSync("assets/uploads")) {
    fs.mkdirSync("assets/uploads");
  }

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // 从环境变量中读取 baseUrl
  const baseUrl = process.env.BASE_URL;
  const filePath = `/uploads/${req.file.filename}`;
  const fileUrl = `${baseUrl}${filePath}`;

  res.status(200).json({
    status: "ok",
    filePath: fileUrl,
  });
};

// 下载文件// 下载文件
export const downloadFile = (req, res) => {
  const filename = req.params.filename;

  // 获取当前文件所在目录
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // 构建文件路径
  const filePath = path.join(__dirname, "../../assets/uploads", filename);

  console.log("Constructed file path:", filePath);

  // 检查文件是否存在
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File access error:", err);
      return res.status(404).json("File not found.");
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        return res.status(500).json({ status: "Error downloading file." });
      }
    });
  });
};
