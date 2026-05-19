import { Ionicons } from "@expo/vector-icons";

import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  value?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  value = "",
}: SearchBarProps) {
  const [searchText, setSearchText] = useState(value);

  const handleClear = () => {
    setSearchText("");
    onSearch?.("");
  };

  const handleChangeText = (text: string) => {
    setSearchText(text);
  };

  return (
    <View className="flex-row flex p-2">
      <View className="flex-row flex-1  items-center bg-gray-100 rounded-full px-4 ">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          value={searchText}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          className="flex-1 ml-2 justify-center -mt-2 h-14 text-base  "
          clearButtonMode="never"
          returnKeyType="search"
          // 设置键盘回车键为搜索
          onSubmitEditing={() => {
            onSearch?.(searchText);
          }}
        />
        {searchText ? (
          <Pressable onPress={handleClear}>
            <Ionicons name="close-circle" size={20} color="gray" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
