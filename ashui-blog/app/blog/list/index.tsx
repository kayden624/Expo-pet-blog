import { getBlogList, searchBlog } from "@/api/blog";
import ScrollView from "@/components/base/ScrollView";
import BlogCard from "@/components/blog/BlogCard";
import styles from "@/components/my/ActionStyle";
import SearchBar from "@/components/search/SearchBar";
import { View } from "@/components/Themed";
import { NEED_REFRESH } from "@/constants";
import useUtil from "@/hooks/useUtil";
import { getItem, removeItem } from "@/util/storage";
import { FontAwesome } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, Text } from "react-native";

export default function BlogList() {
  const refreshFnRef = useRef<any>(null);
  const { userId, user_id } = useLocalSearchParams<{
    userId: string;
    user_id: string;
  }>();
  const { userInfo, router } = useUtil();
  const [kw, setKw] = useState("");
  const loadDataFn = useMemo(
    () => (kw ? searchBlog(kw, user_id) : getBlogList(userId)),
    [userId, kw, user_id]
  );
  useFocusEffect(
    useCallback(() => {
      getItem(NEED_REFRESH).then((v) => {
        if (v) {
          refreshFnRef.current?.();
          removeItem(NEED_REFRESH);
        }
      });
    }, [])
  );
  const doRefresh = useCallback(() => {
    refreshFnRef.current?.();
  }, []);
  const isSelf = useMemo(() => {
    return userInfo?.userId === userId || userInfo?._id === user_id;
  }, [userId, user_id, userInfo]);
  return (
    <View className="flex-1 px-2 h-full">
      <Stack.Screen
        options={{
          title: "Blog List",
          headerRight: () =>
            isSelf ? (
              <Pressable
                className=" flex-row items-center justify-center   bg-red-500 "
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
                <MaterialIcons name="publish" size={24} color="white" />
                <Text className="font-bold text-white"> New Blog </Text>
              </Pressable>
            ) : null,
        }}
      />
      <SearchBar
        placeholder="Search blog titles"
        value={kw}
        onSearch={(v) => v && setKw(v)}
      />
      <View className="flex-1">
        <ScrollView
          loadDataFn={loadDataFn}
          enableRefresh
          showLoading
          //@ts-ignore
          keyExtractor={(item) => item.blog._id}
          onLoadData={(a, b, r) => {
            refreshFnRef.current = r;
          }}
          renderItem={({ item }) => (
            <View className=" py-2">
              {/*@ts-ignore */}
              <BlogCard
                {...item.blog}
                hideInfo
                authorInfo={item.author}
                onDeleted={doRefresh}
              />
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
      {}
    </View>
  );
}
