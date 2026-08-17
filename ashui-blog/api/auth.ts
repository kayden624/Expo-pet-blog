import { USER_KEY } from "@/constants";
import { getItem, removeItem, setItem } from "@/util/storage";
import { router } from "expo-router";
import api from "./client";

export const register = (email: string, password: string) =>
  api.post("user/signup", { json: { email, password } }).json();

export const login = (email: string, password: string) =>
  api.post("user/signin", { json: { email, password } }).json();

export const profile = async (userId = "") => {
  if (!userId || userId === "undefined" || userId === "") {
    const user = (await getItem(USER_KEY)) as unknown as User.LoginUser;
    if (!user) return null;
    userId = user.userId;
    console.log("🚀 ~ file: auth.ts:13 ~ userId:", userId);
  }
  return api.get<User.Profile>(`user/${userId}/profile`).json();
};

export const doLogin = async (email: string, password: string) => {
  try {
    const res = (await login(email, password)) as any;
    if (res?.access_token) {
      await setItem(USER_KEY, {
        ...res,
        email,
        loginTime: Date.now(),
      });
    }
    return res;
  } catch (error) {
    return null;
  }
};
export const goLogin = () => {
  router.push("/Login");
};
export const doLogout = async (toLogin = true) => {
  await removeItem(USER_KEY);
  if (toLogin) {
    goLogin();
  }
};
