import useUtil from "@/hooks/useUtil";
import { awatarUrl } from "@/util";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemoizedFn } from "ahooks";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { Show } from "../base/Show";
interface UserCardProps extends Partial<User.Personal_info> {
  _id?: string;
  onDelete?: () => void;
  userId?: string;
}

export default function UserCard(props: UserCardProps) {
  const { username, profile_img, email, onDelete, userId } = props;
  const { debouncePress, router } = useUtil();

  const renderRightActions = () => {
    return (
      <Pressable
        onPress={() => {
          // 处理删除逻辑
          console.log("Delete pressed1");
          onDelete?.();
        }}
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "red",
          width: 80,
        }}
      >
        <Text style={{ color: "white" }}>Unfollow</Text>
      </Pressable>
    );
  };

  const Child = useMemoizedFn(() => (
    <Pressable
      onPress={() => {
        debouncePress(() => {
          router.push(`/user/detail/${userId}`);
        });
      }}
    >
      <View className="w-full flex-row rounded-lg overflow-hidden">
        <Image
          source={awatarUrl(profile_img)}
          style={{ width: 60, aspectRatio: 1 }}
          className="mr-4 rounded-full"
          onError={(e: any) => console.log("image-loadError:", e)}
        />
        <View className="flex-1">
          <Text numberOfLines={2} className="text-lg font-bold mb-2">
            {username}
          </Text>
          <View>
            <Text numberOfLines={2} className="text-base mb-2">
              {email}
            </Text>
          </View>
        </View>
        <Show when={!!onDelete}>
          <View className="flex flex-row justify-center items-center  ">
            <Text className="  text-gray-300">
              <MaterialIcons name="drag-handle" size={24} />
            </Text>
            <Text className="text-gray-300">Swipe left to unfollow</Text>
          </View>
        </Show>
      </View>
    </Pressable>
  ));

  return !!onDelete ? (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions}>
        <Child />
      </Swipeable>
    </GestureHandlerRootView>
  ) : (
    <Child />
  );
}
