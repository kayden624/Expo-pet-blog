import { doLogout } from "@/api/auth";
import { changePassword } from "@/api/user";
import { useLoading } from "@/contexts/LoadingContext";
import useUtil from "@/hooks/useUtil";
import { useMemoizedFn } from "ahooks";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity } from "react-native";
import { View } from "../Themed";

export default function ChangePwd() {
  const [step, setStep] = useState(1); // 1: Verify old password, 2: Set new password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { userInfo } = useUtil();
  const { showLoading, hideLoading } = useLoading();

  const handleVerifyPassword = useMemoizedFn(() => {
    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }

    console.log("userInfo", userInfo);
    if (currentPassword !== userInfo?.password) {
      setError("The current password is incorrect");
      return;
    }
    setStep(2);
    setError("");
  });

  const handleSubmit = useMemoizedFn(async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all password fields");
      return;
    }
    // Password length should be 6 - 20 characters and must contain uppercase, lowercase letters and numbers
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        "Prompt",
        "Password length should be between 6 - 20 characters and must contain uppercase, lowercase letters and numbers"
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The new password and the confirmation password do not match");
      return;
    }

    showLoading();
    try {
      const { status } = (await changePassword(newPassword)) as any;
      if (status === "success") {
        Alert.alert(
          "Success",
          "Password changed successfully. Please log in again"
        );
        doLogout();
      } else {
        throw new Error("Failed to change password");
      }
    } catch (error) {
      Alert.alert("Failure", "Please try again later");
    } finally {
      hideLoading();
    }

    setError("");
  });

  return (
    <View className="flex-1 p-4">
      <View className="bg-white rounded-lg p-4 shadow-sm">
        {step === 1 ? (
          <>
            <Text className="text-lg font-bold mb-4">
              Verify Current Password
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 py-3 mb-4"
              placeholder="Please enter your current password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
            <TouchableOpacity
              className="bg-blue-500 p-3 rounded-lg items-center"
              onPress={handleVerifyPassword}
            >
              <Text className="text-white font-bold">Next Step</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View className="flex-row items-center mb-4">
              <Text className="text-lg font-bold">Set New Password</Text>
            </View>
            <TextInput
              className="border border-gray-300 rounded-lg p-2  py-3 mb-4"
              placeholder="Please enter your new password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              className="border border-gray-300 rounded-lg p-2 py-3 mb-4"
              placeholder="Please confirm your new password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
            <TouchableOpacity
              className="bg-blue-500 p-3 rounded-lg items-center"
              onPress={handleSubmit}
            >
              <Text className="text-white font-bold">Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
