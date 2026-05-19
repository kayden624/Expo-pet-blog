import UserDetail from "@/components/user/UserDetail";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

export default function UserDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ title: "User Details" }} />
      {!!id && <UserDetail userId={id} />}
    </>
  );
}
