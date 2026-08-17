import axios from "axios";

const newRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  //   withCredentials: true,
});

if (!import.meta.env.VITE_BASE_URL) {
  throw new Error("VITE_BASE_URL must be configured before starting the web client.");
}
if (import.meta.env.PROD && !import.meta.env.VITE_BASE_URL.startsWith("https://")) {
  throw new Error("VITE_BASE_URL must use HTTPS in production.");
}

export default newRequest;
