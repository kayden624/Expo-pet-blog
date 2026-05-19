import { actionList } from "@/api/user";
import { FontAwesome } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import ScrollView from "../base/ScrollView";
import styles from "./ActionStyle";
import ActionItem from "./ActionType";

export default function Action({ userId }: { userId: string }) {
  const loadDataFn = useMemo(() => actionList(userId), [userId]);

  return (
    <View style={styles.container}>
      <ScrollView
        loadDataFn={loadDataFn}
        enableRefresh
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ActionItem item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <FontAwesome name="inbox" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No activities yet</Text>
          </View>
        )}
      />
    </View>
  );
}
