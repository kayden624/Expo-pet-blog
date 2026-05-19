import { followingList } from "@/api/user";
import { FontAwesome } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import ScrollView from "../base/ScrollView";

import UserCard from "../user/UserCard";
import styles from "./ActionStyle";

export default function FollowingUserList({ userId }: { userId: string }) {
  const loadDataFn = useMemo(() => followingList(userId), [userId]);
  return (
    <View className="flex-1 ">
      <ScrollView
        loadDataFn={loadDataFn}
        enableRefresh
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
