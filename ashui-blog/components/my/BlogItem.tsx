import useUtil from "@/hooks/useUtil";
import { formatTime } from "@/util";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function BlogItem(props: Blog.BlogItem) {
  const { rpx, debouncePress, router } = useUtil();
  return (
    <Pressable
      onPress={() => {
        debouncePress(() => {
          router.push(`/blog/detail/${props.blog_id}`);
        });
      }}
    >
      <View style={{ width: 330 * rpx }}>
        <Image
          className="rounded-xl"
          source={{ uri: props.banner }}
          style={{ width: 330 * rpx, aspectRatio: 16 / 9 }}
        />
        <View>
          <Text className="py-2 " numberOfLines={1}>
            {props.title}
          </Text>
        </View>
        <View>
          <Text className=" " numberOfLines={1}>
            {formatTime(props.publishedAt)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
