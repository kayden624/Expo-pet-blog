import { uploadFile } from "@/api/file";
import { updateProfile } from "@/api/user";
import { useLoading } from "@/contexts/LoadingContext";
import useUtil from "@/hooks/useUtil";
import { awatarUrl } from "@/util";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useMemoizedFn } from "ahooks";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Pressable, Text, TextInput, View } from "react-native";

export default function BasicInfo() {
  const { showLoading, hideLoading } = useLoading();
  const { userInfo: userOldInfo } = useUtil();
  const fileRef = useRef<any>(null);
  const fromCamera = useRef(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    bio: "",
    profile_img: "",
  });

  useEffect(() => {
    if (userOldInfo) {
      // Initialize user information
      setUserInfo(userOldInfo);
    }
  }, [userOldInfo]);

  useFocusEffect(
    useCallback(() => {
      useCheckFormCamera();
    }, [])
  );

  const useCheckFormCamera = useMemoizedFn(async () => {
    if (fromCamera.current) {
      // Read temporary data
      /*  const tempFile = await getItem(TEMP_FILE_KEY);
      if (tempFile) {
        fileRef.current = tempFile;
        setUserInfo((prev) => ({
          ...prev,
          profile_img: tempFile.uri,
        }));
      } */
      // Select from gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });

      if (!result.canceled && result.assets[0]) {
        fileRef.current = result.assets[0];
        setUserInfo((prev) => ({
          ...prev,
          profile_img: result.assets[0].uri,
        }));
      }
    }
  });

  const { showActionSheetWithOptions } = useActionSheet();

  const handleImageSelect = () => {
    fromCamera.current = false;
    showActionSheetWithOptions(
      {
        options: ["Cancel", "Select from Gallery", "Take a Photo"],
        cancelButtonIndex: 0,
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          // Select from gallery
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.6,
          });

          if (!result.canceled && result.assets[0]) {
            fileRef.current = result.assets[0];
            setUserInfo((prev) => ({
              ...prev,
              profile_img: result.assets[0].uri,
            }));
          }
        } else if (buttonIndex === 2) {
          // Navigate to the camera page
          fromCamera.current = true;
          router.push("/camera");
        }
      }
    );
  };

  const doUpload = useMemoizedFn(
    async (file: { uri: string; mimeType: string; fileName: string }) => {
      showLoading("Uploading image...");
      try {
        const res = await uploadFile(file);
        console.log("File upload result: ", res);
        return res;
      } catch (error) {
        Alert.alert("Prompt", "Image upload failed");
        return "";
      } finally {
        hideLoading();
      }
    }
  );

  const handleSubmit = async () => {
    // Handle submission logic
    // 1. If the image does not start with http, then the image needs to be uploaded
    console.log("Submitted user information: ", userInfo, fileRef.current);
    let profile_img = userInfo.profile_img;
    if (userInfo.profile_img && !userInfo.profile_img.startsWith("http")) {
      profile_img = await doUpload(fileRef.current);
    }
    const params = {
      username: userInfo.username,
      bio: userInfo.bio,
      profile_img,
    };
    if (!profile_img) {
      //@ts-ignore
      delete params.profile_img;
    }
    showLoading("Saving profile...");
    try {
      await updateProfile(userOldInfo!.userId, params);
    } finally {
      hideLoading();
    }
  };

  return (
    <View className="flex-1 p-4">
      {/* Avatar selection */}
      <Pressable onPress={handleImageSelect} className="items-center mb-6">
        <Image
          source={awatarUrl(userInfo.profile_img)}
          style={{ width: 100, height: 100 }}
          className="rounded-full"
        />
        <Text className="mt-2 text-gray-500">Click to change avatar</Text>
      </Pressable>

      {/* Nickname input */}
      <View className="mb-4">
        <Text className="mb-2 text-gray-700">Nickname</Text>
        <TextInput
          value={userInfo.username}
          onChangeText={(text) =>
            setUserInfo((prev) => ({ ...prev, username: text }))
          }
          className="border border-gray-400 p-2 py-3 rounded-lg"
          placeholder="Please enter your nickname"
        />
      </View>

      {/* Personal description input */}
      <View className="mb-6">
        <Text className="mb-2 text-gray-700">Personal Description</Text>
        <TextInput
          style={{ minHeight: 100 }}
          value={userInfo.bio}
          onChangeText={(text) =>
            setUserInfo((prev) => ({ ...prev, bio: text }))
          }
          className="border border-gray-400 p-2 py-3  rounded-lg"
          placeholder="Please enter your personal description"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Submit button */}
      <Button title="Save Changes" onPress={handleSubmit} />
    </View>
  );
}
