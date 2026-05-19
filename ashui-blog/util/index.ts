import { ServerUrl } from "@/constants";
import dayjs from "dayjs";

export function wait(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function url(str: string, base = "/uploads") {
  return ServerUrl + base + str;
}

export function formatTime(
  str?: string | number,
  temp = "YYYY-MM-DD HH:mm:ss"
) {
  const target = dayjs(str || dayjs().format());
  if (temp === "now") {
    return (() => {
      const now = dayjs();

      const diffYears = now.diff(target, "year");
      const diffMonths = now.diff(target, "month") % 12;
      const diffDays = now.diff(target, "day") % 30;

      if (diffYears > 0) {
        return `${diffYears} years, ${diffMonths} months, and ${diffDays} days`;
      }
      if (diffMonths > 0) {
        return `${diffMonths} months and ${diffDays} days`;
      }
      return `${diffDays} days`;
    })();
  }
  if (temp === "ago")
    return (() => {
      const now = dayjs();

      const diffYears = now.diff(target, "year");
      const diffMonths = now.diff(target, "month");
      const diffDays = now.diff(target, "day");
      const diffHours = now.diff(target, "hour");
      const diffMinutes = now.diff(target, "minute");

      if (diffYears > 0) return `${diffYears} years ago`;
      if (diffMonths > 0) return `${diffMonths} months ago`;
      if (diffDays > 0) return `${diffDays} days ago`;
      if (diffHours > 0) return `${diffHours} hours ago`;
      if (diffMinutes > 0) return `${diffMinutes} minutes ago`;
      return "Just now";
    })();
  return target.format(temp);
}

export function awatarUrl(str?: string) {
  if (!str || str.includes("default"))
    return require("@/assets/images/icon.png");
  return str;
}

const chars = "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export function generateId(len = 10) {
  let result = "";
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}
export const getFileExtension = (filename: string) => {
  return filename.split(".").pop()?.toLowerCase();
};
export const getMimeType = (uri: string) => {
  // Get the file extension
  const ext = uri.split(".").pop()?.toLowerCase();

  // Return the corresponding MIME type based on the extension
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "pdf":
      return "application/pdf";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "application/octet-stream";
  }
};
