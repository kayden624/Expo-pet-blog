import { searchUser } from "@/api/user";
import { FontAwesome } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import ScrollView from "../base/ScrollView";

import styles from "../my/ActionStyle";
import UserCard from "../user/UserCard";

export default function SearchUserList({
  keyword,
  onLoadCount,
}: {
  keyword: string;
  onLoadCount: (n: number) => void;
}) {
  const loadDataFn = useMemo(() => searchUser(keyword), [keyword]);
  return (
    <View className="flex-1 ">
      <ScrollView
        loadDataFn={loadDataFn}
        enableRefresh
        onLoadData={(_, count) => onLoadCount(count)}
        showLoading
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className=" py-2">
            {/* @ts-ignore*/}
            <UserCard {...item.personal_info} userId={item.userId} />
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
