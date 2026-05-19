import mongoose, { Schema } from "mongoose";

const commentSchema = mongoose.Schema(
  {
    blog_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "blogs",
    },
    // 默认值0，replies的数量
    count: { type: Number, default: 0 },
    comment: {
      type: String,
      required: true,
    },
    // 发送评论的人
    from: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "users",
    },
    // 回复评论的人，大于2级
    to: {
      type: Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    // 主题，顶级主题为空
    root: { type: Schema.Types.ObjectId, ref: "comments", default: null },
    // // 回复，同一个主题下
    replies: {
      type: [Schema.Types.ObjectId],
      ref: "comments",
    },
    // 点赞用户
    likes_user: {
      type: [Schema.Types.ObjectId],
      ref: "users",
    },
  },
  {
    timestamps: {
      createdAt: "commentedAt",
    },
  }
);

export default mongoose.model("comments", commentSchema);
