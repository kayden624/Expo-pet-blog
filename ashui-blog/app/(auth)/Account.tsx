import BasicInfo from "@/components/account/BasicInfo";
import ChangePwd from "@/components/account/ChangePwd";
import Email from "@/components/account/Email";
import Tab from "@/components/base/Tab";
import { View } from "@/components/Themed";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

export default function Account() {
  return (
    <View className="  flex-1 w-full">
      <Stack.Screen
        options={{ title: "Account Settings", headerShown: true }}
      />
      <Tab tabclassName=" flex-1">
        <Tab.Item label="Info">
          <ScrollView className=" h-full">
            <BasicInfo />
          </ScrollView>
        </Tab.Item>

        <Tab.Item label="Email">
          <ScrollView className=" h-full">
            <Email />
          </ScrollView>
        </Tab.Item>

        <Tab.Item label="Password">
          <ScrollView className=" h-full">
            <ChangePwd />
          </ScrollView>
        </Tab.Item>
      </Tab>
    </View>
  );
}
