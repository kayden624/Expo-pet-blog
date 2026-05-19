import { MaterialIcons } from "@expo/vector-icons";
import { useMemoizedFn } from "ahooks";
import { Video } from "expo-av";
import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { router, Stack } from "expo-router";
import path from "path";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();

  const [mlpermission, requestMlPermission] = MediaLibrary.usePermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const camera = useRef<CameraView>(null);
  const [picture, setPicture] = useState<CameraCapturedPicture>();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<string>();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
    if (mlpermission && !mlpermission.granted && mlpermission.canAskAgain) {
      requestMlPermission();
    }
  }, [permission, mlpermission]);
  const toggleCameraFacing = useMemoizedFn(() => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  });

  const takePicture = async () => {
    const res = await camera.current?.takePictureAsync();
    setPicture(res);
  };

  // Save file to app sandbox
  const saveFile = async (uri?: string) => {
    if (!uri) return;
    // save file
    console.log("saveFile", uri, path.parse(uri));
    const filename = path.parse(uri).base;

    await FileSystem.copyAsync({
      from: uri,
      to: FileSystem.documentDirectory + filename,
    });

    setPicture(undefined);
    setVideo(undefined);
    router.back();
  };

  // Save file to phone album
  const saveToAlbum = async (pic?: CameraCapturedPicture) => {
    if (!pic) return;
    const uri = pic.uri;
    try {
      /*  const tempFile = {
        uri: pic.uri,
        mimeType: "image/" + pic.format,
        fileName: Date.now() + "." + pic.format,
      };
      await setItem(TEMP_FILE_KEY, tempFile); */
      // Create asset
      const asset = await MediaLibrary.createAssetAsync(uri);

      // Create default album
      const album = await MediaLibrary.getAlbumAsync("Camera");
      if (album) {
        // If the album exists, add to the album
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        // If the album does not exist, create a new album and add
        await MediaLibrary.createAlbumAsync("Camera", asset, false);
      }

      // Clean up state
      setPicture(undefined);
      setVideo(undefined);

      router.back();
    } catch (error) {
      console.error("Failed to save to album:", error);
      Alert.alert("Save Failed", "Failed to save to album");
    }
  };

  const onPress = () => {
    if (isRecording) {
      camera.current?.stopRecording();
    } else {
      takePicture();
    }
  };
  if (!permission?.granted) {
    return <ActivityIndicator />;
  }
  if (picture || video) {
    return (
      <View style={{ flex: 1 }}>
        {picture && (
          <Image
            source={{ uri: picture.uri }}
            style={{ width: "100%", flex: 1 }}
          />
        )}

        {video && (
          <Video
            source={{ uri: video }}
            style={{ width: "100%", flex: 1 }}
            shouldPlay
            isLooping
          />
        )}

        <View style={{ padding: 10 }}>
          <SafeAreaView edges={["bottom"]} className="flex-row justify-between">
            <View className="flex-1 items-center justify-center">
              <Button
                title="Cancel"
                onPress={() => {
                  setPicture(undefined);
                  setVideo(undefined);
                }}
              />
            </View>
            <View className="flex-1 items-center justify-center">
              <Button title="OK" onPress={() => saveToAlbum(picture)} />
            </View>
          </SafeAreaView>
        </View>
      </View>
    );
  }
  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: "Camera", headerShown: true }} />
      <CameraView ref={camera} className="w-full h-full" facing={facing}>
        <View style={styles.footer}>
          <MaterialIcons
            name="flip-camera-ios"
            size={24}
            color={"white"}
            onPress={toggleCameraFacing}
          />
          <Pressable
            style={[
              styles.recordButton,
              { backgroundColor: isRecording ? "crimson" : "white" },
            ]}
            onPress={onPress}
          />
          <View></View>
        </View>
      </CameraView>
    </View>
  );
}
const styles = StyleSheet.create({
  footer: {
    marginTop: "auto",
    padding: 20,
    paddingBottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  recordButton: {
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: "white",
  },
});
