import { ServerUrl, USER_KEY } from "@/constants";
import { getItem } from "@/util/storage";
import { router } from "expo-router";
import ky from "ky";
let token = "";
if (!("throwIfAborted" in AbortSignal.prototype)) {
  //@ts-ignore
  AbortSignal.prototype.throwIfAborted = function () {
    //@ts-ignore
    if (this.aborted) {
      //@ts-ignore
      throw new Error(this.reason || "Operation aborted");
    }
  };
}

const apiClient = ky.create({
  prefixUrl: ServerUrl + "/api",
  timeout: 50000, // 设置超时时间
  retry: 2,
  headers: {
    Authorization: "Bearer " + token, // 请求头
    // "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        /*   if (token) {
          console.log("🚀 ~ file: client.ts:28 ~ token:", token);
          return;
        } */
        const data = await getItem(USER_KEY);
        if (data) {
          const { access_token } = data as User.LoginUser;
          token = access_token;
          //@ts-ignore
          request.headers.set("Authorization", "Bearer " + token);
        }
      },
    ],
    afterResponse: [
      (_input, _options, response) => {
        console.log("Response received:", response.status);
        return response;
      },
      async (_input, _options, response) => {
        if (response.status === 401 || response.status === 403) router.replace("/Login");
      },
    ],
    /*  beforeRetry: [
      ({ request, options, error, retryCount }) => {
        console.log(`Retry attempt #${retryCount} for request:`, request.url);
      },
    ], */
  },
});

export default apiClient;
