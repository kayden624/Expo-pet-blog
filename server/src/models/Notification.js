import mongoose, { Schema } from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["likeBlog", "followUser", "createBlog", "comment", "reply"],
      required: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "blogs",
    },
    // 通知者
    notification_for: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "users",
    },
    // 操作者
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },// 被关注的用户
    followedUser: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
    // 如果有回复，则存放被回复的评论id
    replied_on_comment: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("notifications", notificationSchema);
