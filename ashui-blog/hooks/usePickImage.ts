import { useActionSheet } from "@expo/react-native-action-sheet";
import { useMemoizedFn } from "ahooks";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
export default function usePickImage() {
  const fromCamera = useRef(false);
  const aspectRef = useRef<[number, number]>([1, 1]);
  const callbackRef = useRef<((file: any) => void) | undefined>(void 0);
  const { showActionSheetWithOptions } = useActionSheet();

  useFocusEffect(
    useCallback(() => {
      useCheckFormCamera();
    }, [])
  );

  const useCheckFormCamera = useMemoizedFn(async () => {
    if (fromCamera.current) {
      // Select an image from the library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: aspectRef.current,
        quality: 0.4,
      });

      if (!result.canceled && result.assets[0]) {
        callbackRef.current?.(result.assets[0]);
      }
    }
  });
  const handleImageSelect = useMemoizedFn(
    (cb?: (file: any) => void, aspect: [number, number] = [1, 1]) => {
      aspectRef.current = aspect;
      callbackRef.current = cb;
      fromCamera.current = false;
      showActionSheetWithOptions(
        {
          options: ["Cancel", "Select from Gallery", "Take a Photo"],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            // Select an image from the library
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: aspect,
              quality: 0.4,
            });

            if (!result.canceled && result.assets[0]) {
              callbackRef.current?.(result.assets[0]);
            }
          } else if (buttonIndex === 2) {
            // Navigate to the camera page
            fromCamera.current = true;
            router.push("/camera");
          }
        }
      );
    }
  );
  return { handleImageSelect };
}
