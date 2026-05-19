import { deleteBlog } from "@/api/blog";
import { useLoading } from "@/contexts/LoadingContext";
import useUtil from "@/hooks/useUtil";
import { formatTime } from "@/util";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemoizedFn } from "ahooks";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import RenderHtml from "react-native-render-html";
import { Show } from "../base/Show";

interface BlogCardProps extends Partial<Blog.BlogItem> {
  hideInfo?: boolean;
  summer?: string;
  authorInfo?: User.Personal_info;
  onDeleted?: () => void;
}

export default function BlogCard({
  banner,
  title,
  author,
  publishedAt,
  activity,
  blog_id,
  _id,
  summer,
  hideInfo = false,
  authorInfo,
  onDeleted,
}: BlogCardProps) {
  const { showLoading, hideLoading } = useLoading();
  const { debouncePress, userInfo } = useUtil();
  const isSelf = useMemo(
    () =>
      //@ts-ignore
      userInfo &&
      (userInfo?.userId === authorInfo?.userId ||
        author?._id === userInfo?._id),
    [userInfo, authorInfo, author]
  );
  const Child = useMemoizedFn(() => (
    <Pressable
      onPress={() => {
        debouncePress(() => {
          router.push(`/blog/detail/${blog_id}`);
        });
      }}
    >
      <View className="w-full flex-row rounded-lg overflow-hidden   ">
        {/* Cover image */}
        {/* <Text>{banner}</Text> */}
        <Image
          source={{
            uri: banner,
          }}
          style={{ width: 150, aspectRatio: 4 / 3 }}
          className="rounded-lg mr-4"
          onError={(e: any) => console.log("image-loadError:", e)}
        />

        {/* Content area */}
        <View className="flex-1  ">
          {/* Title */}
          <Text numberOfLines={2} className="text-lg font-bold mb-2 ">
            {title}
          </Text>
          {/* Introduction */}
          {summer && (
            <View className="pb-2">
              <RenderHtml
                tagsStyles={{
                  em: { color: "red", fontWeight: "bold" },
                }}
                source={{ html: summer || "" }}
              />
            </View>
          )}

          {/* Author information: avatar, username */}
          <Show when={!!authorInfo || !!author}>
            <View className="flex-row items-center mb-2">
              {(authorInfo?.profile_img ||
                author?.personal_info.profile_img) && (
                <Image
                  source={{
                    uri:
                      authorInfo?.profile_img ||
                      author?.personal_info.profile_img,
                  }}
                  style={{ width: 24, height: 24 }}
                  className="rounded-full mr-2"
                />
              )}
              <Text className="text-sm text-gray-600">
                {authorInfo?.username || author?.personal_info.username}
              </Text>
            </View>
          </Show>
          <Show when={!hideInfo}>
            <View className="flex-row gap-4">
              <Text className="text-sm text-gray-500">
                <AntDesign name="like2" size={16} color="gray" />
                <Text> </Text>
                {activity?.total_likes || 0}
              </Text>
              <Text className="text-sm text-gray-500">
                <AntDesign name="message1" size={16} color="gray" />
                <Text> </Text>
                {activity?.total_comments || 0}
              </Text>
              <Text className="text-sm text-gray-500">
                <AntDesign name="eyeo" size={18} color="gray" />
                <Text> </Text>
                {activity?.total_reads || 0}
              </Text>
            </View>
          </Show>
          {/* Author and publication time */}
          <View className="flex  mt-auto ">
            <Text className="text-sm text-gray-400">
              {formatTime(publishedAt)}
            </Text>
          </View>
        </View>
        {isSelf && (
          <View className="flex  justify-center items-center  ">
            <Text className="  text-gray-300">
              <MaterialIcons name="drag-handle" size={24} />
            </Text>
            <Text className="text-gray-300">Swipe left for actions</Text>
          </View>
        )}
      </View>
    </Pressable>
  ));

  const doDelete = useMemoizedFn(() => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this blog? It cannot be recovered after deletion!",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            showLoading("Deleting...");
            await deleteBlog(_id || "");
            hideLoading();
            onDeleted?.();
          },
          style: "destructive",
        },
      ]
    );
  });

  const renderRightActions = useMemoizedFn(() => {
    return (
      <View
        style={{
          backgroundColor: "#aaa",
          width: 80,
        }}
      >
        <Pressable
          className="p-3 flex-1  justify-center items-center"
          onPress={() => {
            router.push({
              //@ts-ignore
              pathname: `/blog/detail/${blog_id}`,
              params: {
                edit: "1",
              },
            });
          }}
        >
          <Text style={{ color: "white" }}>Edit</Text>
        </Pressable>
        <Pressable
          className="p-3  flex-1 justify-center items-center bg-red-500"
          onPress={doDelete}
        >
          <Text style={{ color: "white" }}>Delete</Text>
        </Pressable>
      </View>
    );
  });

  //@ts-ignore
  return isSelf ? (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions}>
        <Child />
      </Swipeable>
    </GestureHandlerRootView>
  ) : (
    <Child />
  );
}
