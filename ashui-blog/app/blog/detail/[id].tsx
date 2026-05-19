import { blogDetail, followBlog, likeBlog, updateBlog } from "@/api/blog";
import { uploadFile } from "@/api/file";
import { doFollow } from "@/api/user";
import { Show } from "@/components/base/Show";
import BlogBlock from "@/components/blog/BlogBlock";
import Comment from "@/components/comment/Comment";
import { NEED_REFRESH } from "@/constants";
import { useLoading } from "@/contexts/LoadingContext";
import useUtil from "@/hooks/useUtil";
import { formatTime, generateId, getFileExtension, getMimeType } from "@/util";
import { setItem } from "@/util/storage";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { AntDesign } from "@expo/vector-icons";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemoizedFn } from "ahooks";
import c from "classnames";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import Edit from "./Edit";

export default function BlogDetail() {
  const { showActionSheetWithOptions } = useActionSheet();

  const { height, userInfo, router } = useUtil();
  const { id, edit } = useLocalSearchParams<{ id: string; edit: string }>();
  const { showLoading, hideLoading } = useLoading();
  const [detail, setDetail] = useState({} as Blog.BlogDetail);
  const [isLike, setIsLike] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [isGuanZhu, setIsGuaZhu] = useState(false);
  const [activeId, setActiveId] = useState("");
  const isEdit = useMemo(() => edit === "1", [edit]);
  useLayoutEffect(() => {
    userInfo && loadDetail(id);
  }, [userInfo]);
  const loadDetail = async (id: string) => {
    if (!id || Number(id) == 0) {
      // Create a blank blog
      setDetail({
        __v: 0,
        draft: false,

        _id: "",
        liked_users: [],
        followed_users: [],
        blog_id: "temp",
        banner: "",
        title: "Enter Title",
        author: {
          userId: userInfo?.userId || "",
          _id: "",
          following: [],
          verified_followers: [],
          personal_info: {
            profile_img: userInfo?.profile_img || "",
            username: userInfo?.username || "",
            bio: "",
          },
        },
        tags: ["blog"],
        publishedAt: "",
        updatedAt: "",
        activity: {
          total_likes: 0,
          total_comments: 0,
          total_reads: 0,
        },
        content: [
          {
            blocks: [],
            time: new Date().getTime(),
            version: "1",
          },
        ],
      });
      return;
    }
    console.log("id:", id);
    try {
      showLoading();
      const { blog } = await blogDetail(id);
      setDetail(blog);
    } catch (error) {
      console.warn(error);
    } finally {
      hideLoading();
    }
  };
  const handleLike = useMemoizedFn(async () => {
    setIsLike((v) => !v);
    await likeBlog(detail._id);
  });
  const handleFollow = useMemoizedFn(async () => {
    setIsFollow((v) => !v);
    await followBlog(detail.blog_id);
  });
  const handleGuanZhu = useMemoizedFn(async () => {
    setIsGuaZhu((v) => !v);
    await doFollow(detail.author.userId);
  });
  // Get the status of whether the user has liked the blog
  const getLikedByUser = async () => {
    console.log("userInfo:", userInfo);
    console.log("detail.liked_users:", detail.liked_users);
    if (detail.liked_users.includes(userInfo?._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
    if (detail.followed_users.includes(userInfo?._id)) {
      setIsFollow(true);
    } else {
      setIsFollow(false);
    }
    if (detail.author.verified_followers.includes(userInfo?._id)) {
      setIsGuaZhu(true);
    } else {
      setIsGuaZhu(false);
    }
  };
  useEffect(() => {
    if (userInfo) {
      getLikedByUser();
    }
  }, [userInfo, detail]);

  const clickAddBtn = useMemoizedFn((id: string = "") => {
    showActionSheetWithOptions(
      {
        options: ["Cancel", "Text", "Title", "Image"],
        cancelButtonIndex: 0,
      },
      async (buttonIndex) => {
        const content = [...detail.content];
        const block = { id: generateId(), type: "", data: {} } as any;
        if (buttonIndex === 1) {
          block.type = "paragraph";
          block.data = {
            text: "",
          };
        } else if (buttonIndex === 2) {
          block.type = "header";
          block.data = {
            text: "",
            level: 2,
          };
        } else if (buttonIndex === 3) {
          block.type = "image";
          block.data = {
            caption: "",
            file: {
              url: "",
            },
            stretched: false,
            withBackground: false,
            withBorder: false,
          };
        }
        if (id) {
          const index = content[0].blocks.findIndex((it) => id === it.id);
          if (index === -1) return;
          content[0].blocks.splice(index + 1, 0, block);
        } else {
          content[0].blocks.push(block);
        }

        setDetail({
          ...detail,
          content,
        });
        setTimeout(() => {
          setActiveId(block.id);
        });
      }
    );
  });

  const insertBlock = useMemoizedFn((id: string) => {
    clickAddBtn(id);
  });

  const editBlock = useMemoizedFn((id: string, type: Op, data: any) => {
    const content = [...detail.content];
    const index = content[0].blocks.findIndex((it) => id === it.id);
    if (index === -1) return;
    if (type === "edit") {
      content[0].blocks[index].data = data;
    } else if (type === "del") {
      content[0].blocks.splice(index, 1);
    }

    setDetail({
      ...detail,
      content,
    });
  });

  const uploadImage = async (uri?: string) => {
    if (!uri) return Promise.resolve("");
    const file = {
      uri,
      mimeType: getMimeType(uri),
      fileName: "temp." + getFileExtension(uri),
    };
    return uploadFile(file);
  };

  const uploadImages = async (blog: Blog.BlogDetail) => {
    // Process the banner
    const ps = [] as Promise<any>[];
    blog.content?.map((d) =>
      d.blocks.map((block) => {
        if (
          block.type === "image" &&
          block.data.file?.url &&
          !block.data.file?.url.startsWith("http")
        ) {
          ps.push(
            uploadImage(block.data.file?.url).then(
              (r) => (block.data.file!.url = r)
            )
          );
        }
      })
    );
    if (blog.banner && !blog.banner.startsWith("http")) {
      ps.push(uploadImage(blog.banner).then((r) => (blog.banner = r)));
    }
    showLoading("Uploading images...");
    await Promise.allSettled(ps);
  };

  const saveDetail = useMemoizedFn(async () => {
    if (!detail.title) {
      Alert.alert("Prompt", "Title cannot be empty");
      return;
    }
    if (!detail.banner) {
      Alert.alert("Prompt", "Banner cannot be empty");
      return;
    }
    if (!detail.content[0].blocks.length) {
      Alert.alert("Prompt", "Content cannot be empty");
      return;
    }

    console.log("detail:", detail);
    await uploadImages(detail);
    const params = {
      banner: detail.banner,
      content: detail.content[0],
      draft: false,
      id: detail.blog_id,
      tags: detail.tags,
      title: detail.title,
    };
    if (detail.blog_id === "temp") {
      //@ts-ignore
      delete params.id;
    }
    console.log("params:", params);
    showLoading("Publishing blog...");
    await updateBlog(params);
    await setItem(NEED_REFRESH, 1);
    hideLoading();
    router.back();
  });
  return (
    <ScrollView className=" ">
      <View className="  w-full">
        <Stack.Screen
          options={{
            title: isEdit ? "Edit Blog" : "Blog Details",
            headerRight: () =>
              isEdit ? (
                <Pressable
                  className=" flex-row items-center justify-center   bg-red-500 "
                  onPress={saveDetail}
                >
                  <MaterialIcons name="publish" size={24} color="white" />
                  <Text className="font-bold text-white"> Publish </Text>
                </Pressable>
              ) : null,
          }}
        />

        <View
          className="flex-1   bg-white rounded-lg m-4 relative shadow-lg p-4 pb-20 "
          style={{ minHeight: 0.8 * height, position: "relative" }}
        >
          {!isEdit && (
            <>
              <Pressable
                onPress={handleLike}
                className={c(
                  "w-14 h-14 justify-center items-center z-30  rounded-full absolute right-2 mx-auto bottom-2",
                  isLike ? "bg-red-500" : "bg-red-200"
                )}
              >
                <Text className="text-white justify-center items-center">
                  <AntDesign name="like2" size={30} />
                </Text>
                <Text className="text-white justify-center items-center">
                  Like
                </Text>
              </Pressable>

              <View className="items-center w-full absolute left-4  z-20     bottom-2  ">
                <Pressable
                  onPress={handleFollow}
                  className={c(
                    "w-14 h-14 rounded-full  justify-center items-center",
                    isFollow ? "bg-orange-500" : "bg-orange-200"
                  )}
                >
                  <Text>
                    <AntDesign name="staro" color={"white"} size={30} />
                  </Text>
                  <Text className="text-white justify-center items-center">
                    Favorite
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={handleGuanZhu}
                className={c(
                  "w-14 h-14 rounded-full absolute left-2 bottom-2 z-30 justify-center items-center",
                  isGuanZhu ? "bg-pink-500" : "bg-pink-200"
                )}
              >
                <Text>
                  <AntDesign name="hearto" color={"white"} size={30} />
                </Text>
                <Text className="text-white justify-center items-center">
                  Follow
                </Text>
              </Pressable>
            </>
          )}

          {detail?.blog_id ? (
            <>
              <Edit
                classNames="mb-4"
                isEdit={isEdit}
                isImage="16/9"
                onSubmit={(f) => {
                  console.log("f", f);
                  setDetail({
                    ...detail,
                    banner: f.uri,
                  });
                }}
              >
                <Image
                  source={detail.banner}
                  className="w-full rounded-lg "
                  style={{ aspectRatio: 16 / 9 }}
                />
              </Edit>
              <Edit
                classNames="mb-2"
                isEdit={isEdit}
                text={detail.title}
                onSubmit={(text) => {
                  setDetail({
                    ...detail,
                    title: text,
                  });
                }}
              >
                <Text className="font-bold text-2xl ">{detail.title}</Text>
              </Edit>
              <View className="flex-row items-center gap-2 mb-2">
                <Image
                  source={detail.author.personal_info.profile_img}
                  className="rounded-full"
                  style={{ width: 30, aspectRatio: 1 }}
                />
                <Text>{detail.author.personal_info.username}</Text>
              </View>
              {/*    <Text className="text-sm text-gray-400">
                <FontAwesome5 name="hashtag" size={14} />
                <Text> </Text>
                {detail.tags?.map((it, index) => (
                  <Fragment key={index}>{it}</Fragment>
                ))}
              </Text> */}
              <View className="flex-row gap-3 py-1 mb-3">
                <Text className="text-sm text-gray-400   ">
                  <Fontisto name="date" size={14} style={{ marginRight: 8 }} />
                  <Text> </Text>
                  <Text>{formatTime(detail.publishedAt)}</Text>
                </Text>

                <Text className="text-sm text-gray-400">
                  <AntDesign name="like2" size={16} />
                  <Text> </Text>
                  {detail.activity.total_likes || 0}
                </Text>
                <Text className="text-sm text-gray-400">
                  <AntDesign name="message1" size={16} />
                  <Text> </Text>
                  {detail.activity.total_comments || 0}
                </Text>
                <Text className="text-sm text-gray-400">
                  <AntDesign name="eyeo" size={18} />
                  <Text> </Text>
                  {detail.activity.total_reads || 0}
                </Text>
              </View>
              <View>
                {detail.content?.map((d, index) =>
                  d.blocks.map((block) => (
                    <BlogBlock
                      activeId={activeId}
                      onAfter={insertBlock}
                      onSubmit={editBlock}
                      isEdit={isEdit}
                      key={block.id}
                      {...block}
                    />
                  ))
                )}
                {isEdit && (
                  <Pressable
                    onPress={() => clickAddBtn()}
                    className="bg-red-300 h-10 mt-3 rounded justify-center items-center"
                  >
                    <Text className="text-white text-xl">Add a New Item</Text>
                  </Pressable>
                )}
              </View>
            </>
          ) : null}
        </View>

        <View className="pt-1"></View>
        {!isEdit && (
          <Show when={!!detail.blog_id}>
            <View className="flex-1 bg-white rounded-lg m-4 shadow-lg p-4 ">
              <Comment
                blog_id={detail._id}
                blogId={detail.blog_id}
                total={detail.activity?.total_comments || 0}
              />
            </View>
          </Show>
        )}
      </View>
    </ScrollView>
  );
}
