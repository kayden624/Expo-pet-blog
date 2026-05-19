import { ServerUrl, USER_KEY } from "@/constants";
import { getItem } from "@/util/storage";
import { router } from "expo-router";
import ky from "ky";
import { doLogin } from "./auth";
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
console.log(
  "throwIfAborted supported?",
  "throwIfAborted" in AbortSignal.prototype
);

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
        console.log(
          "Request is about to be sent:",
          request.url,
          "token=",
          token
        );
        /*   if (token) {
          console.log("🚀 ~ file: client.ts:28 ~ token:", token);
          return;
        } */
        const data = await getItem(USER_KEY);
        console.log("🚀 ~ file: client.ts:35 ~ data:", data);
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
      // Or retry with a fresh token on a 403 error
      async (input, options, response) => {
        if (response.status === 401) {
          const loginUser = (await getItem("user")) as User.LoginUser;
          console.log("🚀 ~ file: client.ts:47 ~ loginUser:", loginUser);
          if (!loginUser) {
            router.push("/Login");
            return;
          }
          const { email, password } = loginUser;
          const data = await doLogin(email, password);
          if (data?.access_token) {
            token = data.access_token;
            console.log("🚀 ~ file: client.ts:54 ~ token:", token);

            //@ts-ignore
            options.headers.set("Authorization", "Bearer " + token);
            return ky(input, options);
          }
        }
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
