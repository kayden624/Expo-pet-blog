import useUtil from "@/hooks/useUtil";
import { awatarUrl, formatTime } from "@/util";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text } from "react-native";
import { View } from "../Themed";
import styles from "./ActionStyle";
// 动态类型定义
type ActionType = "followUser" | "likeBlog" | "reply" | "comment" | "create";

// 动态项渲染组件
const ActionItem = ({ item }: { item: any }) => {
  console.log("🚀 ~ file: ActionType.tsx:12 ~ item:", item);
  const { router } = useUtil();

  // 根据动态类型渲染不同的图标和文本
  const renderActionContent = () => {
    switch (item.type) {
      //关注了博主
      case "followUser":
        return (
          <View style={styles.followAction}>
            <AntDesign name="adduser" size={16} color="#1e88e5" />
            <Text style={styles.actionText}>Followed the blogger</Text>
            <Pressable
              onPress={() => {
                console.log("🚀 ~ file: ActionType.tsx:25 ~ item:", item);
              }}
            >
              <Text className="text-sky-600 font-semibold">
                {item.followedUser?.personal_info.username}
              </Text>
            </Pressable>
          </View>
        );
      //点赞了博客
      case "likeBlog":
        return (
          <View style={styles.likeAction}>
            <View style={styles.likeHeader}>
              <AntDesign name="heart" size={16} color="#e53935" />
              <Text style={styles.actionText}>Liked the blog</Text>
            </View>

            {item.blog && (
              <Pressable
                onPress={() => {
                  router.push(`/blog/detail/${item.blog.blog_id}`);
                }}
              >
                <View style={styles.blogInfo}>
                  <Text style={styles.blogTitle} numberOfLines={1}>
                    《{item.blog.title}》
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        );
      //评论了博客
      case "comment":
        return (
          <View style={styles.commentAction}>
            <View style={styles.actionHeader}>
              <AntDesign name="message1" size={16} color="#43a047" />
              <Text style={styles.actionText}>Commented on the blog</Text>
            </View>

            {item.blog && (
              <Pressable
                onPress={() => {
                  router.push(`/blog/detail/${item.blog.blog_id}`);
                }}
                style={styles.blogInfo}
              >
                <Text style={styles.blogTitle} numberOfLines={1}>
                  《{item.blog.title}》
                </Text>
                {item.comment && (
                  <View style={styles.commentContent}>
                    <Text
                      style={styles.commentText}
                      className="!text-sky-600"
                      numberOfLines={2}
                    >
                      “{item?.comment?.comment}”
                    </Text>
                  </View>
                )}
              </Pressable>
            )}
          </View>
        );
      case "reply":
        return (
          <View style={styles.replyAction}>
            <View style={styles.actionHeader}>
              <AntDesign name="back" size={16} color="#7b1fa2" />
              <Text style={styles.actionText}>
                Replied to the comment of{" "}
                <Text style={styles.highlightText}>
                  {item.notification_for?.personal_info?.username}
                </Text>
              </Text>
            </View>

            {item.blog && (
              <Pressable
                onPress={() => {
                  router.push(`/blog/detail/${item.blog.blog_id}`);
                }}
                style={styles.blogInfo}
              >
                <Text style={styles.blogTitle} numberOfLines={1}>
                  《{item.blog.title}》
                </Text>
                {item.comment && (
                  <View style={styles.commentContent}>
                    <Text
                      style={styles.commentText}
                      className="!text-sky-600"
                      numberOfLines={2}
                    >
                      “{item?.comment?.comment}”
                    </Text>
                  </View>
                )}
              </Pressable>
            )}
          </View>
        );
      case "createBlog":
        return (
          <View style={styles.createAction}>
            <View style={styles.actionHeader}>
              <AntDesign name="edit" size={16} color="#fb8c00" />
              <Text style={styles.actionText}>Published a new blog</Text>
            </View>

            {item.blog && (
              <Pressable
                onPress={() => {
                  router.push(`/blog/detail/${item.blog.blog_id}`);
                }}
                style={styles.blogInfo}
              >
                <Text style={styles.blogTitle} numberOfLines={1}>
                  《{item.blog.title}》
                </Text>
              </Pressable>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.actionItem}>
      <Image
        source={awatarUrl(item.user.personal_info.profile_img)}
        style={styles.avatar}
      />

      <View style={styles.actionContent}>
        <View style={styles.actionHeader}>
          <Text style={styles.username}>
            {item.user.personal_info.username}-{item.type}
          </Text>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
        </View>

        {renderActionContent()}
      </View>
    </View>
  );
};

export default ActionItem;
