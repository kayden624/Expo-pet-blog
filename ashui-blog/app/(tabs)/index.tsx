import { blogList } from "@/api/home";
import ScrollView from "@/components/base/ScrollView";
import BlogCard from "@/components/blog/BlogCard";

import { Text, View } from "@/components/Themed";
import { useLoading } from "@/contexts/LoadingContext";
import { useMemoizedFn } from "ahooks";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";

import SearchBar from "@/components/search/SearchBar";
import { Image } from "expo-image";
import useUtil from "../../hooks/useUtil";
export default function TabOneScreen() {
  const { width, rpx, router } = useUtil();
  const [data, setData] = useState([] as any[]);
  const currentPage = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const { showLoading, hideLoading } = useLoading();
  useLayoutEffect(() => {
    loadBlog();
  }, []);

  const loadBlog = useMemoizedFn(async (isNew = false) => {
    showLoading();
    if (isNew) {
      currentPage.current = 0;
    }
    try {
      //@ts-ignore
      const { results } = await blogList((currentPage.current += 1));
      if (results?.length) {
        setData(isNew ? results : [...data, ...results]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      hideLoading();
    }
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        titleBar: {
          justifyContent: "center",
          height: 50 * rpx,
          paddingLeft: 10 * rpx,
          paddingRight: 10 * rpx,
        },
      }),
    [rpx]
  );
  const carouselData = [
    {
      color: "bg-red-500",
      text: "Slide 1",
      img: require("@/assets/images/001.jpg"),
    },
    {
      color: "bg-blue-500",
      text: "Slide 2",
      img: require("@/assets/images/002.jpg"),
    },
    {
      color: "bg-green-500",
      text: "Slide 3",
      img: require("@/assets/images/003.jpg"),
    },
  ];

  const onRefresh = useMemoizedFn(async () => {
    await loadBlog(true);
  });

  return (
    <View className="h-full w-full">
      <SearchBar
        placeholder="What are you searching for?"
        onSearch={(searchText) => {
          if (searchText.trim())
            router.push({
              pathname: "/search/result",
              params: { keyword: searchText },
            });
        }}
      />
      <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        data={carouselData}
        autoPlayInterval={5000}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <View className={`${item.color} flex-1 items-center justify-center`}>
            <Image
              source={item.img}
              className="w-full rounded-lg "
              style={{ aspectRatio: 16 / 9 }}
            />
          </View>
        )}
      />
      <View style={styles.titleBar} className="bg-gray-50">
        <Text className="text-base">Hot Recommendations</Text>
      </View>

      <View className="flex-1 bg-slate-100">
        <ScrollView
          renderData={data}
          onRefresh={onRefresh}
          onEndReached={hasMore ? loadBlog : void 0}
          renderItem={({ item }) => (
            <View className="p-4 border-b border-gray-200">
              <BlogCard {...item} />
            </View>
          )}
        />
      </View>
    </View>
  );
}
