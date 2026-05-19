import Tab from "@/components/base/Tab";
import SearchBar from "@/components/search/SearchBar";
import SearchBlogList from "@/components/search/SearchBlogList";
import SearchUserList from "@/components/search/SearchUserList";
import { View } from "@/components/Themed";
import { useMemoizedFn } from "ahooks";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function SearchResult() {
  const { keyword } = useLocalSearchParams<{ keyword: string }>();
  const [activeIndex, setActiveIndex] = useState(0);
  const onTabChange = useMemoizedFn((item, index) => {
    // console.log(item, index);
    setActiveIndex(index);
  });

  const [kw, setKw] = useState(keyword);
  const [blogCount, setBlogCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: "Search Results" }} />
      <SearchBar
        placeholder="What are you searching for?"
        value={keyword}
        onSearch={(v) => v && setKw(v)}
      />
      <View className="  flex-1 w-full">
        <Tab tabclassName=" flex-1" onTabChange={onTabChange}>
          <Tab.Item label={`Blogs`} afterLabel={`（${blogCount}）`}>
            <View className="h-full">
              <SearchBlogList onLoadCount={setBlogCount} keyword={kw} />
            </View>
          </Tab.Item>
          <Tab.Item label={`Users`} afterLabel={`（${userCount}）`}>
            <View className="h-full">
              <SearchUserList onLoadCount={setUserCount} keyword={kw} />
            </View>
          </Tab.Item>
        </Tab>
      </View>
    </View>
  );
}
