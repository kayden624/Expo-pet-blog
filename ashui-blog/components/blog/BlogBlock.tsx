import Edit from "@/app/blog/detail/Edit";
import { useMemoizedFn } from "ahooks";
import c from "classnames";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";

interface BlogBlockProps extends Partial<Blog.Block> {
  isEdit?: boolean;
  activeId?: string;
  onSubmit?: (id: string, type: Op, data?: any) => void;
  onAfter?: (id: string) => void;
}

export default function BlogBlock({
  id,
  type,
  data,
  isEdit = false,
  activeId = "",
  onSubmit,
  ...props
}: BlogBlockProps) {
  const editRef = useRef<any>(null);
  const [imageHeight, setImageHeight] = useState(200);
  //修改文本
  const editText = useMemoizedFn((text: string) => {
    onSubmit?.(id || "", "edit", { ...data, text });
  });

  //修改图片
  const editImage = useMemoizedFn((f) => {
    const file = { url: f.uri };
    onSubmit?.(id || "", "edit", { ...data, file });
  });
  //删除
  const onDelete = useMemoizedFn(() => {
    onSubmit?.(id || "", "del");
  });

  const onAfter = useMemoizedFn(() => {
    props.onAfter?.(id || "");
  });
  const onImageLoad = (event: any) => {
    const { width, height } = event.source;
    const screenWidth = Dimensions.get("window").width - 40;
    const calculatedHeight = (height / width) * screenWidth;
    setImageHeight(calculatedHeight);
  };
  useEffect(() => {
    if (id === activeId) {
      editRef.current?.press();
    }
  }, [activeId, id]);

  if (type === "paragraph")
    return (
      <Edit
        ref={editRef}
        isEdit={isEdit}
        onDelete={onDelete}
        onAfter={onAfter}
        text={data?.text}
        onSubmit={editText}
      >
        <View className="py-2">
          <Text className="text-base">{data?.text}</Text>
        </View>
      </Edit>
    );
  if (type === "header")
    return (
      <Edit
        ref={editRef}
        isEdit={isEdit}
        onDelete={onDelete}
        onAfter={onAfter}
        text={data?.text}
        onSubmit={editText}
      >
        <View className="py-2">
          <Text className={c("text-base", `text-${data?.level}xl`)}>
            {data?.text}
          </Text>
        </View>
      </Edit>
    );
  if (type === "image")
    return (
      <Edit
        ref={editRef}
        isEdit={isEdit}
        onDelete={onDelete}
        onAfter={onAfter}
        isImage="16/9"
        onSubmit={editImage}
      >
        <View className="py-2">
          <Image
            source={data?.file?.url}
            contentFit="contain"
            onLoad={onImageLoad}
            style={{
              height: imageHeight,
              width: "100%",
            }}
          />
        </View>
      </Edit>
    );
}
