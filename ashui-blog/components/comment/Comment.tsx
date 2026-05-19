import { addComment, deleteComment, getCommentListByBlogId } from "@/api/blog";
import { useLoading } from "@/contexts/LoadingContext";
import useUtil from "@/hooks/useUtil";
import { formatTime } from "@/util";
import { AntDesign } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useMemoizedFn } from "ahooks";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Show } from "../base/Show";
import CommentModal from "./Modal";

interface CommentProps {
  blogId: string;
  total: number;
  blog_id: string;
}

export default function Comment({ blogId, total, blog_id }: CommentProps) {
  const [comments, setComments] = useState<Comment.Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [currentCommentId, setCurrentCommentId] = useState("");
  const { showLoading, hideLoading } = useLoading();
  const { isLogin, debouncePress, userInfo } = useUtil();
  const [allLength, setAllLength] = useState(total);
  useLayoutEffect(() => {
    loadComments();
  }, []);

  const loadComments = useMemoizedFn(async () => {
    if (!blogId) return;
    try {
      const { results } = await getCommentListByBlogId(blogId);
      console.log("results", results);
      if (results) {
        setComments(results);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  });

  const handleReply = async (commentId: string) => {
    if (!(await isLogin())) {
      // If not logged in, go to the login page
      router.push("/Login");
      return;
    }
    setCurrentCommentId(commentId);
    setReplyModalVisible(true);
  };

  const handleDelete = async (commentId: string) => {
    try {
      showLoading();
      await deleteComment(commentId);
      setAllLength((v) => v - 1);
    } finally {
      await loadComments();
      hideLoading();
    }
  };

  const submitReply = async () => {
    // Add the logic to submit the reply here
    console.log("Reply content:", replyText);
    console.log("Reply comment ID:", currentCommentId);
    // Clear the text and close the modal after submission
    setReplyText("");
    setReplyModalVisible(false);
    showLoading();
    try {
      if (currentCommentId === blogId) {
        // This means adding a comment
        await addComment({
          blog_id: blog_id,
          comment: replyText,
          from: userInfo?._id || "",
        });
      } else {
        await addComment({
          blog_id: blog_id,
          comment: replyText,
          from: userInfo?._id || "",
          root: currentCommentId,
        });
      }
      setAllLength((v) => v + 1);
    } finally {
      await loadComments();
      hideLoading();
    }
  };

  const renderComment = (comment: Comment.Comment, level = 0) =>
    comment?._id ? (
      <View key={comment._id} style={{ marginLeft: level * 16 }}>
        <View className="flex-row items-center mb-2">
          <Image
            source={{ uri: comment.from.personal_info.profile_img }}
            className="rounded-full mr-2"
            style={{ width: 32, aspectRatio: 1 }}
          />
          <View>
            <Text className="font-medium">
              {comment.from.personal_info.username}
            </Text>
            <View className="flex-row gap-2 items-center">
              <Text className="text-xs text-gray-500  pt-1">
                {formatTime(comment.commentedAt, "ago")}
              </Text>

              {!!comment.count && (
                <Text className="text-sm text-gray-500">
                  <AntDesign name="message1" size={13} />
                  <Text> </Text>
                  {comment.count || 0}
                </Text>
              )}

              {level === 0 && (
                <Pressable onPress={() => handleReply(comment._id)}>
                  <Text className="underline">Reply</Text>
                </Pressable>
              )}
              <Show when={userInfo?._id === comment.from._id}>
                <Pressable
                  className="flex-row items-center gap-1 pt-2 px-3"
                  onPress={() => handleDelete(comment._id)}
                >
                  <FontAwesome6 name="trash-can" size={16} color="gray" />
                  <Text>Delete</Text>
                </Pressable>
              </Show>
            </View>
          </View>
        </View>
        <Text className="text-base" style={{ paddingLeft: 40 }}>
          {comment.comment}
        </Text>
        <View className="mt-3">
          <ScrollView style={{ maxHeight: 300 }}>
            {comment.replies?.map((reply, index) => (
              <View key={reply._id + index} className="  pl-3">
                {renderComment(reply, level + 1)}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    ) : null;

  return (
    <View className="p-4">
      <View className="flex-row items-center mb-4">
        <View className=" flex-row items-center ">
          <AntDesign name="message1" size={20} />
          <Text className="ml-2 font-bold text-lg">{allLength} Comments</Text>
        </View>

        <Pressable
          onPress={() => {
            debouncePress(() => handleReply(blogId));
          }}
          className="ml-auto flex-row items-center   border rounded-lg border-gray-500 shadow-2xl p-1 px-2"
        >
          <FontAwesome name="keyboard-o" size={20} color="black" />
          <Text className="ml-2   text-sm">Add Comment</Text>
        </Pressable>
      </View>

      {comments?.length ? (
        comments.map((it) => renderComment(it))
      ) : (
        <Text className="text-gray-500">
          {loading ? "Loading..." : "No comments yet"}
        </Text>
      )}

      {/* Use the new CommentModal component */}
      <CommentModal
        visible={replyModalVisible}
        onClose={() => setReplyModalVisible(false)}
        onSubmit={submitReply}
        text={replyText}
        onChangeText={setReplyText}
        title={currentCommentId === blogId ? "Add Comment" : "Reply to Comment"}
      />
    </View>
  );
}
