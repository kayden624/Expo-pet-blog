import { getBlogFollowList } from "@/api/blog";
import { FontAwesome } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Text } from "../Themed";

import { View } from "react-native";
import ScrollView from "../base/ScrollView";
import BlogCard from "../blog/BlogCard";
import styles from "./ActionStyle";

export default function FollowedBlogList({ userId }: { userId: string }) {
  const loadDataFn = useMemo(() => getBlogFollowList(userId), [userId]);
  return (
    <View className="flex-1 ">
      <ScrollView
        loadDataFn={loadDataFn}
        enableRefresh
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className=" py-2">
            <BlogCard {...item} hideInfo />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <FontAwesome name="inbox" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No data available</Text>
          </View>
        )}
      />
    </View>
  );
}
