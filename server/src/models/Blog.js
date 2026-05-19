import mongoose, { Schema } from "mongoose";

const blogSchema = mongoose.Schema(
  {
    blog_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      // required: true,
    },
    content: {
      type: [],
      required: true,
    },
    tags: {
      type: [String],
    },
    draft: {
      type: Boolean,
      default: false,
    },
    activity: {
      total_likes: {
        type: Number,
        default: 0,
      },
      total_comments: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    liked_users: {
      type: [Schema.Types.ObjectId],
      ref: "users",
    },
    // 收藏的用户
    followed_users: {
      type: [Schema.Types.ObjectId],
      ref: "users",
    },
  },
  {
    timestamps: {
      createdAt: "publishedAt",
    },
  }
);

export default mongoose.model("blogs", blogSchema);
