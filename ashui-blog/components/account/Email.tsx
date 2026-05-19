import { doLogout } from "@/api/auth";
import { checkEmailisExist, updateProfile } from "@/api/user";
import { useLoading } from "@/contexts/LoadingContext";
import useUtil from "@/hooks/useUtil";
import { useMemoizedFn } from "ahooks";
import React, { useEffect, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

export default function Email() {
  const { showLoading, hideLoading } = useLoading();
  const [email, setEmail] = useState("");
  const { userInfo: userOldInfo, router } = useUtil();
  useEffect(() => {
    if (userOldInfo) {
      // Initialize user information
      setEmail(userOldInfo.email);
    }
  }, [userOldInfo]);
  const handleSubmit = useMemoizedFn(async () => {
    if (!email) {
      // Prompt message can be added
      return;
    }
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      // Invalid email format
      Alert.alert("Please enter a valid email address");
      return;
    }

    if (email === userOldInfo?.email) {
      Alert.alert("The new email is the same as the original email");
      return;
    }
    showLoading();
    // Check if the email is already registered
    const { exists } = (await checkEmailisExist(email)) as any;
    if (exists) {
      Alert.alert("This email address is already registered");
      return;
    }
    // Confirm to change the email?
    Alert.alert("Change Email", "Are you sure you want to change your email?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            showLoading();
            await updateProfile(userOldInfo!.userId, { email });
            Alert.alert(
              "Success",
              "Email changed successfully. Please log in again"
            );
            doLogout();
          } catch (error) {
            Alert.alert("Failure", "Please try again later");
          } finally {
            hideLoading();
          }
        },
      },
    ]);
    // Logic to submit the email change
    console.log("Submit email change", { email });
  });

  return (
    <View className="flex-1 p-4">
      {/* Email input */}
      <View className="mb-4">
        <Text className="mb-2 text-gray-700">New Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          className="border border-gray-400 p-2 py-3 rounded-lg"
          placeholder="Please enter a new email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Submit button */}
      <Button title="Confirm Change" onPress={handleSubmit} />
    </View>
  );
}
