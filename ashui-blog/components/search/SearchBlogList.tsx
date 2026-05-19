import { searchBlog } from "@/api/blog";
import { FontAwesome } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Text } from "../Themed";

import { View } from "react-native";
import ScrollView from "../base/ScrollView";
import BlogCard from "../blog/BlogCard";
import styles from "../my/ActionStyle";

export default function SearchBlogList({
  keyword,
  onLoadCount,
}: {
  keyword: string;
  onLoadCount: (n: number) => void;
}) {
  const loadDataFn = useMemo(() => searchBlog(keyword), [keyword]);
  return (
    <View className="flex-1 ">
      <ScrollView
        loadDataFn={loadDataFn}
        enableRefresh
        showLoading
        onLoadData={(_, count) => onLoadCount(count)}
        // @ts-ignore
        keyExtractor={(item) => item.blog._id}
        renderItem={({ item }) => (
          <View className=" py-2">
            {/* @ts-ignore */}
            <BlogCard {...item.blog} summer={item.summer} />
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
