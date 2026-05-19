import { getBlogList } from "@/api/blog";
import useUtil from "@/hooks/useUtil";
import { formatTime } from "@/util";
import { Fontisto } from "@expo/vector-icons";
import { useMemoizedFn } from "ahooks";
import c from "classnames";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Show } from "../base/Show";
import BlogItem from "./BlogItem";
export default function BaseInfo({
  user,
  profileInfoData,
}: {
  user: User.LoginUser;
  profileInfoData?: User.User;
}) {
  const { router, userInfo } = useUtil();
  const [latestBlogList, setLatestBlogList] = useState<
    Blog.BlogList["results"]
  >([]);
  useFocusEffect(
    useCallback(() => {
      getLatestBlogList(user.userId);
    }, [])
  );

  /*  useEffect(() => {
    //获取最新博客列表
    getLatestBlogList(user.userId);
  }, []); */
  const getLatestBlogList = useMemoizedFn(async (userId: string) => {
    try {
      const { results } = await getBlogList(userId)(1, 2);
      if (!results) return;
      setLatestBlogList(results);
    } catch (error) {}
  });

  return (
    <Show when={!!user}>
      <View className="  items-center ">
        <Text className="mt-2 font-bold text-2xl">{user?.username}</Text>
        <View className="flex-row items-center gap-2">
          <Fontisto name="email" size={18} color="black" />
          <Text className="mt-2  text-sm">{user?.email}</Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Text className="mt-2  text-sm">
            Blogs: {profileInfoData?.activity.total_posts}
          </Text>
          <Text className="mt-2  text-sm">
            Joined: {formatTime(profileInfoData?.joinedAt, "now")}
          </Text>
          <Text className="mt-2  text-sm">
            Last Login: {formatTime(user?.loginTime, "ago")}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Text className="mt-2  text-sm">
            Following: {profileInfoData?.activity.total_following || 0}
          </Text>
          <Text className="mt-2  text-sm">
            Followers: {profileInfoData?.activity.total_verified_followers || 0}
          </Text>
        </View>

        <>
          {/*      <Button title="退出登录" onPress={onContactMe} /> */}

          <View>
            {/*    <ScrollView showsVerticalScrollIndicator={false}> */}
            <Text
              className={c("p-4 leading-5", {
                ["text-gray-400"]: !user.bio,
              })}
            >
              {user.bio || "That guy is too lazy to leave anything."}
            </Text>
            {/*  </ScrollView> */}
          </View>

          <View className="flex-1 w-full" style={{ minWidth: "100%" }}>
            <Text className="font-semibold text-xl text-center pb-2">
              Latest Blogs
            </Text>
            <View
              className="  flex-row   justify-center flex-wrap"
              //  contentContainerStyle={{ gap: 10, padding: 10 }}
            >
              <Show
                when={latestBlogList.length > 0}
                fallback={<Text>No data available</Text>}
              >
                <View className="flex-row gap-5 flex-wrap">
                  {latestBlogList.map((it, index) => (
                    <View key={index} className="mb-2">
                      <BlogItem {...it.blog} />
                    </View>
                  ))}
                </View>
              </Show>
            </View>
            <Show when={!!profileInfoData?.activity.total_posts}>
              <TouchableOpacity
                className="bg-blue-500 mt-5 p-3 rounded-lg items-center"
                onPress={() => {
                  router.push({
                    pathname: "/blog/list",
                    params: { userId: user.userId, user_id: user._id },
                  });
                }}
              >
                <Text className="text-white font-bold">
                  View All Blogs ({profileInfoData?.activity.total_posts})
                </Text>
              </TouchableOpacity>
            </Show>
            <Show when={!!userInfo?.userId}>
              <TouchableOpacity
                className="bg-blue-500 mt-5 p-3 rounded-lg items-center"
                onPress={() => {
                  router.push({
                    //@ts-ignore
                    pathname: `/blog/detail/0`,
                    params: {
                      edit: "1",
                    },
                  });
                }}
              >
                <Text className="text-white font-bold">Create A New Blog</Text>
              </TouchableOpacity>
            </Show>
          </View>
        </>
      </View>
    </Show>
  );
}
