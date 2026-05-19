import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  text: string;
  onChangeText: (text: string) => void;
  title?: string;
}

export default function CommentModal({
  visible,
  onClose,
  onSubmit,
  text,
  onChangeText,

  title = "Comment",
}: CommentModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end"
      >
        <View className="flex-1 justify-end bg-opacity-30">
          <View className="bg-white shadow-lg p-4 rounded-t-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-4 min-h-[100px]"
              multiline
              placeholder="Please enter your reply..."
              value={text}
              onChangeText={onChangeText}
              returnKeyType="send"
              blurOnSubmit={true}
              onSubmitEditing={() => onSubmit(text)}
            />

            <TouchableOpacity
              className="bg-blue-500 p-3 rounded-lg items-center"
              onPress={() => onSubmit(text)}
            >
              <Text className="text-white font-bold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
