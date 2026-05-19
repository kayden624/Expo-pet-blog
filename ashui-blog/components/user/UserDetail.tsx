import { doLogout, goLogin, profile } from "@/api/auth";
import { Show } from "@/components/base/Show";
import Tab from "@/components/base/Tab";
import Action from "@/components/my/Action";
import BaseInfo from "@/components/my/BaseInfo";
import FollowedBlogList from "@/components/my/FollowedBlogList";
import FollowedUserList from "@/components/my/FollowedUserList";
import FollowingUserList from "@/components/my/FollowingUserList";
import { USER_KEY } from "@/constants";
import { useLoading } from "@/contexts/LoadingContext";
import useUtil from "@/hooks/useUtil";
import { awatarUrl } from "@/util";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemoizedFn } from "ahooks";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function UserDetail({ userId }: { userId?: string }) {
  const { width, getStorage, setStorage, tabBarPageHeight, router } = useUtil();
  const [user, setUser] = useState<User.LoginUser>({} as any);
  const [profileInfoData, setProfileInfoData] = useState<User.User>();
  const { showLoading, hideLoading } = useLoading();
  useFocusEffect(
    useCallback(() => {
      userInfoFromCache();
    }, [])
  );
  const userInfoFromCache = useMemoizedFn(async () => {
    if (!userId) {
      const user = (await getStorage(USER_KEY)) as User.LoginUser;
      console.log("user", user);
      setUser(user);
      userInfoFromProfile(user);
    } else userInfoFromProfile(user);
  });

  const userInfoFromProfile = useMemoizedFn(async (user) => {
    if (userId) {
      showLoading();
    }
    const profileInfo = await profile(userId);
    hideLoading();
    console.log("profileInfo", profileInfo);
    if (!profileInfo) return;
    const {
      user: {
        userId: _userId,
        personal_info: { email, username, bio, profile_img },
      },
    } = profileInfo;
    setProfileInfoData(profileInfo.user);
    //如果存在的话更新一下新的用户数据
    const newUser: User.LoginUser = {
      ...(user || {}),
      userId: _userId,
      email,
      username,
      profile_img,
      bio,
    };
    console.log("newUser", newUser);
    if (!userId) {
      setStorage(USER_KEY, newUser);
    }
    setUser(newUser);
  });

  return (
    <View className="  h-full flex-1">
      <View
        style={{
          ...styles.container,
          height: tabBarPageHeight,
        }}
        className="flex-1  "
      >
        <View className="items-center">
          <View className="relative">
            <Image
              source={awatarUrl(
                profileInfoData?.personal_info.profile_img || user?.profile_img
              )}
              style={{ width: width, aspectRatio: 16 / 6 }}
            />
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={40}
              className="absolute z-10 inset-0 w-full h-full backdrop-blur-md bg-black/50"
            ></BlurView>
            <Show when={!userId && !!user?.userId}>
              <Pressable
                onPress={() => doLogout()}
                className="absolute flex-row px-3 py-3 items-center gap-1 top-0 left-0 z-10 "
              >
                <Text className="text-white">
                  <MaterialIcons name="account-circle" size={24} />
                </Text>
                <Text className="text-white">
                  <Text className="">Log out </Text>
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/Account")}
                className="absolute flex-row px-3 py-3 items-center gap-1 top-0 right-0 z-10 "
              >
                <Text className="text-white">
                  <Ionicons name="settings" size={20} />
                </Text>
                <Text className="text-white">
                  <Text className="">Account Settings</Text>
                </Text>
              </Pressable>
            </Show>
          </View>
          <Image
            className="rounded-full border-8  border-white relative z-20"
            source={awatarUrl(
              profileInfoData?.personal_info.profile_img || user?.profile_img
            )}
            style={{ width: 120, height: 120, marginTop: -60 }}
          />
        </View>
        {user?.userId ? (
          <View className="  flex-1 w-full">
            <Tab tabclassName=" flex-1">
              <Tab.Item label="Info">
                <ScrollView className=" h-full">
                  <BaseInfo {...{ user, profileInfoData }} />
                </ScrollView>
              </Tab.Item>
              <Tab.Item label="Upd">
                <View className="h-full">
                  <Action userId={user.userId} />
                </View>
              </Tab.Item>

              <Tab.Item label="Favs">
                <View className="h-full">
                  <FollowedBlogList userId={user.userId} />
                </View>
              </Tab.Item>

              <Tab.Item label="Fwng">
                <View className="h-full">
                  <FollowedUserList noAction={!!userId} userId={user.userId} />
                </View>
              </Tab.Item>
              <Tab.Item label="Fwers">
                <View className="h-full">
                  <FollowingUserList userId={user.userId} />
                </View>
              </Tab.Item>
            </Tab>
          </View>
        ) : (
          <Show when={!userId} fallback={<View className="flex-1"></View>}>
            <View className="mt-4">
              <Button title="Log in now" onPress={goLogin} />
            </View>
            <View className="flex-1 h-full justify-center  ">
              <Text className="text-gray-300">There's nothing here~</Text>
            </View>
          </Show>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
