import { FontAwesome } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import ScrollView from "../base/ScrollView";

import { doFollow, followedList } from "@/api/user";
import UserCard from "../user/UserCard";
import styles from "./ActionStyle";

export default function FollowedUserList({
  userId,
  noAction,
}: {
  userId: string;
  noAction?: boolean;
}) {
  const loadDataFn = useMemo(() => followedList(userId), [userId]);
  return (
    <View className="flex-1 ">
      {/*@ts-ignore */}
      <ScrollView
        loadDataFn={loadDataFn}
        enableRefresh
        keyExtractor={(item) => item._id}
        renderItemPro={({ item }, { removeItem }) => (
          <View className=" py-2">
            {/* @ts-ignore */}
            <UserCard
              {...item.personal_info}
              userId={item.userId}
              onDelete={
                noAction
                  ? undefined
                  : () => {
                      // @ts-ignore
                      doFollow(item.userId);
                      removeItem(item);
                    }
              }
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
  );
}
