const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

if (!configuredApiUrl) {
  throw new Error("EXPO_PUBLIC_API_URL must be configured before starting the app.");
}
if (process.env.NODE_ENV === "production" && !configuredApiUrl.startsWith("https://")) {
  throw new Error("EXPO_PUBLIC_API_URL must use HTTPS in production.");
}

export const ServerUrl = configuredApiUrl;

export const USER_KEY = "user";

export const TEMP_FILE_KEY = "temp_file";
export const NEED_REFRESH = "NEED_REFRESH";
