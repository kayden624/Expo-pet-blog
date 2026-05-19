import { USER_KEY } from "@/constants";
import { getItem, removeItem, setItem } from "@/util/storage";
import { useHeaderHeight } from "@react-navigation/elements";
import { useMemoizedFn } from "ahooks";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function useUtil() {
  const lastPressTime = useRef(0);

  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { width, height } = useWindowDimensions();
  const [userInfo, setUserInfo] = useState<User.LoginUser | null>(null);
  const rpx = width / 750; // 小程序设计稿基准宽度750rpx
  const debouncePress = useMemoizedFn((cb?: () => any, time = 500) => {
    const now = Date.now();
    if (now - lastPressTime.current > time || !lastPressTime.current) {
      // 500ms防抖间隔
      lastPressTime.current = now;
      cb?.();
    }
  });
  useEffect(() => {
    getUserInfo();
  }, []);
  const setStorage = useMemoizedFn(setItem);
  const removeStorage = useMemoizedFn(removeItem);
  const getStorage = useMemoizedFn(getItem);

  const isLogin = useMemoizedFn(async () => {
    const user = (await getStorage(USER_KEY)) as unknown as User.LoginUser;
    if (!user || !user.access_token) return false;
    console.log("isLogin", user);
    return true;
  });
  const getUserInfo = useMemoizedFn(async () => {
    const data = (await getStorage(USER_KEY)) as User.LoginUser;
    setUserInfo(data);
    return data;
  });

  const tabBarPageHeight = useMemo(() => {
    return height - insets.bottom - insets.top - headerHeight;
  }, [height, insets, headerHeight]);

  return {
    rpx,
    width,
    height,
    headerHeight,
    tabBarPageHeight,
    router,
    userInfo,
    debouncePress,
    setStorage,
    getStorage,
    removeStorage,
    isLogin,
    getUserInfo,
  };
}
